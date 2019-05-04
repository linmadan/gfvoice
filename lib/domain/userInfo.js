const _ = require('lodash')
const constant = require('../util/constant')

class UserInfo {
    constructor({
                    gender = "f",
                    location = "",
                    birthday = "",
                    headImg = "",
                    pics = [],
                } = {}) {
        this.gender = gender
        this.location = location
        this.birthday = birthday
        this.headImg = headImg
        this.pics = pics
    }
}

module.exports = UserInfo
