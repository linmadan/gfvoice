class PoetryVoice {
    constructor({
                    id,
                    av,
                    bgState,
                    userID,
                    poetryID,
                    pick,
                    createTime,
                    status,
                } = {}) {
        this.id = id
        this.av = av
        this.bgState = bgState
        this.userID = userID
        this.poetryID = poetryID
        this.pick = pick
        this.createTime = createTime
        this.status = status
    }
}

module.exports = PoetryVoice
