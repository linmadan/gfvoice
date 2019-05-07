const _ = require('lodash')
const Joi = require('joi')
const {
    throwServiceError
} = require('../../util/errors')
const constant = require('../../util/constant')

const schema = Joi.object().keys({
    av: Joi.string().required(),
    bgState: Joi.number().integer().required(),
    userID: Joi.number().integer().required(),
    poetryID: Joi.number().integer().required()
})

class Command {
    constructor({
                    av,
                    bgState,
                    userID,
                    poetryID,
                }) {
        this.av = av
        this.bgState = bgState
        this.userID = userID
        this.poetryID = poetryID
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
