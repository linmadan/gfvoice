const {
    EntitySchema
} = require('typeorm')
const FocusRelation = require('../entities/focusRelation')

module.exports = new EntitySchema({
    name: "FocusRelation",
    tableName: "focusRelations",
    target: FocusRelation,
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        followerID: {
            type: "int",
            name: "follower_user_id"
        },
        focuserID: {
            type: "int",
            name: "focuser_user_id"
        },
        time: {
            type: "timestamp"
        },
    }
});