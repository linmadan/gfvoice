class Comment {
    constructor({
                    id,
                    content,
                    userID,
                    poetryVoiceID,
                    isAuthor,
                    upCount,
                    status,
                    createTime,
                } = {}) {
        this.id = id
        this.content = content
        this.userID = userID
        this.poetryVoiceID = poetryVoiceID
        this.isAuthor = isAuthor
        this.upCount = upCount
        this.status = status
        this.createTime = createTime
    }
}

module.exports = Comment
