const _ = require('lodash')
const constant = require('../util/constant')
const UserInfo = require('./userInfo')

class User {
    constructor({
                    id = 0,
                    name = "",
                    phone = "",
                    registerType = 0,
                    platID = "",
                    bindPhone = "",
                    pick = 0,
                    info = new UserInfo(),
                } = {}) {
        this.id = id
        this.name = name
        this.phone = phone
        this.registerType = registerType
        this.platID = platID
        this.bindPhone = bindPhone
        this.pick = pick
        this.info = info
    }

    update(updateData) {
        const {id, name, phone, registerType, platID, pick, info} = updateData
        if (!_.isUndefined(id)) {
            this.id = id
        }
        if (!_.isUndefined(name)) {
            this.name = name
        }
        if (!_.isUndefined(phone)) {
            this.phone = phone
        }
        if (!_.isUndefined(registerType)) {
            this.registerType = registerType
        }
        if (!_.isUndefined(platID)) {
            this.platID = platID
        }
        if (!_.isUndefined(pick)) {
            this.pick = pick
        }
        if (!_.isUndefined(info)) {
            this.info = info
        }
    }

    bindThePhone(bindPhone) {
        this.bindPhone = bindPhone
    }
}

module.exports = User
