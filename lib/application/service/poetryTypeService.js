const _ = require('lodash')
const {
    PoetryType
} = require('../../domain')
const {
    loadAndValidateCreatePoetryTypeCommand,
    loadAndValidateUpdatePoetryTypeCommand,
    loadAndValidateRemovePoetryTypeCommand
} = require('../command')
const {
    createPoetryTypeRepository
} = require('../../infrastructure')
const {
    throwServiceError
} = require('../../util/errors')
const constant = require('../../util/constant')

class Service {
    constructor() {
    }

    async createPoetryType(poetryTypeData) {
        loadAndValidateCreatePoetryTypeCommand(poetryTypeData)
        const poetryTypeRepository = createPoetryTypeRepository()
        const poetryType = await poetryTypeRepository.save(new PoetryType(poetryTypeData))
        return {
            ...poetryType
        }
    }

    async getPoetryTypeByID(poetryTypeID) {
        if (_.isUndefined(poetryTypeID)) {
            throwServiceError(constant.STATUS_CODE.ARG_ERROR)
        }
        const poetryTypeRepository = createPoetryTypeRepository()
        let poetryType = await poetryTypeRepository.findOne({poetryTypeID})
        if (_.isNull(poetryType)) {
            throwServiceError(constant.STATUS_CODE.RES_NO_FIND)
        }
        return {
            ...poetryType
        }
    }

    async updatePoetryType(poetryTypeData) {
        loadAndValidateUpdatePoetryTypeCommand(poetryTypeData)
        const poetryTypeRepository = createPoetryTypeRepository()
        let poetryType = await poetryTypeRepository.findOne({
            poetryTypeID: poetryTypeData.poetryTypeID
        })
        if (_.isNull(poetryType)) {
            throwServiceError(constant.STATUS_CODE.RES_NO_FIND)
        }
        poetryType.update(poetryTypeData)
        await poetryTypeRepository.save(poetryType)
        poetryType = await poetryTypeRepository.findOne({
            poetryTypeID: poetryTypeData.poetryTypeID
        })
        return {
            ...poetryType
        }
    }

    async removePoetryType(poetryTypeID) {
        loadAndValidateRemovePoetryTypeCommand({poetryTypeID})
        const poetryTypeRepository = createPoetryTypeRepository()
        let poetryType = await poetryTypeRepository.findOne({poetryTypeID})
        if (_.isNull(poetryType)) {
            throwServiceError(constant.STATUS_CODE.RES_NO_FIND)
        }
        await poetryTypeRepository.remove(poetryType)
        return {
            ...poetryType
        }
    }

    async getPoetryTypes(queryOptions) {
        const poetryTypeRepository = createPoetryTypeRepository()
        const {poetryTypes, count} = await poetryTypeRepository.find(queryOptions)
        return {
            count,
            list: poetryTypes.map(poetryType => {
                return {...poetryType}
            })
        }
    }
}

module.exports = Service