const _ = require('lodash')

class Word {
    constructor({
                    id = 0,
                    title = "",
                } = {}) {
        this.id = id
        this.title = title
    }

    update(updateData) {
        const {title} = updateData
        if (!_.isUndefined(title)) {
            this.title = title
        }
    }
}

module.exports = Word
