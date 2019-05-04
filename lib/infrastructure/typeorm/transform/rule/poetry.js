const PoetryType = require('../../../../domain/poetryType')

module.exports = {
    id: {
        path: "id",
        default: 0
    },
    name: {
        path: "name",
        default: ""
    },
    word: {
        path: "word",
        default: ""
    },
    author: {
        path: "author",
        default: ""
    },
    accompany: {
        path: "accompany",
        default: ""
    },
    poetryTypeID: {
        path: "poetryType.id",
        default: 0
    },
    poetryType: {
        path: "poetryType",
        appendType: PoetryType,
        rule: "poetryType",
        default: null
    },
}
