const _ = require('lodash')
const constant = require('../util/constant')

class PoetryType {
    constructor({
                    id = 0,
                    name = "",
                    pic = ""
                } = {}) {
        this.id = id
        this.name = name
        this.pic = pic
    }

    update(updateData) {
        const {name, pic} = updateData
        if (!_.isUndefined(name)) {
            this.name = name
        }
        if (!_.isUndefined(pic)) {
            this.pic = pic
        }
    }
}

module.exports = PoetryType
