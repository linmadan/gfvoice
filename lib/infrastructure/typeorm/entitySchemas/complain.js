const {
    EntitySchema
} = require('typeorm')
const Complain = require('../entities/complain')

module.exports = new EntitySchema({
    name: "Complain",
    tableName: "complains",
    target: Complain,
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        type: {
            type: "int"
        },
        reason: {
            type: "varchar",
            length: 255
        },
        complainant: {
            type: "bigint",
            name: "complainant_user_id"
        },
        target: {
            type: "bigint",
            name: "target_id"
        },
        createTime: {
            type: "timestamp",
            name: "create_time"
        }
    }
});