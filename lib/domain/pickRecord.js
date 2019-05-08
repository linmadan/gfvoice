const _ = require('lodash')
const constant = require('../util/constant')

class PickRecord {
    constructor({
                    id = 0,
                    poetryVoiceID = 0,
                    fromUserID = 0,
                    toUserID = 0,
                    time = new Date(),
                } = {}) {
        this.id = id
        this.poetryVoiceID = poetryVoiceID
        this.fromUserID = fromUserID
        this.toUserID = toUserID
        this.time = time
    }
}

module.exports = PickRecord
