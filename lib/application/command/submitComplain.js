const _ = require('lodash')
const Joi = require('joi')
const {
    throwServiceError
} = require('../../util/errors')
const constant = require('../../util/constant')

const schema = Joi.object().keys({
    type: Joi.number().integer().required(),
    reason: Joi.string().required(),
    fromUserID: Joi.number().integer().required(),
    targetID: Joi.number().integer().required()
})

class Command {
    constructor({
                    type,
                    reason,
                    fromUserID,
                    targetID,
                }) {
        this.type = type
        this.reason = reason
        this.fromUserID = fromUserID
        this.targetID = targetID
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
