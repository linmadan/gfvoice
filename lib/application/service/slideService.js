const _ = require('lodash')
const {
    Slide
} = require('../../domain')
const {
    loadAndValidateCreateSlideCommand,
    loadAndValidateUpdateSlideCommand,
    loadAndValidateRemoveSlideCommand
} = require('../command')
const {
    createSlideRepository
} = require('../../infrastructure')
const {
    throwServiceError
} = require('../../util/errors')
const constant = require('../../util/constant')

class Service {
    constructor() {
    }

    async createSlide(slideData) {
        loadAndValidateCreateSlideCommand(slideData)
        const slideRepository = createSlideRepository()
        const slide = await slideRepository.save(new Slide(slideData))
        return {
            ...slide
        }
    }

    async getSlideByID(slideID) {
        if (_.isUndefined(slideID)) {
            throwServiceError(constant.STATUS_CODE.ARG_ERROR)
        }
        const slideRepository = createSlideRepository()
        let slide = await slideRepository.findOne({slideID})
        if (_.isNull(slide)) {
            throwServiceError(constant.STATUS_CODE.RES_NO_FIND)
        }
        return {
            ...slide
        }
    }

    async updateSlide(slideData) {
        loadAndValidateUpdateSlideCommand(slideData)
        const slideRepository = createSlideRepository()
        let slide = await slideRepository.findOne({
            slideID: slideData.slideID
        })
        if (_.isNull(slide)) {
            throwServiceError(constant.STATUS_CODE.RES_NO_FIND)
        }
        slide.update(slideData)
        await slideRepository.save(slide)
        slide = await slideRepository.findOne({
            slideID: slideData.slideID
        })
        return {
            ...slide
        }
    }

    async removeSlide(slideID) {
        loadAndValidateRemoveSlideCommand({slideID})
        const slideRepository = createSlideRepository()
        let slide = await slideRepository.findOne({slideID})
        if (_.isNull(slide)) {
            throwServiceError(constant.STATUS_CODE.RES_NO_FIND)
        }
        await slideRepository.remove(slide)
        return {
            ...slide
        }
    }

    async getSlides(queryOptions) {
        const slideRepository = createSlideRepository()
        const {slides, count} = await slideRepository.find(queryOptions)
        return {
            count,
            slides: slides.map(slide => {
                return {...slide}
            })
        }
    }
}

module.exports = Service