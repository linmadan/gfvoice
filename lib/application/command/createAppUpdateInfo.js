const _ = require('lodash')
const Joi = require('joi')
const {
    throwServiceError
} = require('../../util/errors')
const constant = require('../../util/constant')

const schema = Joi.object().keys({
    vcode: Joi.number().integer().required(),
    version: Joi.string().required(),
    channel: Joi.string().required(),
    mustUpdate: Joi.number().integer().required(),
    appUrl: Joi.string().required(),
    desc: Joi.string().required()
})

class Command {
    constructor({
                    id,
                    vcode,
                    version,
                    channel,
                    mustUpdate,
                    appUrl,
                    desc,
                }) {
        this.id = id
        this.vcode = vcode
        this.version = version
        this.channel = channel
        this.mustUpdate = mustUpdate
        this.appUrl = appUrl
        this.desc = desc
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
