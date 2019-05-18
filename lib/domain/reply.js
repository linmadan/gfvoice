const _ = require('lodash')
const constant = require('../util/constant')
const User = require('./user')
const Comment = require('./comment')

class Reply {
    constructor({
                    id = 0,
                    user = new User(),
                    comment = new Comment(),
                    content = "",
                    isAuthor = false,
                    upCount = 0,
                    status = 0,
                    createTime = new Date()
                } = {}) {
        this.id = id
        this.user = user
        this.comment = comment
        this.content = content
        this.isAuthor = isAuthor
        this.upCount = upCount
        this.status = status
        this.createTime = createTime
    }
}

module.exports = Reply
