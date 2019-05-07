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

    update(updateData) {
        const {id, av, bgState, pick, status} = updateData
        if (!_.isUndefined(id)) {
            this.id = id
        }
        if (!_.isUndefined(av)) {
            this.av = av
        }
        if (!_.isUndefined(bgState)) {
            this.bgState = bgState
        }
        if (!_.isUndefined(pick)) {
            this.pick = pick
        }
        if (!_.isUndefined(status)) {
            this.status = status
        }
    }
}

module.exports = PoetryVoice
