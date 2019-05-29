const _ = require('lodash')
const {
    getRepository
} = require('typeorm')
const {
    transformToDomainModel,
    transformToEntity
} = require('../typeorm/transform')
const PickRecordEntity = require('../typeorm/entities/pickRecord')
const PickRecord = require('../../domain/pickRecord')
const constant = require('../../util/constant')

class Repository {
    constructor({
                    transactionContext = null
                } = {}) {
        this._transactionManager = _.isNull(transactionContext) ? null : transactionContext.queryRunner.manager
    }

    async save(pickRecord) {
        const pickRecordEntity = transformToEntity(pickRecord, "pickRecord", PickRecordEntity)
        if (_.isNull(this._transactionManager)) {
            const pickRecordRepository = getRepository("PickRecord")
            await pickRecordRepository.save(pickRecordEntity)
        }
        else {
            await this._transactionManager.save(pickRecordEntity)
        }
        if (pickRecord.id) {
            return pickRecord
        }
        else {
            pickRecord.id = pickRecordEntity.id
        }
        return pickRecord
    }

    async remove(pickRecord) {
        const pickRecordEntity = transformToEntity(pickRecord, "pickRecord", PickRecordEntity)
        if (_.isNull(this._transactionManager)) {
            const pickRecordRepository = getRepository("PickRecord")
            await pickRecordRepository.remove(pickRecordEntity)
        }
        else {
            await this._transactionManager.remove(pickRecordEntity)
        }
    }

    async findOne(queryOptions) {
        let queryBuilder
        if (_.isNull(this._transactionManager)) {
            queryBuilder = getRepository("PickRecord").createQueryBuilder("pickRecord")
        }
        else {
            queryBuilder = this._transactionManager.createQueryBuilder("PickRecord", "pickRecord")
        }
        const {
            pickRecordID,
            poetryVoiceID,
            fromUserID,
        } = queryOptions
        if (pickRecordID) {
            queryBuilder.where(`pickRecord.id = :pickRecordID`, {pickRecordID})
        }
        if (poetryVoiceID && fromUserID) {
            queryBuilder.where(`pickRecord.poetryVoiceID = :poetryVoiceID`, {poetryVoiceID})
                .andWhere(`pickRecord.fromUserID = :fromUserID`, {fromUserID})
        }
        const pickRecordEntity = await queryBuilder.getOne()
        if (pickRecordEntity) {
            return transformToDomainModel(pickRecordEntity, "pickRecord", PickRecord)
        }
        else {
            return null
        }
    }

    async find(queryOptions) {
        let queryBuilder
        if (_.isNull(this._transactionManager)) {
            queryBuilder = getRepository("PickRecord").createQueryBuilder("pickRecord")
        }
        else {
            queryBuilder = this._transactionManager.createQueryBuilder("PickRecord", "pickRecord")
        }
        const {
            offset,
            limit
        } = queryOptions
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
            .orderBy("pickRecord.id", "DESC")
        const [pickRecordEntitys, count] = await queryBuilder.getManyAndCount()
        return {
            pickRecords: pickRecordEntitys.map(pickRecordEntity => transformToDomainModel(pickRecordEntity, "pickRecord", PickRecord)),
            count
        }
    }
}

function createRepository(options) {
    return new Repository(options)
}

module.exports = createRepository
