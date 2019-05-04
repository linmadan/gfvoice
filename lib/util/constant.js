module.exports = {
    SERVICE_GATEWAY: {},
    MYSQL: {
        HOST: process.env.MYSQL_HOST ? process.env.MYSQL_HOST : "101.37.68.23",
        PORT: process.env.MYSQL_PORT ? process.env.MYSQL_PORT : 3306,
        USER: process.env.MYSQL_USER ? process.env.MYSQL_USER : "root",
        PASSWORD: process.env.MYSQL_PASSWORD ? process.env.MYSQL_PASSWORD : "sutianxia2018",
        DB_NAME: process.env.MYSQL_DB_NAME ? process.env.MYSQL_DB_NAME : "gf_voice",
        IS_SYNCHRONIZE: process.env.IS_SYNCHRONIZE ? process.env.IS_SYNCHRONIZE : true,
    },
    STATUS_CODE: {
        SERVICE_BASE_CODE: process.env.SERVICE_BASE_CODE ? process.env.SERVICE_BASE_CODE : 1,
        SERVICE_BASE_CODE_MULTIPLE: process.env.SERVICE_BASE_CODE_MULTIPLE ? process.env.SERVICE_BASE_CODE_MULTIPLE : 1000,
        RES_OK: {
            code: 0,
            message: "ok",
        },
        RES_NO_FIND: {
            code: 400,
            message: "找不到相关资源",
        },
        INTERNAL_SERVER_ERROR: {
            message: '内部服务出错',
            code: 500,
        },
        BAD_GATEWAY: {
            message: '后台服务网关错误',
            code: 503,
        },
        TRANSACTION_ERROR: {
            message: '事务处理错误',
            code: 504,
        },
        ARG_ERROR: {
            message: '参数缺失或者无效',
            code: 505,
        },
        INVALID_PHONE: {
            code: 101,
            message: "登入失败，无效的手机号码",
        },
        PHONE_EXIST: {
            code: 102,
            message: "注册失败，手机号码已经注册过了",
        },
        PHONE_HAD_BIND: {
            code: 103,
            message: "绑定手机号码失败，手机号码已经被绑定过了",
        },
    },
}