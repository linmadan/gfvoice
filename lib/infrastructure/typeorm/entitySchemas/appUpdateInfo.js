const {
    EntitySchema
} = require('typeorm')
const AppUpdateInfo = require('../entities/appUpdateInfo')

module.exports = new EntitySchema({
    name: "AppUpdateInfo",
    tableName: "appUpdateInfos",
    target: AppUpdateInfo,
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        vcode: {
            type: "int",
            name: "v_code"
        },
        version: {
            type: "varchar",
            length: 50
        },
        channel: {
            type: "varchar",
            length: 255
        },
        mustUpdate: {
            type: "tinyint",
            name: "must_update"
        },
        appUrl: {
            type: "varchar",
            name: "app_url",
            length: 255
        },
        desc: {
            type: "varchar",
            length: 255
        }
    }
});