const {
    EntitySchema
} = require('typeorm')
const User = require('../entities/user')

module.exports = new EntitySchema({
    name: "User",
    tableName: "users",
    target: User,
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
        phone: {
            type: "varchar",
            length: 100
        },
        registerType: {
            type: "int",
        },
        platID: {
            type: "varchar",
            length: 255
        },
        bindPhone: {
            type: "varchar",
            length: 100
        },
        pick: {
            type: "int",
            length: 0
        },
        gender: {
            type: "varchar",
            name: "info_gender",
            length: 10
        },
        pics: {
            type: "simple-array",
            name: "info_pics"
        },
        location: {
            type: "varchar",
            name: "info_location",
            length: 100
        },
        birthday: {
            type: "varchar",
            name: "info_birthday",
            length: 100
        },
        headImg: {
            type: "varchar",
            name: "info_headImg",
            length: 255
        }
    }
});