const {
    EntitySchema
} = require('typeorm')
const Image = require('../entities/image')

module.exports = new EntitySchema({
    name: "Image",
    tableName: "images",
    target: Image,
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        url: {
            type: "varchar",
            length: 255
        },
        type: {
            type: "int",
        },
    }
});