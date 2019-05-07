class Message {
    constructor({
                    id,
                    title,
                    content,
                    type,
                    createTime,
                    toUserID,
                } = {}) {
        this.id = id
        this.title = title
        this.content = content
        this.type = type
        this.createTime = createTime
        this.toUserID = toUserID
    }
}

module.exports = Message
