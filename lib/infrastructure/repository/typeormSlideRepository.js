const _ = require('lodash')
const {
    getRepository
} = require('typeorm')
const {
    transformToDomainModel,
    transformToEntity
} = require('../typeorm/transform')
const SlideEntity = require('../typeorm/entities/slide')
const Slide = require('../../domain/slide')
const constant = require('../../util/constant')

class Repository {
    constructor({
                    transactionContext = null
                } = {}) {
        this._transactionManager = _.isNull(transactionContext) ? null : transactionContext.queryRunner.manager
    }

    async save(slide) {
        const slideEntity = transformToEntity(slide, "slide", SlideEntity)
        if (_.isNull(this._transactionManager)) {
            const slideRepository = getRepository("Slide")
            await slideRepository.save(slideEntity)
        } else {
            await this._transactionManager.save(slideEntity)
        }
        if (slide.id) {
            return slide
        } else {
            slide.id = slideEntity.id
        }
        return slide
    }

    async remove(slide) {
        const slideEntity = transformToEntity(slide, "slide", SlideEntity)
        if (_.isNull(this._transactionManager)) {
            const slideRepository = getRepository("Slide")
            await slideRepository.remove(slideEntity)
        } else {
            await this._transactionManager.remove(slideEntity)
        }
    }

    async findOne(queryOptions) {
        const queryBuilder = getRepository("Slide").createQueryBuilder("slide")
        const {
            slideID
        } = queryOptions
        if (slideID) {
            queryBuilder.where(`slide.id = :slideID`, {slideID})
        }
        const slideEntity = await queryBuilder.getOne()
        if (slideEntity) {
            return transformToDomainModel(slideEntity, "slide", Slide)
        } else {
            return null
        }
    }

    async find(queryOptions) {
        const queryBuilder = getRepository("Slide").createQueryBuilder("slide")
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
            .orderBy("slide.id", "DESC")
        const [slideEntitys, count] = await queryBuilder.getManyAndCount()
        return {
            slides: slideEntitys.map(slideEntity => transformToDomainModel(slideEntity, "slide", Slide)),
            count
        }
    }
}

function createRepository(options) {
    return new Repository(options)
}

module.exports = createRepository
