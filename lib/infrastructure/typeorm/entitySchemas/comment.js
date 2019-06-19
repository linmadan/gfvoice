const {
    EntitySchema
} = require('typeorm')
const Comment = require('../entities/comment')

module.exports = new EntitySchema({
    name: "Comment",
    tableName: "comments",
    target: Comment,
    columns: {
        id: {
            primary: true,
            type: "bigint"
        },
        content: {
            type: "text"
        },
        userID: {
            type: "bigint",
            name: "user_id"
        },
        poetryVoiceID: {
            type: "bigint",
            name: "poetry_voice_id"
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