const _ = require('lodash')
const {
    PoetryVoice,
    Message
} = require('../../domain')
const {
    loadAndValidateSubmitPoetryVoiceCommand,
    loadAndValidatePickPoetryVoiceCommand
} = require('../command')
const {
    createTransactionContext,
    createUserRepository,
    createPoetryRepository,
    createPoetryVoiceRepository,
    createPickRecordRepository,
    createMessageRepository,
    createPickDAO
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

    async pickPoetryVoice(pickData) {
        loadAndValidatePickPoetryVoiceCommand(pickData)
        const transactionContext = createTransactionContext()
        await transactionContext.startTransaction()
        const userRepository = createUserRepository()
        const user = await userRepository.findOne({
            userID: pickData.userID
        })
        if (_.isNull(user)) {
            throwServiceError(constant.STATUS_CODE.RES_NO_FIND)
        }
        const poetryVoiceRepository = createPoetryVoiceRepository()
        let poetryVoice = await poetryVoiceRepository.findOne({
            poetryVoiceID: pickData.poetryVoiceID
        })
        if (_.isNull(poetryVoice)) {
            throwServiceError(constant.STATUS_CODE.RES_NO_FIND)
        }
        const pickRecordRepository = createPickRecordRepository({transactionContext})
        if (await pickRecordRepository.findOne({
            poetryVoiceID: pickData.poetryVoiceID,
            fromUserID: pickData.userID
        })) {
            throwServiceError(constant.STATUS_CODE.HAD_PICK)
        }
        const pickRecord = user.pickPoetryVoice(poetryVoice)
        try {
            await pickRecordRepository.save(pickRecord)
            const pickDAO = createPickDAO({transactionContext})
            await pickDAO.handlePickRecord(pickRecord)
            const messageRepository = createMessageRepository({transactionContext})
            const message = new Message({
                title: "被Pick啦！",
                content: `你领唱的⎡${poetryVoice.poetry.name}⎦被⎡${user.name}⎦Pick啦！`,
                type: 0,
                toUser: poetryVoice.user,
            })
            await messageRepository.save(message)
            return {}
        } catch (err) {
            await transactionContext.rollbackTransaction()
            throwServiceError(constant.STATUS_CODE.TRANSACTION_ERROR)
        } finally {
            await transactionContext.release()
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