module.exports = {
    COMPLAIN_TYPE: {
        USER: 1,
        POETRY_VOICE: 2,
        COMMENT: 3,
        REPLY: 4
    },
    IMG_TYPE: {
        POETRY_TYPE_COVER: 1,
    },
    SERVICE_GATEWAY: {},
    MYSQL: {
        HOST: process.env.MYSQL_HOST ? process.env.MYSQL_HOST : "120.76.222.112",
        PORT: process.env.MYSQL_PORT ? process.env.MYSQL_PORT : 3306,
        USER: process.env.MYSQL_USER ? process.env.MYSQL_USER : "root",
        PASSWORD: process.env.MYSQL_PASSWORD ? process.env.MYSQL_PASSWORD : "hy123456",
        DB_NAME: process.env.MYSQL_DB_NAME ? process.env.MYSQL_DB_NAME : "gf_voice",
        FORBID_SYNCHRONIZE: process.env.FORBID_SYNCHRONIZE ? false : true,
    },
    STATUS_CODE: {
        SERVICE_BASE_CODE: process.env.SERVICE_BASE_CODE ? process.env.SERVICE_BASE_CODE : 1,
        SERVICE_BASE_CODE_MULTIPLE: process.env.SERVICE_BASE_CODE_MULTIPLE ? process.env.SERVICE_BASE_CODE_MULTIPLE : 0,
        RES_OK: {
            code: 0,
            message: "ok",
        },
        RES_NO_FIND: {
            code: 404,
            message: "找不到相关资源",
        },
        INTERNAL_SERVER_ERROR: {
            message: '内部服务出错',
            code: 502,
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
        HAD_FOCUS: {
            code: 104,
            message: "此用户已经关注，无需重复关注",
        },
        FOCUS_RELATION_NO_EXIST: {
            code: 105,
            message: "取消关注失败，不存在的关注关系",
        },
        HAD_PICK: {
            code: 106,
            message: "您已经pick过了，无需重复pick",
        },
        HAD_COMPLAIN: {
            code: 107,
            message: "您已经举报过了，无需重复举报",
        },
        HAD_COMMENT: {
            code: 108,
            message: "您已经评论过了",
        },
        HAD_REPLY: {
            code: 109,
            message: "您已经回复过了",
        },
        IS_LATEST_VERSION: {
            code: 201,
            message: "已经是最新版本了",
        }
    },
}