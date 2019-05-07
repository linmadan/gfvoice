const {
    EntitySchema
} = require('typeorm')
const PoetryVoice = require('../entities/poetryVoice')

module.exports = new EntitySchema({
    name: "PoetryVoice",
    tableName: "poetryVoices",
    target: PoetryVoice,
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        av: {
            type: "varchar",
            length: 255
        },
        bgState: {
            type: "tinyint",
            name: "bg_state",
        },
        userID: {
            type: "int",
            name: "user_id"
        },
        poetryID: {
            type: "int",
            name: "poetry_id"
        },
        pick: {
            type: "int"
        },
        createTime: {
            type: "timestamp",
            name: "create_time"
        },
        status: {
            type: "int"
        }
    }
});