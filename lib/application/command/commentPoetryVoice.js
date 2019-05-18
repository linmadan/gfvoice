const _ = require('lodash')
const Joi = require('joi')
const {
    throwServiceError
} = require('../../util/errors')
const constant = require('../../util/constant')

const schema = Joi.object().keys({
    poetryVoiceID: Joi.number().integer().required(),
    userID: Joi.number().integer().required(),
    content: Joi.string().required()
})

class Command {
    constructor({
                    poetryVoiceID,
                    userID,
                    content,
                }) {
        this.poetryVoiceID = poetryVoiceID
        this.userID = userID
        this.content = content
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
