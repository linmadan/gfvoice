const User = require('../../../../domain/user')
const PoetryVoice = require('../../../../domain/poetryVoice')
const Reply = require('../../../../domain/reply')

module.exports = {
    id: {
        path: "id",
        default: 0
    },
    content: {
        path: "content",
        default: ""
    },
    userID: {
        path: "user.id",
        default: 0
    },
    poetryVoiceID: {
        path: "poetryVoice.id",
        default: 0
    },
    isAuthor: {
        path: "isAuthor",
        default: false
    },
    upCount: {
        path: "upCount",
        default: 0
    },
    status: {
        path: "status",
        default: 0
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
    },
    poetryVoice: {
        path: "poetryVoice",
        appendType: PoetryVoice,
        rule: "poetryVoice",
        default: null
    },
    replies: {
        path: "replies",
        appendType: Reply,
        rule: "reply",
        default: null
    }
}
