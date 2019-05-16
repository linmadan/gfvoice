const _ = require('lodash')
const {
    createSlideRepository,
    createMessageRepository
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
}

module.exports = Service