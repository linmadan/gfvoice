const {
    EntitySchema
} = require('typeorm')
const Poetry = require('../entities/poetry')

module.exports = new EntitySchema({
    name: "Poetry",
    tableName: "poetries",
    target: Poetry,
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        name: {
            type: "varchar",
            length: 100
        },
        word: {
            type: "text"
        },
        author: {
            type: "varchar",
            length: 100
        },
        accompany: {
            type: "varchar",
            length: 255
        },
        poetryTypeID: {
            type: "int",
            name: "poetry_type_id"
        }
    }
});