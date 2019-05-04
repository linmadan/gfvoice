const createDBConnection = require("./typeorm/connection");
const createTransactionContext = require("./typeorm/transactionContext");
const {
    createPoetryTypeRepository,
    createPoetryRepository,
    createSlideRepository
} = require('./repository');

module.exports = {
    createDBConnection,
    createTransactionContext,
    createPoetryTypeRepository,
    createPoetryRepository,
    createSlideRepository
};