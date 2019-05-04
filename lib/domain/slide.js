const _ = require('lodash')
const constant = require('../util/constant')

class Slide {
    constructor({
                    id = 0,
                    type = 0,
                    param = "",
                    tag = "",
                    pic = "",
                } = {}) {
        this.id = id
        this.type = type
        this.param = param
        this.tag = tag
        this.pic = pic
    }

    update(updateData) {
        const {type, param, tag, pic} = updateData
        if (!_.isUndefined(type)) {
            this.type = type
        }
        if (!_.isUndefined(param)) {
            this.param = param
        }
        if (!_.isUndefined(tag)) {
            this.tag = tag
        }
        if (!_.isUndefined(pic)) {
            this.pic = pic
        }
    }
}

module.exports = Slide
