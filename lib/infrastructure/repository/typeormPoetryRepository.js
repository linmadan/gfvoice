const _ = require('lodash')
const {
    getRepository
} = require('typeorm')
const {
    transformToDomainModel,
    transformToEntity
} = require('../typeorm/transform')
const PoetryEntity = require('../typeorm/entities/poetry')
const Poetry = require('../../domain/poetry')
const constant = require('../../util/constant')

class Repository {
    constructor({
                    transactionContext = null
                } = {}) {
        this._transactionManager = _.isNull(transactionContext) ? null : transactionContext.queryRunner.manager
    }

    async save(poetry) {
        const poetryEntity = transformToEntity(poetry, "poetry", PoetryEntity)
        if (_.isNull(this._transactionManager)) {
            const poetryRepository = getRepository("Poetry")
            await poetryRepository.save(poetryEntity)
        } else {
            await this._transactionManager.save(poetryEntity)
        }
        if (poetry.id) {
            return poetry
        } else {
            poetry.id = poetryEntity.id
        }
        return poetry
    }

    async remove(poetry) {
        const poetryEntity = transformToEntity(poetry, "poetry", PoetryEntity)
        if (_.isNull(this._transactionManager)) {
            const poetryRepository = getRepository("Poetry")
            await poetryRepository.remove(poetryEntity)
        } else {
            await this._transactionManager.remove(poetryEntity)
        }
    }

    async findOne(queryOptions) {
        const queryBuilder = getRepository("Poetry").createQueryBuilder("poetry")
            .leftJoinAndMapOne("poetry.poetryType", "poetryTypes", "poetryType", "poetryType.id = poetry.poetryTypeID")
        const {
            poetryID
        } = queryOptions
        if (poetryID) {
            queryBuilder.where(`poetry.id = :poetryID`, {poetryID})
        }
        const poetryEntity = await queryBuilder.getOne()
        if (poetryEntity) {
            return transformToDomainModel(poetryEntity, "poetry", Poetry)
        } else {
            return null
        }
    }

    async find(queryOptions) {
        const queryBuilder = getRepository("Poetry").createQueryBuilder("poetry")
            .leftJoinAndMapOne("poetry.poetryType", "poetryTypes", "poetryType", "poetryType.id = poetry.poetryTypeID")
        const {
            poetryTypeID,
            word,
            offset,
            limit
        } = queryOptions
        if (poetryTypeID) {
            queryBuilder.andWhere(`poetry.poetryTypeID = :poetryTypeID`, {poetryTypeID})
        }
        if (!_.isEmpty(word)) {
            queryBuilder.andWhere(`poetry.name LIKE '%${word}%' OR poetry.author LIKE '%${word}%'`)
        }
        if (_.isUndefined(offset)) {
            queryBuilder.skip(0)
        } else {
            if (!_.isNull(offset)) {
                queryBuilder.skip(offset)
            }
        }
        if (_.isUndefined(limit)) {
            queryBuilder.take(20)
        } else {
            if (!_.isNull(limit)) {
                queryBuilder.take(limit)
            }
        }
        queryBuilder
            .orderBy("poetry.id", "DESC")
        const [poetryEntitys, count] = await queryBuilder.getManyAndCount()
        return {
            poetries: poetryEntitys.map(poetryEntity => transformToDomainModel(poetryEntity, "poetry", Poetry)),
            count
        }
    }
}

function createRepository(options) {
    return new Repository(options)
}

module.exports = createRepository
