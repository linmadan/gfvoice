const _ = require('lodash')
const Joi = require('joi')
const {
    throwServiceError
} = require('../../util/errors')
const constant = require('../../util/constant')

const schema = Joi.object().keys({
    type: Joi.number().required(),
    param: Joi.string(),
    tag: Joi.string(),
    pic: Joi.string().required(),
})

class Command {
    constructor({
                    type,
                    param,
                    tag,
                    pic,
                }) {
        this.type = type
        this.param = param
        this.tag = tag
        this.pic = pic
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
