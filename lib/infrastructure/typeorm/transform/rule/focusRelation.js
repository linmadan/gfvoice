const User = require('../../../../domain/user')

module.exports = {
    id: {
        path: "id",
        default: 0
    },
    followerID: {
        path: "follower.id",
        default: 0
    },
    focuserID: {
        path: "focuser.id",
        default: 0
    },
    time: {
        path: "time",
        default: new Date()
    },
    follower: {
        path: "follower",
        appendType: User,
        rule: "user",
        default: null
    },
    focuser: {
        path: "focuser",
        appendType: User,
        rule: "user",
        default: null
    }
}
