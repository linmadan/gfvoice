const _ = require('lodash')
const Joi = require('joi')
const {
    throwServiceError
} = require('../../util/errors')
const constant = require('../../util/constant')

const schema = Joi.object().keys({
    appUpdateInfoID: Joi.number().integer().required(),
    vcode: Joi.number().integer(),
    version: Joi.string(),
    channel: Joi.string(),
    mustUpdate: Joi.number().integer(),
    appUrl: Joi.string(),
    desc: Joi.string()
})

class Command {
    constructor({
                    appUpdateInfoID,
                    vcode,
                    version,
                    channel,
                    mustUpdate,
                    appUrl,
                    desc,
                }) {
        this.appUpdateInfoID = appUpdateInfoID
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
