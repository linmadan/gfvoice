const createSlideRepository = require('./typeormSlideRepository');

const createPoetryRepository = require('./typeormPoetryRepository');

const createPoetryTypeRepository = require('./typeormPoetryTypeRepository');

module.exports = {
    createPoetryTypeRepository,
    createPoetryRepository,
    createSlideRepository
};