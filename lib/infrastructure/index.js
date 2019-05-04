const createDBConnection = require("./typeorm/connection");
const createTransactionContext = require("./typeorm/transactionContext");
const {
    createPoetryTypeRepository,
    createPoetryRepository,
    createSlideRepository,
    createUserRepository
} = require('./repository');

module.exports = {
    createDBConnection,
    createTransactionContext,
    createPoetryTypeRepository,
    createPoetryRepository,
    createSlideRepository,
    createUserRepository
};