const _ = require('lodash')
const {
    Word
} = require('../../domain')
const {
    loadAndValidateCreateWordCommand,
    loadAndValidateUpdateWordCommand,
    loadAndValidateRemoveWordCommand
} = require('../command')
const {
    createWordRepository
} = require('../../infrastructure')
const {
    throwServiceError
} = require('../../util/errors')
const constant = require('../../util/constant')

class Service {
    constructor() {
    }

    async createWord(wordData) {
        loadAndValidateCreateWordCommand(wordData)
        const wordRepository = createWordRepository()
        const word = await wordRepository.save(new Word(wordData))
        return {
            ...word
        }
    }

    async getWordByID(wordID) {
        if (_.isUndefined(wordID)) {
            throwServiceError(constant.STATUS_CODE.ARG_ERROR)
        }
        const wordRepository = createWordRepository()
        let word = await wordRepository.findOne({wordID})
        if (_.isNull(word)) {
            throwServiceError(constant.STATUS_CODE.RES_NO_FIND)
        }
        return {
            ...word
        }
    }

    async updateWord(wordData) {
        loadAndValidateUpdateWordCommand(wordData)
        const wordRepository = createWordRepository()
        let word = await wordRepository.findOne({
            wordID: wordData.wordID
        })
        if (_.isNull(word)) {
            throwServiceError(constant.STATUS_CODE.RES_NO_FIND)
        }
        word.update(wordData)
        await wordRepository.save(word)
        word = await wordRepository.findOne({
            wordID: wordData.wordID
        })
        return {
            ...word
        }
    }

    async removeWord(wordID) {
        loadAndValidateRemoveWordCommand({wordID})
        const wordRepository = createWordRepository()
        let word = await wordRepository.findOne({wordID})
        if (_.isNull(word)) {
            throwServiceError(constant.STATUS_CODE.RES_NO_FIND)
        }
        await wordRepository.remove(word)
        return {
            ...word
        }
    }

    async getWords(queryOptions) {
        const wordRepository = createWordRepository()
        const {words, count} = await wordRepository.find(queryOptions)
        return {
            count,
            words: words.map(word => {
                return {...word}
            })
        }
    }
}

module.exports = Service