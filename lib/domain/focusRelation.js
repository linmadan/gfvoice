const _ = require('lodash')
const constant = require('../util/constant')
const User = require('./user')

class FocusRelation {
    constructor({
                    id = 0,
                    follower = new User(),
                    focuser = new User(),
                    time = new Date(),
                } = {}) {
        this.id = id
        this.follower = follower
        this.focuser = focuser
        this.time = time
    }
}

module.exports = FocusRelation
