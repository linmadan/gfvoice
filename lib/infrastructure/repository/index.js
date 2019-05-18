const createReplyRepository = require('./typeormReplyRepository');

const createCommentRepository = require('./typeormCommentRepository');

const createComplainRepository = require('./typeormComplainRepository');

const createPickRecordRepository = require('./typeormPickRecordRepository');

const createMessageRepository = require('./typeormMessageRepository');

const createPoetryVoiceRepository = require('./typeormPoetryVoiceRepository');

const createFocusRelationRepository = require('./typeormFocusRelationRepository');

const createUserRepository = require('./typeormUserRepository');

const createSlideRepository = require('./typeormSlideRepository');

const createPoetryRepository = require('./typeormPoetryRepository');

const createPoetryTypeRepository = require('./typeormPoetryTypeRepository');

module.exports = {
    createPoetryTypeRepository,
    createPoetryRepository,
    createSlideRepository,
    createUserRepository,
    createFocusRelationRepository,
    createPoetryVoiceRepository,
    createMessageRepository,
    createPickRecordRepository,
    createComplainRepository,
    createCommentRepository,
    createReplyRepository
};