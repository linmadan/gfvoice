const _ = require('lodash')
const {
    getRepository
} = require('typeorm')
const {
    transformToDomainModel,
    transformToEntity
} = require('../typeorm/transform')
const poetryTypeRule = require('../typeorm/transform/rule/poetryType')
const PoetryTypeEntity = require('../typeorm/entities/poetryType')
const PoetryType = require('../../domain/poetryType')
const constant = require('../../util/constant')

class Repository {
    constructor({
                    transactionContext = null
                } = {}) {
        this._transactionManager = _.isNull(transactionContext) ? null : transactionContext.queryRunner.manager
    }

    async save(poetryType) {
        const poetryTypeEntity = transformToEntity(poetryType, poetryTypeRule, PoetryTypeEntity)
        if (_.isNull(this._transactionManager)) {
            const poetryTypeRepository = getRepository("PoetryType")
            await poetryTypeRepository.save(poetryTypeEntity)
        }
        else {
            await this._transactionManager.save(poetryTypeEntity)
        }
        if (poetryType.id) {
            return poetryType
        }
        else {
            poetryType.id = poetryTypeEntity.id
        }
        return poetryType
    }

    async remove(poetryType) {
        const poetryTypeEntity = transformToEntity(poetryType, poetryTypeRule, PoetryTypeEntity)
        if (_.isNull(this._transactionManager)) {
            const poetryTypeRepository = getRepository("PoetryType")
            await poetryTypeRepository.remove(poetryTypeEntity)
        }
        else {
            await this._transactionManager.remove(poetryTypeEntity)
        }
    }

    async findOne(queryOptions) {
        const queryBuilder = getRepository("PoetryType").createQueryBuilder("poetryType")
        const {
            poetryTypeID
        } = queryOptions
        if (poetryTypeID) {
            queryBuilder.where(`poetryType.id = :poetryTypeID`, {poetryTypeID})
        }
        const poetryTypeEntity = await queryBuilder.getOne()
        if (poetryTypeEntity) {
            return transformToDomainModel(poetryTypeEntity, poetryTypeRule, PoetryType)
        }
        else {
            return null
        }
    }

    async find(queryOptions) {
        const queryBuilder = getRepository("PoetryType").createQueryBuilder("poetryType")
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
            .orderBy("poetryType.id", "DESC")
        const [poetryTypeEntitys, count] = await queryBuilder.getManyAndCount()
        return {
            poetryTypes: poetryTypeEntitys.map(poetryTypeEntity => transformToDomainModel(poetryTypeEntity, poetryTypeRule, PoetryType)),
            count
        }
    }
}

function createRepository(options) {
    return new Repository(options)
}

module.exports = createRepository
