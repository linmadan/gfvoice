const _ = require('lodash')
const {
    getRepository
} = require('typeorm')
const {
    transformToDomainModel,
    transformToEntity
} = require('../typeorm/transform')
const UserEntity = require('../typeorm/entities/user')
const User = require('../../domain/user')
const constant = require('../../util/constant')

class Repository {
    constructor({
                    transactionContext = null
                } = {}) {
        this._transactionManager = _.isNull(transactionContext) ? null : transactionContext.queryRunner.manager
    }

    async save(user) {
        const userEntity = transformToEntity(user, "user", UserEntity)
        if (_.isNull(this._transactionManager)) {
            const userRepository = getRepository("User")
            await userRepository.save(userEntity)
        }
        else {
            await this._transactionManager.save(userEntity)
        }
        if (user.id) {
            return user
        }
        else {
            user.id = userEntity.id
        }
        return user
    }

    async remove(user) {
        const userEntity = transformToEntity(user, "user", UserEntity)
        if (_.isNull(this._transactionManager)) {
            const userRepository = getRepository("User")
            await userRepository.remove(userEntity)
        }
        else {
            await this._transactionManager.remove(userEntity)
        }
    }

    async findOne(queryOptions) {
        let queryBuilder
        if (_.isNull(this._transactionManager)) {
            queryBuilder = getRepository("User").createQueryBuilder("user")
        }
        else {
            queryBuilder =  this._transactionManager.createQueryBuilder("User", "user")
        }
        const {
            userID,
            phone,
            bindPhone,
            platID,
        } = queryOptions
        if (userID) {
            queryBuilder.where(`user.id = :userID`, {userID})
        }
        if (phone) {
            queryBuilder.where(`user.phone = :phone`, {phone})
        }
        if (bindPhone) {
            queryBuilder.where(`user.bindPhone = :bindPhone`, {bindPhone})
        }
        if (platID) {
            queryBuilder.where(`user.platID = :platID`, {platID})
        }
        const userEntity = await queryBuilder.getOne()
        if (userEntity) {
            return transformToDomainModel(userEntity, "user", User)
        }
        else {
            return null
        }
    }

    async find(queryOptions) {
        let queryBuilder
        if (_.isNull(this._transactionManager)) {
            queryBuilder = getRepository("User").createQueryBuilder("user")
        }
        else {
            queryBuilder =  this._transactionManager.createQueryBuilder("User", "user")
        }
        const {
            name,
            offset,
            limit
        } = queryOptions
        if (!_.isEmpty(name)) {
            queryBuilder.andWhere(`user.name LIKE '%${name}%'`)
        }
        if (_.isUndefined(offset)) {
            queryBuilder.skip(0)
        } else {
            queryBuilder.skip(offset)
        }
        if (_.isUndefined(limit)) {
            queryBuilder.take(20)
        } else {
            if (limit != 0) {
                queryBuilder.take(limit)
            }
        }
        queryBuilder
            .orderBy("user.id", "DESC")
        const [userEntitys, count] = await queryBuilder.getManyAndCount()
        return {
            users: userEntitys.map(userEntity => transformToDomainModel(userEntity, "user", User)),
            count
        }
    }
}

function createRepository(options) {
    return new Repository(options)
}

module.exports = createRepository
