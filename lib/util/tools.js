const _ = require('lodash')
const constant = require('./constant')

function createPrivateInstanceWrap(privateClass) {
    let instanceCache = null
    return function createPrivateInstance(single = true) {
        if (single && instanceCache) {
            return instanceCache
        }
        return (instanceCache = new privateClass())
    }
}

function firstStringToUppercase(str) {
    return str.replace(/^(\w){1}(.*)/, ($0, $1, $2) => {
        return $1.toUpperCase() + $2
    })
}

function firstStringToLower(str) {
    return str.replace(/^(\w){1}(.*)/, ($0, $1, $2) => {
        return $1.toLowerCase() + $2
    })
}

function responseData(ctx, data) {
    ctx.response.body = {
        code: constant.STATUS_CODE.RES_OK.code,
        msg: constant.STATUS_CODE.RES_OK.message,
        data,
    }
}

function responseError(ctx, err) {
    if (_.isUndefined(err.code) || !_.isInteger(err.code)) {
        ctx.response.body = {
            code: (Number(constant.STATUS_CODE.SERVICE_BASE_CODE) * Number(constant.STATUS_CODE.SERVICE_BASE_CODE_MULTIPLE)) + Number(constant.STATUS_CODE.INTERNAL_SERVER_ERROR.code),
            msg: `${constant.STATUS_CODE.INTERNAL_SERVER_ERROR.message};${err.message}`
        }
    }
    else {
        ctx.response.body = {
            code: err.code,
            msg: err.message
        }
    }
    if (true) {
        ctx.logger.error(err.stack)
    }
    // if (process.env.PRINT_ERROR_STACK) {
    //     ctx.logger.error(err.stack)
    // }
}


module.exports = {
    createPrivateInstanceWrap,
    firstStringToUppercase,
    firstStringToLower,
    responseData,
    responseError
}
