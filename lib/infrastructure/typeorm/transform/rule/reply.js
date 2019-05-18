const User = require('../../../../domain/user')
const Comment = require('../../../../domain/comment')

module.exports = {
    id: {
        path: "id",
        default: 0
    },
    userID: {
        path: "user.id",
        default: 0
    },
    commentID: {
        path: "comment.id",
        default: 0
    },
    content: {
        path: "content",
        default: ""
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
    comment: {
        path: "comment",
        appendType: Comment,
        rule: "comment",
        default: null
    }
}
