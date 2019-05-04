const _ = require('lodash')
const Joi = require('joi')
const {
    throwServiceError
} = require('../../util/errors')
const constant = require('../../util/constant')

const schema = Joi.object().keys({
    name: Joi.string().required(),
    phone: Joi.string(),
    registerType: Joi.number().required(),
    platID: Joi.string(),
    gender: Joi.string(),
    location: Joi.string(),
    birthday: Joi.string(),
    headImg: Joi.string(),
}).without("phone", "platID")

class Command {
    constructor({
                    name,
                    phone,
                    registerType,
                    platID,
                    gender,
                    location,
                    birthday,
                    headImg,
                }) {
        this.name = name
        this.phone = phone
        this.registerType = registerType
        this.platID = platID
        this.gender = gender
        this.location = location
        this.birthday = birthday
        this.headImg = headImg
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
