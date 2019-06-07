const _ = require('lodash')
const constant = require('../../util/constant')

class Image {
    constructor({
                    id = 0,
                    url = "",
                    type = 0,
                } = {}) {
        this.id = id
        this.url = url
        this.type = type
    }

    update(updateData) {
        const {url, type} = updateData
        if (!_.isUndefined(url)) {
            this.url = url
        }
        if (!_.isUndefined(type)) {
            this.type = type
        }
    }
}

module.exports = Image
