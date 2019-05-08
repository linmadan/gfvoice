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
            type: "int",
            name: "poetry_voice_id"
        },
        fromUserID: {
            type: "int",
            name: "from_user_id"
        },
        toUserID: {
            type: "int",
            name: "to_user_id"
        },
        time: {
            type: "timestamp"
        },
    }
});