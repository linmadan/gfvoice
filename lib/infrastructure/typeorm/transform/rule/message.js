const User = require('../../../../domain/user')

module.exports = {
    id: {
        path: "id",
        default: 0
    },
    title: {
        path: "title",
        default: ""
    },
    content: {
        path: "content",
        default: ""
    },
    type: {
        path: "type",
        default: 0
    },
    createTime: {
        path: "createTime",
        default: new Date()
    },
    toUserID: {
        path: "toUser.id",
        default: 0
    },
    toUser: {
        path: "toUser",
        appendType: User,
        rule: "user",
        default: null
    }
}
