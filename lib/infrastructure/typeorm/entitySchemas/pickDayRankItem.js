const {
    EntitySchema
} = require('typeorm')
const PickDayRankItem = require('../entities/pickDayRankItem')

module.exports = new EntitySchema({
    name: "PickDayRankItem",
    tableName: "pickDayRankItems",
    target: PickDayRankItem,
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
        pick: {
            type: "int"
        },
        day: {
            type: "varchar",
            length: 50
        }
    }
});