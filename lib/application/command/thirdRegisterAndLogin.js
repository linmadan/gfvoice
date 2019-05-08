const _ = require('lodash')
const Joi = require('joi')
const {
    throwServiceError
} = require('../../util/errors')
const constant = require('../../util/constant')

const schema = Joi.object().keys({
    name: Joi.string().required(),
    registerType: Joi.number().required(),
    platID: Joi.string(),
    openID: Joi.string(),
    gender: Joi.string(),
    location: Joi.string(),
    birthday: Joi.string(),
    headImg: Joi.string(),
})

class Command {
    constructor({
                    name,
                    platID,
                    openID,
                    registerType,
                    gender,
                    location,
                    birthday,
                    headImg,
                }) {
        this.openID = openID
        this.name = name
        this.platID = platID
        this.registerType = registerType
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
