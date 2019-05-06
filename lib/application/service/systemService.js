const _ = require('lodash')
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

    async getEntryData() {
        const slideRepository = createSlideRepository()
        const {slides} = await slideRepository.find({
            offset: null,
            limit: null
        })
        return {
            slides: slides.map(slide => {
                return {...slide}
            }),
            typeCover: "o_1b77vljhe1q0s9471kib1i7clp19.jpg"
        }
    }
}

module.exports = Service