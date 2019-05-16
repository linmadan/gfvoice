const _ = require('lodash')
const {
    getRepository
} = require('typeorm')
const {
    transformToDomainModel,
    transformToEntity
} = require('../typeorm/transform')
const PoetryVoiceEntity = require('../typeorm/entities/poetryVoice')
const PoetryVoice = require('../../domain/poetryVoice')
const constant = require('../../util/constant')

class Repository {
    constructor({
                    transactionContext = null
                } = {}) {
        this._transactionManager = _.isNull(transactionContext) ? null : transactionContext.queryRunner.manager
    }

    async save(poetryVoice) {
        const poetryVoiceEntity = transformToEntity(poetryVoice, "poetryVoice", PoetryVoiceEntity)
        if (_.isNull(this._transactionManager)) {
            const poetryVoiceRepository = getRepository("PoetryVoice")
            await poetryVoiceRepository.save(poetryVoiceEntity)
        }
        else {
            await this._transactionManager.save(poetryVoiceEntity)
        }
        if (poetryVoice.id) {
            return poetryVoice
        }
        else {
            poetryVoice.id = poetryVoiceEntity.id
        }
        return poetryVoice
    }

    async remove(poetryVoice) {
        const poetryVoiceEntity = transformToEntity(poetryVoice, "poetryVoice", PoetryVoiceEntity)
        if (_.isNull(this._transactionManager)) {
            const poetryVoiceRepository = getRepository("PoetryVoice")
            await poetryVoiceRepository.remove(poetryVoiceEntity)
        }
        else {
            await this._transactionManager.remove(poetryVoiceEntity)
        }
    }

    async findOne(queryOptions) {
        const queryBuilder = getRepository("PoetryVoice").createQueryBuilder("poetryVoice")
            .leftJoinAndMapOne("poetryVoice.user", "users", "user", "user.id = poetryVoice.userID")
            .leftJoinAndMapOne("poetryVoice.poetry", "poetries", "poetry", "poetry.id = poetryVoice.poetryID")
        const {
            poetryVoiceID
        } = queryOptions
        if (poetryVoiceID) {
            queryBuilder.where(`poetryVoice.id = :poetryVoiceID`, {poetryVoiceID})
        }
        const poetryVoiceEntity = await queryBuilder.getOne()
        if (poetryVoiceEntity) {
            return transformToDomainModel(poetryVoiceEntity, "poetryVoice", PoetryVoice)
        }
        else {
            return null
        }
    }

    async find(queryOptions) {
        const queryBuilder = getRepository("PoetryVoice").createQueryBuilder("poetryVoice")
            .leftJoinAndMapOne("poetryVoice.user", "users", "user", "user.id = poetryVoice.userID")
            .leftJoinAndMapOne("poetryVoice.poetry", "poetries", "poetry", "poetry.id = poetryVoice.poetryID")
        const {
            userID,
            poetryID,
            offset,
            limit,
            orderBy
        } = queryOptions
        if (userID) {
            queryBuilder.andWhere(`poetryVoice.userID = :userID`, {userID})
        }
        if (poetryID) {
            queryBuilder.andWhere(`poetryVoice.poetryID = :poetryID`, {poetryID})
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
        if (_.isUndefined(orderBy)) {
            queryBuilder.orderBy("poetryVoice.createTime", "DESC")
        }
        else {
            if (!_.isNull(orderBy)) {
                queryBuilder.orderBy(orderBy)
            }
        }
        const [poetryVoiceEntitys, count] = await queryBuilder.getManyAndCount()
        return {
            poetryVoices: poetryVoiceEntitys.map(poetryVoiceEntity => transformToDomainModel(poetryVoiceEntity, "poetryVoice", PoetryVoice)),
            count
        }
    }
}

function createRepository(options) {
    return new Repository(options)
}

module.exports = createRepository
