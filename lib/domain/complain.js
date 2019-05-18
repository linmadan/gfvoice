const _ = require('lodash')
const constant = require('../util/constant')

class Complain {
    constructor({
                    id = 0,
                    type = 0,
                    reason = "",
                    complainant = 0,
                    target = 0,
                    createTime = new Date()
                } = {}) {
        this.id = id
        this.type = type
        this.reason = reason
        this.complainant = complainant
        this.target = target
        this.createTime = createTime
    }
}

module.exports = Complain
