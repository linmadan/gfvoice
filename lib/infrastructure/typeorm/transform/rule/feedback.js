const User = require('../../../../domain/user')

module.exports = {
    id: {
        path: "id",
        default: 0
    },
    userID: {
        path: "user.id",
        default: 0
    },
    content: {
        path: "content",
        default: ""
    },
    createTime: {
        path: "createTime",
        default: new Date()
    },
    user: {
        path: "user",
        appendType: User,
        rule: "user",
        default: null
    }
}
