const _ = require('lodash')
const {
    getRepository
} = require('typeorm')
const {
    transformToDomainModel,
    transformToEntity
} = require('../typeorm/transform')
const ComplainEntity = require('../typeorm/entities/complain')
const Complain = require('../../domain/complain')
const constant = require('../../util/constant')

class Repository {
    constructor({
                    transactionContext = null
                } = {}) {
        this._transactionManager = _.isNull(transactionContext) ? null : transactionContext.queryRunner.manager
    }

    async save(complain) {
        const complainEntity = transformToEntity(complain, "complain", ComplainEntity)
        if (_.isNull(this._transactionManager)) {
            const complainRepository = getRepository("Complain")
            await complainRepository.save(complainEntity)
        }
        else {
            await this._transactionManager.save(complainEntity)
        }
        if (complain.id) {
            return complain
        }
        else {
            complain.id = complainEntity.id
        }
        return complain
    }

    async remove(complain) {
        const complainEntity = transformToEntity(complain, "complain", ComplainEntity)
        if (_.isNull(this._transactionManager)) {
            const complainRepository = getRepository("Complain")
            await complainRepository.remove(complainEntity)
        }
        else {
            await this._transactionManager.remove(complainEntity)
        }
    }

    async findOne(queryOptions) {
        const queryBuilder = getRepository("Complain").createQueryBuilder("complain")
        const {
            complainID,
            type,
            complainant,
            target
        } = queryOptions
        if (complainID) {
            queryBuilder.where(`complain.id = :complainID`, {complainID})
        }
        if (type && complainant && target) {
            queryBuilder.where(`complain.type = :type`, {type})
                .andWhere(`complain.complainant = :complainant`, {complainant})
                .andWhere(`complain.target = :target`, {target})
        }
        const complainEntity = await queryBuilder.getOne()
        if (complainEntity) {
            return transformToDomainModel(complainEntity, "complain", Complain)
        }
        else {
            return null
        }
    }

    async find(queryOptions) {
        const queryBuilder = getRepository("Complain").createQueryBuilder("complain")
        const {
            offset,
            limit
        } = queryOptions
        if (_.isUndefined(offset)) {
            queryBuilder.skip(0)
        }
        else {
            if (_.isInteger(offset)) {
                queryBuilder.skip(offset)
            }
        }
        if (_.isUndefined(limit)) {
            queryBuilder.take(20)
        }
        else {
            if (_.isInteger(limit) && limit != 0) {
                queryBuilder.take(limit)
            }
        }
        queryBuilder
            .orderBy("complain.id", "DESC")
        const [complainEntitys, count] = await queryBuilder.getManyAndCount()
        return {
            complains: complainEntitys.map(complainEntity => transformToDomainModel(complainEntity, "complain", Complain)),
            count
        }
    }
}

function createRepository(options) {
    return new Repository(options)
}

module.exports = createRepository
