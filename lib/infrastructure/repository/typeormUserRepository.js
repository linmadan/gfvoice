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
        const queryBuilder = getRepository("User").createQueryBuilder("user")
        const {
            userID,
            phone,
            bindPhone
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
        const userEntity = await queryBuilder.getOne()
        if (userEntity) {
            return transformToDomainModel(userEntity, "user", User)
        }
        else {
            return null
        }
    }

    async find(queryOptions) {
        const queryBuilder = getRepository("User").createQueryBuilder("user")
        const {
            offset,
            limit
        } = queryOptions
        if (_.isUndefined(offset)) {
            queryBuilder.skip(0)
        }
        else {
            if (!_.isNull(offset)) {
                queryBuilder.skip(offset)
            }
        }
        if (_.isUndefined(limit)) {
            queryBuilder.take(20)
        }
        else {
            if (!_.isNull(limit)) {
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
