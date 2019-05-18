const reply = require('./reply');

const comment = require('./comment');

const complain = require('./complain');

const pickRecord = require('./pickRecord');

const message = require('./message');

const poetryVoice = require('./poetryVoice');

const focusRelation = require('./focusRelation');

const user = require("./user");

const poetry = require('./poetry');
const poetryType = require('./poetryType');
const slide = require('./slide');

module.exports = {
    poetry,
    poetryType,
    slide,
    user,
    focusRelation,
    poetryVoice,
    message,
    pickRecord,
    complain,
    comment,
    reply
};