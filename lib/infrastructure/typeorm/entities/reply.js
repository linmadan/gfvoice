class Reply {
    constructor({
                    id,
                    userID,
                    commentID,
                    content,
                    isAuthor,
                    upCount,
                    status,
                    createTime,
                } = {}) {
        this.id = id
        this.userID = userID
        this.commentID = commentID
        this.content = content
        this.isAuthor = isAuthor
        this.upCount = upCount
        this.status = status
        this.createTime = createTime
    }
}

module.exports = Reply
