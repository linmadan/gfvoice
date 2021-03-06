const _ = require('lodash')
const {
    PoetryVoice,
    Message
} = require('../../domain')
const {
    loadAndValidateSubmitPoetryVoiceCommand,
    loadAndValidatePickPoetryVoiceCommand,
    loadAndValidateCommentPoetryVoiceCommand,
    loadAndValidateReplyCommentCommand,
    loadAndValidateLikeCommentCommand,
    loadAndValidateLikeReplyCommand,
    loadAndValidateSetPoetryVoiceStatusCommand
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
    createPickDAO,
    createCommentDAO,
    createPortryDAO
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
        const transactionContext = createTransactionContext()
        await transactionContext.startTransaction()
        // const userRepository = createUserRepository({transactionContext})
        const userRepository = createUserRepository()
        const user = await userRepository.findOne({
            userID: poetryVoiceData.userID
        })
        if (_.isNull(user)) {
            throwServiceError(constant.STATUS_CODE.RES_NO_FIND)
        }
        poetryVoiceData.user = user
        // const poetryRepository = createPoetryRepository({transactionContext})
        const poetryRepository = createPoetryRepository()
        let poetry = await poetryRepository.findOne({
            poetryID: poetryVoiceData.poetryID
        })
        if (_.isNull(poetry)) {
            throwServiceError(constant.STATUS_CODE.RES_NO_FIND)
        }
        poetryVoiceData.poetry = poetry
        try {
            // const poetryVoiceRepository = createPoetryVoiceRepository({transactionContext})
            const poetryVoiceRepository = createPoetryVoiceRepository()
            await poetryVoiceRepository.save(new PoetryVoice(poetryVoiceData))
            // const poetryDAO = createPortryDAO({transactionContext})
            const poetryDAO = createPortryDAO()
            await poetryDAO.usePoetry(poetryVoiceData.poetryID)
        } catch (err) {
            await transactionContext.rollbackTransaction()
            throwServiceError(constant.STATUS_CODE.TRANSACTION_ERROR)
        } finally {
            await transactionContext.release()
        }
    }

    async pickPoetryVoice(pickData) {
        loadAndValidatePickPoetryVoiceCommand(pickData)
        const transactionContext = createTransactionContext()
        await transactionContext.startTransaction()
        // const userRepository = createUserRepository({transactionContext})
        const userRepository = createUserRepository()
        const user = await userRepository.findOne({
            userID: pickData.userID
        })
        if (_.isNull(user)) {
            throwServiceError(constant.STATUS_CODE.RES_NO_FIND)
        }
        // const poetryVoiceRepository = createPoetryVoiceRepository({transactionContext})
        const poetryVoiceRepository = createPoetryVoiceRepository()
        let poetryVoice = await poetryVoiceRepository.findOne({
            poetryVoiceID: pickData.poetryVoiceID
        })
        if (_.isNull(poetryVoice)) {
            throwServiceError(constant.STATUS_CODE.RES_NO_FIND)
        }
        try {
            // const pickRecordRepository = createPickRecordRepository({transactionContext})
            const pickRecordRepository = createPickRecordRepository()
            if (await pickRecordRepository.findOne({
                poetryVoiceID: pickData.poetryVoiceID,
                fromUserID: pickData.userID
            })) {
                return
            }
            const pickRecord = user.pickPoetryVoice(poetryVoice)
            await pickRecordRepository.save(pickRecord)
            // const pickDAO = createPickDAO({transactionContext})
            const pickDAO = createPickDAO()
            await pickDAO.handlePickRecord(pickRecord)
            // const messageRepository = createMessageRepository({transactionContext})
            const messageRepository = createMessageRepository()
            const message = new Message({
                title: "被Pick啦！",
                content: `你领唱的⎡${poetryVoice.poetry.name}⎦被⎡${user.name}⎦Pick啦！`,
                type: 0,
                toUser: poetryVoice.user,
            })
            await messageRepository.save(message)
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

    async setPoetryVoiceStatus(setData) {
        loadAndValidateSetPoetryVoiceStatusCommand(setData)
        const poetryVoiceRepository = createPoetryVoiceRepository()
        let poetryVoice = await poetryVoiceRepository.findOne({poetryVoiceID: setData.poetryVoiceID})
        if (_.isNull(poetryVoice)) {
            throwServiceError(constant.STATUS_CODE.RES_NO_FIND)
        }
        poetryVoice.setStatus(setData.status)
        await poetryVoiceRepository.save(poetryVoice)
        return {
            ...poetryVoice
        }
    }

    async removePoetryVoice(poetryVoiceID) {
        if (_.isUndefined(poetryVoiceID)) {
            throwServiceError(constant.STATUS_CODE.ARG_ERROR)
        }
        const poetryVoiceRepository = createPoetryVoiceRepository()
        let poetryVoice = await poetryVoiceRepository.findOne({poetryVoiceID})
        if (_.isNull(poetryVoice)) {
            throwServiceError(constant.STATUS_CODE.RES_NO_FIND)
        }
        poetryVoice.setStatus(2)
        await poetryVoiceRepository.save(poetryVoice)
    }

    async getPoetryVoice(queryOptions) {
        if (_.isUndefined(queryOptions.poetryVoiceID)) {
            throwServiceError(constant.STATUS_CODE.ARG_ERROR)
        }
        const poetryVoiceRepository = createPoetryVoiceRepository()
        let poetryVoice = await poetryVoiceRepository.findOne({poetryVoiceID: queryOptions.poetryVoiceID})
        if (_.isNull(poetryVoice)) {
            throwServiceError(constant.STATUS_CODE.RES_NO_FIND)
        }
        const commentDAO = createCommentDAO()
        const commentConutMap = await commentDAO.calculateCommentConutByPoetryVoice([poetryVoice.id])
        const replyConutMap = await commentDAO.calculateReplyConutByPoetryVoice([poetryVoice.id])
        const commentConut = _.isUndefined(commentConutMap.get(poetryVoice.id)) ? 0 : Number(commentConutMap.get(poetryVoice.id))
        const replytConut = _.isUndefined(replyConutMap.get(poetryVoice.id)) ? 0 : Number(replyConutMap.get(poetryVoice.id))
        return {
            ...poetryVoice,
            user: {
                id: poetryVoice.user.id,
                name: poetryVoice.user.name,
                headImg: poetryVoice.user.info.headImg,
                gender: poetryVoice.user.info.gender
            },
            commentNum: commentConut + replytConut,
            createTime: (new Date(poetryVoice.createTime)).getTime()
        }
    }

    async getPoetryVoices(queryOptions) {
        const poetryVoiceRepository = createPoetryVoiceRepository()
        if (queryOptions.poetryID) {
            queryOptions.orderBy = {
                "poetryVoice.pick": "DESC"
            }
        }
        const {poetryVoices, count} = await poetryVoiceRepository.find(queryOptions)
        const commentDAO = createCommentDAO()
        const commentConutMap = await commentDAO.calculateCommentConutByPoetryVoice(poetryVoices.map(poetryVoice => poetryVoice.id))
        const replyConutMap = await commentDAO.calculateReplyConutByPoetryVoice(poetryVoices.map(poetryVoice => poetryVoice.id))
        return {
            count,
            list: poetryVoices.map(poetryVoice => {
                const commentConut = _.isUndefined(commentConutMap.get(poetryVoice.id)) ? 0 : Number(commentConutMap.get(poetryVoice.id))
                const replytConut = _.isUndefined(replyConutMap.get(poetryVoice.id)) ? 0 : Number(replyConutMap.get(poetryVoice.id))
                return {
                    ...poetryVoice,
                    user: {
                        id: poetryVoice.user.id,
                        name: poetryVoice.user.name,
                        headImg: poetryVoice.user.info.headImg,
                        gender: poetryVoice.user.info.gender
                    },
                    commentNum: commentConut + replytConut,
                    createTime: (new Date(poetryVoice.createTime)).getTime()
                }
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
                    replies: comment.replies.map(reply => {
                        return {
                            id: reply.id,
                            user: {
                                id: reply.user.id,
                                name: reply.user.name,
                                headImg: reply.user.info.headImg,
                                gender: reply.user.info.gender
                            },
                            toUser: {
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

    async likeComment(likeData) {
        loadAndValidateLikeCommentCommand(likeData)
        const commentDAO = createCommentDAO()
        if (likeData.action) {
            await commentDAO.upComment(likeData.commentID)
        } else {
            await commentDAO.downComment(likeData.commentID)
        }
    }

    async removeComment(commentID) {
        if (_.isUndefined(commentID)) {
            throwServiceError(constant.STATUS_CODE.ARG_ERROR)
        }
        const commentRepository = createCommentRepository()
        let comment = await commentRepository.findOne({commentID})
        if (_.isNull(comment)) {
            throwServiceError(constant.STATUS_CODE.RES_NO_FIND)
        }
        comment.setStatus(1)
        await commentRepository.save(comment)
    }

    async likeReply(likeData) {
        loadAndValidateLikeReplyCommand(likeData)
        const commentDAO = createCommentDAO()
        if (likeData.action) {
            await commentDAO.upReply(likeData.replyID)
        } else {
            await commentDAO.downReply(likeData.replyID)
        }
    }

    async removeReply(replyID) {
        if (_.isUndefined(replyID)) {
            throwServiceError(constant.STATUS_CODE.ARG_ERROR)
        }
        const replyRepository = createReplyRepository()
        let reply = await replyRepository.findOne({replyID})
        if (_.isNull(reply)) {
            throwServiceError(constant.STATUS_CODE.RES_NO_FIND)
        }
        reply.setStatus(1)
        await replyRepository.save(reply)
    }

    async listRecommendPoetryVoice(queryOptions) {
        let {page, limitHot, limit} = queryOptions
        if (_.isUndefined(page) || _.isUndefined(limitHot) || _.isUndefined(limit)) {
            throwServiceError(constant.STATUS_CODE.ARG_ERROR)
        }
        const portryDAO = createPortryDAO()
        const portryCount = await portryDAO.getUsedPoetryCount()
        let hotPortryIDs = []
        let coldPortryIDs = []
        const sortedPortryIDs = await portryDAO.sortPoetryIDByUseNum()
        if (portryCount - ((page + 1) * limitHot + (page + 1) * (limit - limitHot)) > 0) {
            hotPortryIDs = _.slice(sortedPortryIDs, page * limitHot, page * limitHot + limitHot)
            coldPortryIDs = _.slice(sortedPortryIDs, portryCount - page * (limit - limitHot) - (limit - limitHot), portryCount - page * (limit - limitHot))
        } else {
            if (portryCount - (page * limitHot + page * (limit - limitHot)) > 0) {
                hotPortryIDs = _.slice(sortedPortryIDs, page * limitHot, page * limitHot + (portryCount - (page * limitHot + page * (limit - limitHot))))
            }
        }
        const poetryVoiceIDs = await portryDAO.listRecommendPoetryVoiceIDs(_.concat(hotPortryIDs, ...coldPortryIDs))
        const poetryVoiceRepository = createPoetryVoiceRepository()
        const {poetryVoices} = await poetryVoiceRepository.find({poetryVoiceIDs})
        if (_.isUndefined(poetryVoices)) {
            return {
                count: portryCount,
                list: []
            }
        }
        const commentDAO = createCommentDAO()
        const commentConutMap = await commentDAO.calculateCommentConutByPoetryVoice(poetryVoices.map(poetryVoice => poetryVoice.id))
        const replyConutMap = await commentDAO.calculateReplyConutByPoetryVoice(poetryVoices.map(poetryVoice => poetryVoice.id))
        return {
            count: portryCount,
            list: _.reverse(_.sortBy(poetryVoices.map(poetryVoice => {
                const commentConut = _.isUndefined(commentConutMap.get(poetryVoice.id)) ? 0 : Number(commentConutMap.get(poetryVoice.id))
                const replytConut = _.isUndefined(replyConutMap.get(poetryVoice.id)) ? 0 : Number(replyConutMap.get(poetryVoice.id))
                return {
                    ...poetryVoice,
                    user: {
                        id: poetryVoice.user.id,
                        name: poetryVoice.user.name,
                        headImg: poetryVoice.user.info.headImg,
                        gender: poetryVoice.user.info.gender
                    },
                    commentNum: commentConut + replytConut,
                    createTime: (new Date(poetryVoice.createTime)).getTime()
                }
            }), poetryVoice => {
                return poetryVoice.poetry.useNum
            }))
        }
    }
}

module.exports = Service