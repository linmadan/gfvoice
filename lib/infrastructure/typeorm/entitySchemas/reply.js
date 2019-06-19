const {
    EntitySchema
} = require('typeorm')
const Reply = require('../entities/reply')

module.exports = new EntitySchema({
    name: "Reply",
    tableName: "replies",
    target: Reply,
    columns: {
        id: {
            primary: true,
            type: "bigint"
        },
        userID: {
            type: "bigint",
            name: "user_id"
        },
        commentID: {
            type: "bigint",
            name: "comment_id"
        },
        poetryVoiceID: {
            type: "bigint",
            name: "poetry_voice_id"
        },
        content: {
            type: "text"
        },
        isAuthor: {
            type: "tinyint",
            name: "is_author"
        },
        upCount: {
            type: "int",
            name: "up_count"
        },
        status: {
            type: "tinyint"
        },
        createTime: {
            type: "timestamp",
            name: "create_time"
        }
    }
});