const _ = require('lodash')
const {
    Poetry
} = require('../../domain')
const {
    loadAndValidateCreatePoetryCommand,
    loadAndValidateUpdatePoetryCommand,
    loadAndValidateRemovePoetryCommand
} = require('../command')
const {
    createPoetryRepository,
    createPoetryTypeRepository
} = require('../../infrastructure')
const {
    throwServiceError
} = require('../../util/errors')
const constant = require('../../util/constant')

class Service {
    constructor() {
    }

    async createPoetry(poetryData) {
        loadAndValidateCreatePoetryCommand(poetryData)
        const poetryType = await createPoetryTypeRepository().findOne({poetryTypeID: poetryData.poetryTypeID})
        if (_.isNull(poetryType)) {
            throwServiceError(constant.STATUS_CODE.RES_NO_FIND)
        }
        poetryData.poetryType = poetryType
        const poetryRepository = createPoetryRepository()
        const poetry = await poetryRepository.save(new Poetry(poetryData))
        return {
            ...poetry
        }
    }

    async getPoetryByID(poetryID) {
        if (_.isUndefined(poetryID)) {
            throwServiceError(constant.STATUS_CODE.ARG_ERROR)
        }
        const poetryRepository = createPoetryRepository()
        let poetry = await poetryRepository.findOne({poetryID})
        if (_.isNull(poetry)) {
            throwServiceError(constant.STATUS_CODE.RES_NO_FIND)
        }
        return {
            ...poetry
        }
    }

    async updatePoetry(poetryData) {
        loadAndValidateUpdatePoetryCommand(poetryData)
        if (!_.isUndefined(poetryData.poetryTypeID)) {
            const poetryType = await createPoetryTypeRepository().findOne({poetryTypeID: poetryData.poetryTypeID})
            if (_.isNull(poetryType)) {
                throwServiceError(constant.STATUS_CODE.RES_NO_FIND)
            }
            poetryData.poetryType = poetryType
        }
        const poetryRepository = createPoetryRepository()
        let poetry = await poetryRepository.findOne({
            poetryID: poetryData.poetryID
        })
        if (_.isNull(poetry)) {
            throwServiceError(constant.STATUS_CODE.RES_NO_FIND)
        }
        poetry.update(poetryData)
        await poetryRepository.save(poetry)
        poetry = await poetryRepository.findOne({
            poetryID: poetryData.poetryID
        })
        return {
            ...poetry
        }
    }

    async removePoetry(poetryID) {
        loadAndValidateRemovePoetryCommand({poetryID})
        const poetryRepository = createPoetryRepository()
        let poetry = await poetryRepository.findOne({poetryID})
        if (_.isNull(poetry)) {
            throwServiceError(constant.STATUS_CODE.RES_NO_FIND)
        }
        await poetryRepository.remove(poetry)
        return {
            ...poetry
        }
    }

    async getPoetrys(queryOptions) {
        const poetryRepository = createPoetryRepository()
        const {poetrys, count} = await poetryRepository.find(queryOptions)
        return {
            count,
            poetrys: poetrys.map(poetry => {
                return {...poetry}
            })
        }
    }
}

module.exports = Service