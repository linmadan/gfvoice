const {
    EntitySchema
} = require('typeorm')
const Word = require('../entities/word')

module.exports = new EntitySchema({
    name: "Word",
    tableName: "words",
    target: Word,
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        title: {
            type: "varchar",
            length: 255
        },
    }
});