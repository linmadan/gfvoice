const _ = require('lodash')
const constant = require('../util/constant')
const UserInfo = require('./userInfo')
const PickRecord = require('./pickRecord')
const Complain = require('./complain')

class User {
    constructor({
                    id = 0,
                    name = "",
                    phone = "",
                    registerType = 0,
                    platID = "",
                    openID = "",
                    bindPhone = "",
                    pick = 0,
                    status = 0,
                    info = new UserInfo(),
                } = {}) {
        this.id = id
        this.name = name
        this.phone = phone
        this.registerType = registerType
        this.platID = platID
        this.openID = openID
        this.bindPhone = bindPhone
        this.pick = pick
        this.status = status
        this.info = info
    }

    update(updateData) {
        const {id, name, phone, info} = updateData
        if (!_.isUndefined(id)) {
            this.id = id
        }
        if (!_.isUndefined(name)) {
            this.name = name
        }
        if (!_.isUndefined(phone)) {
            this.phone = phone
        }
        if (!_.isUndefined(info)) {
            this.info = info
        }
    }

    bindThePhone(bindPhone) {
        this.bindPhone = bindPhone
    }

    focus(focuser) {
        const FocusRelation = require('./focusRelation')
        return new FocusRelation({
            follower: this,
            focuser: focuser
        })
    }

    pickPoetryVoice(poetryVoice) {
        return new PickRecord({
            poetryVoiceID: poetryVoice.id,
            fromUserID: this.id,
            toUserID: poetryVoice.user.id
        })
    }

    complainUser(user, reason) {
        return new Complain({
            type: 1,
            reason: reason,
            complainant: this.id,
            target: user.id
        })
    }

    complainPoetryVoice(poetryVoice, reason) {
        return new Complain({
            type: 2,
            reason: reason,
            complainant: this.id,
            target: poetryVoice.id
        })
    }
}

module.exports = User
