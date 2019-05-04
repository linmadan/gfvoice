const _ = require('lodash')
const Joi = require('joi')
const {
    throwServiceError
} = require('../../util/errors')
const constant = require('../../util/constant')

const schema = Joi.object().keys({
    poetryID: Joi.number().required(),
    name: Joi.string(),
    word: Joi.string(),
    author: Joi.string(),
    accompany: Joi.string(),
    poetryTypeID: Joi.number(),
})

class Command {
    constructor({
                    poetryID,
                    name,
                    word,
                    author,
                    accompany,
                    poetryTypeID,
                }) {
        this.poetryID = poetryID
        this.name = name
        this.word = word
        this.author = author
        this.accompany = accompany
        this.poetryTypeID = poetryTypeID
    }
}

function loadAndValidateCommand(loadData) {
    const {error, value} = Joi.validate(loadData, schema)
    if (_.isNull(error)) {
        return new Command(value)
    } else {
        throwServiceError({
            code: constant.STATUS_CODE.ARG_ERROR.code,
            message: `${constant.STATUS_CODE.ARG_ERROR.message}:${error.toString()}`
        })
    }
}

module.exports = loadAndValidateCommand
