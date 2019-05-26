const _ = require('lodash')
const {
    Feedback
} = require('../../domain')
const {
    createSlideRepository,
    createMessageRepository,
    createWordRepository,
    createFeedbackRepository,
    createUserRepository,
    createAppUpdateInfoRepository
} = require('../../infrastructure')
const {
    loadAndValidateSubmitFeedbackCommand,
    loadAndValidateCheckAppUpdateCommand
} = require('../command')
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
            offset: 0,
            limit: 0
        })
        return {
            slides: slides.map(slide => {
                return {...slide}
            }),
            typeCover: "o_1b77vljhe1q0s9471kib1i7clp19.jpg"
        }
    }

    async getSystemMessage(queryOptions) {
        if (_.isUndefined(queryOptions.toUserID)) {
            throwServiceError(constant.STATUS_CODE.ARG_ERROR)
        }
        const messageRepository = createMessageRepository()
        const {messages, count} = await messageRepository.find(queryOptions)
        return {
            count,
            list: messages.map(message => {
                return {
                    id: message.id,
                    title: message.title,
                    content: message.content,
                    toUserID: message.toUser.id,
                    createTime: (new Date(message.createTime)).getTime()
                }
            })
        }
    }

    async listHotWord() {
        const wordRepository = createWordRepository()
        const {words} = await wordRepository.find({
            offset: 0,
            limit: 0
        })
        return words.map(word => {
            return word.title
        })
    }

    async submitFeedback(feedbackData) {
        loadAndValidateSubmitFeedbackCommand(feedbackData)
        const userRepository = createUserRepository()
        const user = await userRepository.findOne({
            userID: feedbackData.userID
        })
        if (_.isNull(user)) {
            throwServiceError(constant.STATUS_CODE.RES_NO_FIND)
        }
        const feedbackRepository = createFeedbackRepository()
        feedbackData.user = user
        await feedbackRepository.save(new Feedback(feedbackData))
    }

    async checkAppUpdate(checkData) {
        loadAndValidateCheckAppUpdateCommand(checkData)
        const appUpdateInfoRepository = createAppUpdateInfoRepository()
        const {appUpdateInfos} = await appUpdateInfoRepository.find({
            ...checkData,
            offset: 0,
            limit: 0
        })
        if (appUpdateInfos.length > 0) {
            return {
                ...appUpdateInfos[0]
            }
        } else {
            return {}
        }
    }
}

module.exports = Service