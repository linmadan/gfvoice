const {
    EntitySchema
} = require('typeorm')
const PickRecord = require('../entities/pickRecord')

module.exports = new EntitySchema({
    name: "PickRecord",
    tableName: "pickRecords",
    target: PickRecord,
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        poetryVoiceID: {
            type: "bigint",
            name: "poetry_voice_id"
        },
        fromUserID: {
            type: "bigint",
            name: "from_user_id"
        },
        toUserID: {
            type: "bigint",
            name: "to_user_id"
        },
        time: {
            type: "timestamp"
        },
    }
});