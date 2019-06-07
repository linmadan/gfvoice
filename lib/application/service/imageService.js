const _ = require('lodash')
const {
    Image
} = require('../../domain')
const {
    loadAndValidateCreateImageCommand,
    loadAndValidateUpdateImageCommand,
    loadAndValidateRemoveImageCommand
} = require('../command')
const {
    createImageRepository
} = require('../../infrastructure')
const {
    throwServiceError
} = require('../../util/errors')
const constant = require('../../util/constant')

class Service {
    constructor() {
    }

    async createImage(imageData) {
        loadAndValidateCreateImageCommand(imageData)
        const imageRepository = createImageRepository()
        const image = await imageRepository.save(new Image(imageData))
        return {
            ...image
        }
    }

    async getImageByID(imageID) {
        if (_.isUndefined(imageID)) {
            throwServiceError(constant.STATUS_CODE.ARG_ERROR)
        }
        const imageRepository = createImageRepository()
        let image = await imageRepository.findOne({imageID})
        if (_.isNull(image)) {
            throwServiceError(constant.STATUS_CODE.RES_NO_FIND)
        }
        return {
            ...image
        }
    }

    async updateImage(imageData) {
        loadAndValidateUpdateImageCommand(imageData)
        const imageRepository = createImageRepository()
        let image = await imageRepository.findOne({
            imageID: imageData.imageID
        })
        if (_.isNull(image)) {
            throwServiceError(constant.STATUS_CODE.RES_NO_FIND)
        }
        image.update(imageData)
        await imageRepository.save(image)
        image = await imageRepository.findOne({
            imageID: imageData.imageID
        })
        return {
            ...image
        }
    }

    async removeImage(imageID) {
        loadAndValidateRemoveImageCommand({imageID})
        const imageRepository = createImageRepository()
        let image = await imageRepository.findOne({imageID})
        if (_.isNull(image)) {
            throwServiceError(constant.STATUS_CODE.RES_NO_FIND)
        }
        await imageRepository.remove(image)
        return {
            ...image
        }
    }

    async getImages(queryOptions) {
        const imageRepository = createImageRepository()
        const {images, count} = await imageRepository.find(queryOptions)
        return {
            count,
            images: images.map(image => {
                return {...image}
            })
        }
    }
}

module.exports = Service