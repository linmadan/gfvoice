const {
    EntitySchema
} = require('typeorm')
const Slide = require('../entities/slide')

module.exports = new EntitySchema({
    name: "Slide",
    tableName: "slides",
    target: Slide,
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        type: {
            type: "int",
        },
        param: {
            type: "varchar",
            length: 255
        },
        tag: {
            type: "varchar",
            length: 255
        },
        pic: {
            type: "varchar",
            length: 255
        },
    }
});