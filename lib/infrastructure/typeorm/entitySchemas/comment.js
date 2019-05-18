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
            type: "int",
            generated: true
        },
        content: {
            type: "text"
        },
        userID: {
            type: "int",
            name: "user_id"
        },
        poetryVoiceID: {
            type: "int",
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