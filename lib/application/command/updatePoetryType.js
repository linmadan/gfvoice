const _ = require('lodash')
const Joi = require('joi')
const {
    throwServiceError
} = require('../../util/errors')
const constant = require('../../util/constant')

const schema = Joi.object().keys({
    poetryTypeID: Joi.number().required(),
    name: Joi.string(),
    pic: Joi.string()
})

class Command {
    constructor({
                    poetryTypeID,
                    name,
                    pic
                }) {
        this.poetryTypeID = poetryTypeID
        this.name = name
        this.pic = pic
    }
}

function loadAndValidateCommand(loadData) {
    const {error, value} = Joi.validate(loadData, schema)
    if (_.isNull(error)) {
        return new Command(value)
    }
    else {
        throwServiceError({
            code: constant.STATUS_CODE.ARG_ERROR.code,
            message: `${constant.STATUS_CODE.ARG_ERROR.message}:${error.toString()}`
        })
    }
}

module.exports = loadAndValidateCommand
