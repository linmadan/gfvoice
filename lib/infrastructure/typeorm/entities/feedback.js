class Feedback {
    constructor({
                    id,
                    userID,
                    content,
                    createTime,
                } = {}) {
        this.id = id
        this.userID = userID
        this.content = content
        this.createTime = createTime
    }
}

module.exports = Feedback
