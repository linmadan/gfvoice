class PickRecord {
    constructor({
                    id,
                    poetryVoiceID,
                    fromUserID,
                    toUserID,
                    time,
                } = {}) {
        this.id = id
        this.poetryVoiceID = poetryVoiceID
        this.fromUserID = fromUserID
        this.toUserID = toUserID
        this.time = time
    }
}

module.exports = PickRecord
