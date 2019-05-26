const createPortryDAO = require('./typeormPortryDAO');

const createCommentDAO = require('./typeormCommentDAO');

const createPickDAO = require('./typeormPickDAO');

module.exports = {
    createPickDAO,
    createCommentDAO,
    createPortryDAO
};