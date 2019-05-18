const _ = require('lodash')
const {
    PoetryVoice,
    Message
} = require('../../domain')
const {
    loadAndValidateSubmitPoetryVoiceCommand,
    loadAndValidatePickPoetryVoiceCommand,
    loadAndValidateCommentPoetryVoiceCommand,
    loadAndValidateReplyCommentCommand
} = require('../command')
const {
    createTransactionContext,
    createUserRepository,
    createPoetryRepository,
    createPoetryVoiceRepository,
    createPickRecordRepository,
    createCommentRepository,
    createReplyRepository,
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

    async commentPoetryVoice(commentData) {
        loadAndValidateCommentPoetryVoiceCommand(commentData)
        const userRepository = createUserRepository()
        const user = await userRepository.findOne({
            userID: commentData.userID
        })
        if (_.isNull(user)) {
            throwServiceError(constant.STATUS_CODE.RES_NO_FIND)
        }
        const poetryVoiceRepository = createPoetryVoiceRepository()
        let poetryVoice = await poetryVoiceRepository.findOne({
            poetryVoiceID: commentData.poetryVoiceID
        })
        if (_.isNull(poetryVoice)) {
            throwServiceError(constant.STATUS_CODE.RES_NO_FIND)
        }
        const commentRepository = createCommentRepository()
        let comment = poetryVoice.commentByUser(user, commentData.content)
        comment = await commentRepository.save(comment)
        return {
            id: comment.id,
            createTime: (new Date(comment.createTime)).getTime()
        }
    }

    async replyComment(replyData) {
        loadAndValidateReplyCommentCommand(replyData)
        const userRepository = createUserRepository()
        const user = await userRepository.findOne({
            userID: replyData.userID
        })
        if (_.isNull(user)) {
            throwServiceError(constant.STATUS_CODE.RES_NO_FIND)
        }
        const commentRepository = createCommentRepository()
        let comment = await commentRepository.findOne({
            commentID: replyData.commentID
        })
        if (_.isNull(comment)) {
            throwServiceError(constant.STATUS_CODE.RES_NO_FIND)
        }
        const replyRepository = createReplyRepository()
        let reply = comment.replyByUser(user, replyData.content)
        reply = await replyRepository.save(reply)
        return {
            id: reply.id,
            createTime: (new Date(reply.createTime)).getTime()
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
            list: poetryVoices.map(poetryVoice => {
                return {...poetryVoice}
            })
        }
    }

    async listPoetryVoiceComment(queryOptions) {
        const commentRepository = createCommentRepository()
        if (_.isUndefined(queryOptions.poetryVoiceID)) {
            throwServiceError(constant.STATUS_CODE.ARG_ERROR)
        }
        const {comments, count} = await commentRepository.find(queryOptions)
        return {
            count,
            list: comments.map(comment => {
                return {
                    id: comment.id,
                    user: {
                        id: comment.user.id,
                        name: comment.user.name,
                        headImg: comment.user.info.headImg,
                        gender: comment.user.info.gender
                    },
                    content: comment.content,
                    isAuthor: comment.isAuthor ? 1 : 0,
                    upCount: comment.upCount,
                    status: comment.status,
                    createTime: new Date(comment.createTime).getTime(),
                    replies: comment.replies.map(reply=>{
                        return {
                            id:reply.id,
                            user:{
                                id: reply.user.id,
                                name: reply.user.name,
                                headImg: reply.user.info.headImg,
                                gender: reply.user.info.gender
                            },
                            toUser:{
                                id: comment.user.id,
                                name: comment.user.name,
                                headImg: comment.user.info.headImg,
                                gender: comment.user.info.gender
                            },
                            content: reply.content,
                            isAuthor: reply.isAuthor ? 1 : 0,
                            upCount: reply.upCount,
                            status: reply.status,
                            createTime: new Date(reply.createTime).getTime()
                        }
                    })
                }
            })
        }
    }
}

module.exports = Service