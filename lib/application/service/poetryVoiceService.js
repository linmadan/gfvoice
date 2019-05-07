const _ = require('lodash')
const {
    PoetryVoice
} = require('../../domain')
const {
    loadAndValidateSubmitPoetryVoiceCommand
} = require('../command')
const {
    createUserRepository,
    createPoetryRepository,
    createPoetryVoiceRepository
} = require('../../infrastructure')
const {
    throwServiceError
} = require('../../util/errors')
const constant = require('../../util/constant')

class Service {
    constructor() {
    }

    async submitPoetryVoice(poetryVoiceData) {
        loadAndValidateSubmitPoetryVoiceCommand(poetryVoiceData)
        const userRepository = createUserRepository()
        const user = await userRepository.findOne({
            userID: poetryVoiceData.userID
        })
        if (_.isNull(user)) {
            throwServiceError(constant.STATUS_CODE.RES_NO_FIND)
        }
        poetryVoiceData.user = user
        const poetryRepository = createPoetryRepository()
        let poetry = await poetryRepository.findOne({
            poetryID: poetryVoiceData.poetryID
        })
        if (_.isNull(poetry)) {
            throwServiceError(constant.STATUS_CODE.RES_NO_FIND)
        }
        poetryVoiceData.poetry = poetry
        const poetryVoiceRepository = createPoetryVoiceRepository()
        const poetryVoice = await poetryVoiceRepository.save(new PoetryVoice(poetryVoiceData))
        return {
            ...poetryVoice
        }
    }

    // async getPoetryVoiceByID(poetryVoiceID) {
    //     if (_.isUndefined(poetryVoiceID)) {
    //         throwServiceError(constant.STATUS_CODE.ARG_ERROR)
    //     }
    //     const poetryVoiceRepository = createPoetryVoiceRepository()
    //     let poetryVoice = await poetryVoiceRepository.findOne({poetryVoiceID})
    //     if (_.isNull(poetryVoice)) {
    //         throwServiceError(constant.STATUS_CODE.RES_NO_FIND)
    //     }
    //     return {
    //         ...poetryVoice
    //     }
    // }
    //
    // async removePoetryVoice(poetryVoiceID) {
    //     loadAndValidateRemovePoetryVoiceCommand({poetryVoiceID})
    //     const poetryVoiceRepository = createPoetryVoiceRepository()
    //     let poetryVoice = await poetryVoiceRepository.findOne({poetryVoiceID})
    //     if (_.isNull(poetryVoice)) {
    //         throwServiceError(constant.STATUS_CODE.RES_NO_FIND)
    //     }
    //     await poetryVoiceRepository.remove(poetryVoice)
    //     return {
    //         ...poetryVoice
    //     }
    // }
    //
    async getPoetryVoices(queryOptions) {
        const poetryVoiceRepository = createPoetryVoiceRepository()
        if (queryOptions.poetryID) {
            queryOptions.orderBy = {
                "poetryVoice.pick": "DESC"
            }
        }
        const {poetryVoices, count} = await poetryVoiceRepository.find(queryOptions)
        return {
            count,
            poetryVoices: poetryVoices.map(poetryVoice => {
                return {...poetryVoice}
            })
        }
    }
}

module.exports = Service