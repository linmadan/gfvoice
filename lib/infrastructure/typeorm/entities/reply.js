class Reply {
    constructor({
                    id,
                    userID,
                    commentID,
                    poetryVoiceID,
                    content,
                    isAuthor,
                    upCount,
                    status,
                    createTime,
                } = {}) {
        this.id = id
        this.userID = userID
        this.commentID = commentID
        this.poetryVoiceID = poetryVoiceID
        this.content = content
        this.isAuthor = isAuthor
        this.upCount = upCount
        this.status = status
        this.createTime = createTime
    }
}

module.exports = Reply
