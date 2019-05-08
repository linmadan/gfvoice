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

    async handlePickRecord(pickRecord) {
        if (_.isNull(this._transactionManager)) {
            throw new Error("无效的事务上下文")
        }
        await this._transactionManager.increment("User", {id: pickRecord.toUserID}, "pick", 1)
        await this._transactionManager.increment("PoetryVoice", {id: pickRecord.poetryVoiceID}, "pick", 1)
    }
}

function createDAO(options) {
    return new DAO(options)
}

module.exports = createDAO