const {
    EntitySchema
} = require('typeorm')
const Feedback = require('../entities/feedback')

module.exports = new EntitySchema({
    name: "Feedback",
    tableName: "feedbacks",
    target: Feedback,
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        userID: {
            type: "bigint",
            name: "user_id"
        },
        content: {
            type: "text",
        },
        createTime: {
            type: "timestamp",
            name: "create_time"
        }
    }
});