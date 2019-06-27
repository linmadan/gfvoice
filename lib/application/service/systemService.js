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
    createAppUpdateInfoRepository,
    createImageRepository
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
            limit: 5
        })
        const imageRepository = createImageRepository()
        const {images} = await imageRepository.find({
            type: constant.IMG_TYPE.POETRY_TYPE_COVER,
            offset: 0,
            limit: 1
        })
        return {
            slides: slides.map(slide => {
                return {...slide}
            }),
            typeCover: _.isUndefined(images[0]) ? "" : images[0].url
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
            limit: 10
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
            let latestAppUpdateInfo = appUpdateInfos[0]
            for (const appUpdateInfo of appUpdateInfos) {
                if (appUpdateInfo.vcode > latestAppUpdateInfo.vcode) {
                    latestAppUpdateInfo = appUpdateInfo
                }
                if (appUpdateInfo.vcode = latestAppUpdateInfo.vcode) {
                    if (appUpdateInfo.id > latestAppUpdateInfo.id) {
                        latestAppUpdateInfo = appUpdateInfo
                    }
                }
            }
            return {
                ...latestAppUpdateInfo
            }
        } else {
            throwServiceError(constant.STATUS_CODE.IS_LATEST_VERSION)
        }
    }
}

module.exports = Service