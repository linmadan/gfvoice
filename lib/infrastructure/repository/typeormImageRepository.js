const _ = require('lodash')
const {
    getRepository
} = require('typeorm')
const {
    transformToDomainModel,
    transformToEntity
} = require('../typeorm/transform')
const ImageEntity = require('../typeorm/entities/image')
const Image = require('../../domain/system/image')
const constant = require('../../util/constant')

class Repository {
    constructor({
                    transactionContext = null
                } = {}) {
        this._transactionManager = _.isNull(transactionContext) ? null : transactionContext.queryRunner.manager
    }

    async save(image) {
        const imageEntity = transformToEntity(image, "image", ImageEntity)
        if (_.isNull(this._transactionManager)) {
            const imageRepository = getRepository("Image")
            await imageRepository.save(imageEntity)
        }
        else {
            await this._transactionManager.save(imageEntity)
        }
        if (image.id) {
            return image
        }
        else {
            image.id = imageEntity.id
        }
        return image
    }

    async remove(image) {
        const imageEntity = transformToEntity(image, "image", ImageEntity)
        if (_.isNull(this._transactionManager)) {
            const imageRepository = getRepository("Image")
            await imageRepository.remove(imageEntity)
        }
        else {
            await this._transactionManager.remove(imageEntity)
        }
    }

    async findOne(queryOptions) {
        const queryBuilder = getRepository("Image").createQueryBuilder("image")
        const {
            imageID
        } = queryOptions
        if (imageID) {
            queryBuilder.where(`image.id = :imageID`, {imageID})
        }
        const imageEntity = await queryBuilder.getOne()
        if (imageEntity) {
            return transformToDomainModel(imageEntity, "image", Image)
        }
        else {
            return null
        }
    }

    async find(queryOptions) {
        const queryBuilder = getRepository("Image").createQueryBuilder("image")
        const {
            type,
            offset,
            limit
        } = queryOptions
        if (type) {
            queryBuilder.andWhere(`image.type = :type`, {type})
        }
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
            .orderBy("image.id", "DESC")
        const [imageEntitys, count] = await queryBuilder.getManyAndCount()
        return {
            images: imageEntitys.map(imageEntity => transformToDomainModel(imageEntity, "image", Image)),
            count
        }
    }
}

function createRepository(options) {
    return new Repository(options)
}

module.exports = createRepository
