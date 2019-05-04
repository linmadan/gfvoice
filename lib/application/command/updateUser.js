const _ = require('lodash')
const Joi = require('joi')
const {
    throwServiceError
} = require('../../util/errors')
const constant = require('../../util/constant')

const schema = Joi.object().keys({
    userID: Joi.string().required(),
    name: Joi.string(),
    gender: Joi.string(),
    location: Joi.string(),
    birthday: Joi.string(),
    headImg: Joi.string(),
    pics: Joi.array().items(Joi.string())
})

class Command {
    constructor({
                    userID,
                    name,
                    gender,
                    location,
                    birthday,
                    headImg,
                    pics,
                }) {
        this.userID = userID
        this.name = name
        this.gender = gender
        this.location = location
        this.birthday = birthday
        this.headImg = headImg
        this.pics = pics
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
