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
}

function createDAO(options) {
    return new DAO(options)
}

module.exports = createDAO