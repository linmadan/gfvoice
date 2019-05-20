const _ = require('lodash')
const Joi = require('joi')
const {
    throwServiceError
} = require('../../util/errors')
const constant = require('../../util/constant')

const schema = Joi.object().keys({
    commentID: Joi.number().integer().required(),
    action: Joi.number().integer()
})

class Command {
    constructor({
                    commentID,
                    action,
                }) {
        this.commentID = commentID
        this.action = action
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
