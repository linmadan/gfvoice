const _ = require('lodash')
const {
    getRepository
} = require('typeorm')
const {
    transformToDomainModel,
    transformToEntity
} = require('../typeorm/transform')
const WordEntity = require('../typeorm/entities/word')
const Word = require('../../domain/system/word')
const constant = require('../../util/constant')

class Repository {
    constructor({
                    transactionContext = null
                } = {}) {
        this._transactionManager = _.isNull(transactionContext) ? null : transactionContext.queryRunner.manager
    }

    async save(word) {
        const wordEntity = transformToEntity(word, "word", WordEntity)
        if (_.isNull(this._transactionManager)) {
            const wordRepository = getRepository("Word")
            await wordRepository.save(wordEntity)
        }
        else {
            await this._transactionManager.save(wordEntity)
        }
        if (word.id) {
            return word
        }
        else {
            word.id = wordEntity.id
        }
        return word
    }

    async remove(word) {
        const wordEntity = transformToEntity(word, "word", WordEntity)
        if (_.isNull(this._transactionManager)) {
            const wordRepository = getRepository("Word")
            await wordRepository.remove(wordEntity)
        }
        else {
            await this._transactionManager.remove(wordEntity)
        }
    }

    async findOne(queryOptions) {
        const queryBuilder = getRepository("Word").createQueryBuilder("word")
        const {
            wordID
        } = queryOptions
        if (wordID) {
            queryBuilder.where(`word.id = :wordID`, {wordID})
        }
        const wordEntity = await queryBuilder.getOne()
        if (wordEntity) {
            return transformToDomainModel(wordEntity, "word", Word)
        }
        else {
            return null
        }
    }

    async find(queryOptions) {
        const queryBuilder = getRepository("Word").createQueryBuilder("word")
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
            .orderBy("word.id", "DESC")
        const [wordEntitys, count] = await queryBuilder.getManyAndCount()
        return {
            words: wordEntitys.map(wordEntity => transformToDomainModel(wordEntity, "word", Word)),
            count
        }
    }
}

function createRepository(options) {
    return new Repository(options)
}

module.exports = createRepository
