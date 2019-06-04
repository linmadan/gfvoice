const _ = require('lodash')
const {
    getRepository
} = require('typeorm')
const constant = require('../../util/constant');

class DAO {
    constructor({
                    transactionContext = null
                } = {}) {
        this._transactionManager = _.isNull(transactionContext) ? null : transactionContext.queryRunner.manager
    }

    async upComment(commentID) {
        const commentRepository = getRepository("Comment")
        await commentRepository.increment({id: commentID}, "upCount", 1)
    }

    async downComment(commentID) {
        const commentRepository = getRepository("Comment")
        await commentRepository.decrement({id: commentID}, "upCount", 1)
    }

    async upReply(replyID) {
        const replyRepository = getRepository("Reply")
        await replyRepository.increment({id: replyID}, "upCount", 1)
    }

    async downReply(replyID) {
        const replyRepository = getRepository("Reply")
        await replyRepository.decrement({id: replyID}, "upCount", 1)
    }

    async calculateCommentConutByPoetryVoice(poetryVoiceIDs) {
        let commentConutMap = new Map()
        if (_.isArray(poetryVoiceIDs) && poetryVoiceIDs.length > 0) {
            const queryBuilder = getRepository("Comment").createQueryBuilder("comment")
                .select("comment.poetryVoiceID", "id")
                .addSelect("COUNT(comment.id)", "commentCount")
                .where(`comment.poetryVoiceID IN (${poetryVoiceIDs.join(",")})`)
                .groupBy("comment.poetryVoiceID")
            const rowDataPackets = await queryBuilder.getRawMany()
            for (let rowDataPacket of rowDataPackets) {
                commentConutMap.set(rowDataPacket.id, rowDataPacket.commentCount)
            }
        }
        return commentConutMap
    }

    async calculateReplyConutByPoetryVoice(poetryVoiceIDs) {
        let replyConutMap = new Map()
        if (_.isArray(poetryVoiceIDs) && poetryVoiceIDs.length > 0) {
            const queryBuilder = getRepository("Reply").createQueryBuilder("reply")
                .select("reply.poetryVoiceID", "id")
                .addSelect("COUNT(reply.id)", "replyCount")
                .where(`reply.poetryVoiceID IN (${poetryVoiceIDs.join(",")})`)
                .groupBy("reply.poetryVoiceID")
            const rowDataPackets = await queryBuilder.getRawMany()
            for (let rowDataPacket of rowDataPackets) {
                replyConutMap.set(rowDataPacket.id, rowDataPacket.replyCount)
            }
        }
        return replyConutMap
    }
}

function createDAO(options) {
    return new DAO(options)
}

module.exports = createDAO