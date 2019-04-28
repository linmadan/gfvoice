const _ = require('lodash')
const constant = require('./constant')

function getErrorCode(errorCode) {
    return (Number(constant.STATUS_CODE.SERVICE_BASE_CODE) * Number(constant.STATUS_CODE.SERVICE_BASE_CODE_MULTIPLE)) + Number(errorCode)
}

function createError(Error) {
    const replaceObjRe = /\{([\s\S]+?)\}/g
    const replaceMessage = (message, replaceObj) => {
        if (replaceObjRe.test(message)) {
            return message.replace(replaceObjRe, (_, str) => {
                if (!_.isUndefined(replaceObj[str])) {
                    return replaceObj[str]
                }
                return str
            })
        } else {
            return message
        }
    }
    return ({message, code}, replaceObj) => {
        if (_.isObject(replaceObj)) {
            message = replaceMessage(message, replaceObj)
        }
        throw new Error(code, message)
    }
}

class ServiceError extends Error {
    constructor(code, message) {
        super()
        const serviceCode = !_.isUndefined(code) ? code : constant.STATUS_CODE.INTERNAL_SERVER_ERROR.code
        const serviceMessage = !_.isUndefined(message) ? `${message}` : constant.STATUS_CODE.INTERNAL_SERVER_ERROR.message
        this.code = getErrorCode(serviceCode)
        this.message = serviceMessage
    }
}

const throwServiceError = createError(ServiceError)

class GatewayError extends Error {
    constructor(code, message) {
        super()
        const gatewayCode = !_.isUndefined(code) ? code : constant.STATUS_CODE.BAD_GATEWAY.code
        const gatewayMessage = !_.isUndefined(message) ? `${constant.STATUS_CODE.BAD_GATEWAY.message}:${message}` : getErrorCode(constant.STATUS_CODE.BAD_GATEWAY.message)
        this.code = gatewayCode
        this.message = gatewayMessage
    }
}

const throwGatewayError = createError(GatewayError)

module.exports = {
    throwServiceError,
    throwGatewayError
}