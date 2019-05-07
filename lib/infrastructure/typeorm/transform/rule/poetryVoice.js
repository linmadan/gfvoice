const User = require('../../../../domain/user')
const Poetry = require('../../../../domain/poetry')

module.exports = {
    id: {
        path: "id",
        default: 0
    },
    av: {
        path: "av",
        default: ""
    },
    bgState: {
        path: "bgState",
        default: ""
    },
    userID: {
        path: "user.id",
        default: 0
    },
    poetryID: {
        path: "poetry.id",
        default: 0
    },
    pick: {
        path: "pick",
        default: 0
    },
    createTime: {
        path: "createTime",
        default: new Date()
    },
    status: {
        path: "status",
        default: 0
    },
    poetry: {
        path: "poetry",
        appendType: Poetry,
        rule: "poetry",
        default: null
    },
    user: {
        path: "user",
        appendType: User,
        rule: "user",
        default: null
    }
}
