const _ = require('lodash')
const PoetryType = require('./poetryType')
const constant = require('../util/constant')

class Poetry {
    constructor({
                    id = 0,
                    name = "",
                    word = "",
                    author = "",
                    accompany = "",
                    useNum = 0,
                    poetryType = new PoetryType(),
                } = {}) {
        this.id = id
        this.name = name
        this.word = word
        this.author = author
        this.accompany = accompany
        this.useNum = useNum
        this.poetryType = poetryType
    }

    update(updateData) {
        const {name, word, author, accompany, poetryType} = updateData
        if (!_.isUndefined(name)) {
            this.name = name
        }
        if (!_.isUndefined(word)) {
            this.word = word
        }
        if (!_.isUndefined(author)) {
            this.author = author
        }
        if (!_.isUndefined(accompany)) {
            this.accompany = accompany
        }
        if (!_.isUndefined(poetryType)) {
            this.poetryType = poetryType
        }
    }
}

module.exports = Poetry
