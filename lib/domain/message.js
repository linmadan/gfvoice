const _ = require('lodash')
const constant = require('../util/constant')
const User = require('./user')

class Message {
    constructor({
                    id = 0,
                    title = "",
                    content = "",
                    type = 0,
                    createTime = new Date(),
                    toUser = new User(),
                } = {}) {
        this.id = id
        this.title = title
        this.content = content
        this.type = type
        this.createTime = createTime
        this.toUser = toUser
    }
}

module.exports = Message
