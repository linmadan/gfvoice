const _ = require('lodash')
const constant = require('../util/constant')
const User = require('./user')
const Poetry = require('./poetry')

class PoetryVoice {
    constructor({
                    id = 0,
                    av = "",
                    bgState = 0,
                    user = new User(),
                    poetry = new Poetry(),
                    pick = 0,
                    createTime = new Date(),
                    status = 0,
                } = {}) {
        this.id = id
        this.av = av
        this.bgState = bgState
        this.user = user
        this.poetry = poetry
        this.pick = pick
        this.createTime = createTime
        this.status = status
    }

    commentByUser(user, content) {
        const Comment = require('./comment')
        return new Comment({
            content: content,
            user: user,
            poetryVoice: this,
            isAuthor: this.user.id == user.id
        })
    }
}

module.exports = PoetryVoice
