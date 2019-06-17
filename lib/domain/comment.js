const _ = require('lodash')
const constant = require('../util/constant')
const User = require('./user')
const PoetryVoice = require('./poetryVoice')

class Comment {
    constructor({
                    id = 0,
                    content = "",
                    user = new User(),
                    poetryVoice = new PoetryVoice(),
                    isAuthor = false,
                    upCount = 0,
                    status = 0,
                    createTime = new Date(),
                    replies = []
                } = {}) {
        this.id = id
        this.content = content
        this.user = user
        this.poetryVoice = poetryVoice
        this.isAuthor = isAuthor
        this.upCount = upCount
        this.status = status
        this.createTime = createTime
        this.replies = replies
    }

    setStatus(status) {
        this.status = status
    }

    replyByUser(user, content) {
        const Reply = require('./reply')
        return new Reply({
            content: content,
            user: user,
            comment: this,
            isAuthor: this.poetryVoice.user.id == user.id
        })
    }
}

module.exports = Comment
