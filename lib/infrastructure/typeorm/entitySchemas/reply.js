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
            type: "int",
            generated: true
        },
        userID: {
            type: "int",
            name: "user_id"
        },
        commentID: {
            type: "int",
            name: "comment_id"
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