const {
    EntitySchema
} = require('typeorm')
const PoetryType = require('../entities/poetryType')

module.exports = new EntitySchema({
    name: "PoetryType",
    tableName: "poetryTypes",
    target: PoetryType,
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        name: {
            type: "varchar",
            length: 255
        },
        pic: {
            type: "varchar",
            length: 255
        },
    }
});