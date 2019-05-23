const _ = require('lodash')
const User = require('../user')

class Feedback {
    constructor({
                    id = 0,
                    user = new User(),
                    content = "",
                    createTime = new Date()
                } = {}) {
        this.id = id
        this.user = user
        this.content = content
        this.createTime = createTime
    }
}

module.exports = Feedback
