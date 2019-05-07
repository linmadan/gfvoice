const {
    EntitySchema
} = require('typeorm')
const Message = require('../entities/message')

module.exports = new EntitySchema({
    name: "Message",
    tableName: "messages",
    target: Message,
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        title: {
            type: "varchar",
            length: 100
        },
        content: {
            type: "varchar",
            length: 255
        },
        type: {
            type: "int",
        },
        createTime: {
            type: "timestamp",
            name: "create_time"
        },
        toUserID: {
            type: "int",
            name: "to_user_id"
        },
    },
});