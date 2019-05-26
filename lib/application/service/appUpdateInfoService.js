const _ = require('lodash')
const {
    AppUpdateInfo
} = require('../../domain')
const {
    loadAndValidateCreateAppUpdateInfoCommand,
    loadAndValidateUpdateAppUpdateInfoCommand,
    loadAndValidateRemoveAppUpdateInfoCommand
} = require('../command')
const {
    createAppUpdateInfoRepository
} = require('../../infrastructure')
const {
    throwServiceError
} = require('../../util/errors')
const constant = require('../../util/constant')

class Service {
    constructor() {
    }

    async createAppUpdateInfo(appUpdateInfoData) {
        loadAndValidateCreateAppUpdateInfoCommand(appUpdateInfoData)
        const appUpdateInfoRepository = createAppUpdateInfoRepository()
        const appUpdateInfo = await appUpdateInfoRepository.save(new AppUpdateInfo(appUpdateInfoData))
        return {
            ...appUpdateInfo
        }
    }

    async getAppUpdateInfoByID(appUpdateInfoID) {
        if (_.isUndefined(appUpdateInfoID)) {
            throwServiceError(constant.STATUS_CODE.ARG_ERROR)
        }
        const appUpdateInfoRepository = createAppUpdateInfoRepository()
        let appUpdateInfo = await appUpdateInfoRepository.findOne({appUpdateInfoID})
        if (_.isNull(appUpdateInfo)) {
            throwServiceError(constant.STATUS_CODE.RES_NO_FIND)
        }
        return {
            ...appUpdateInfo
        }
    }

    async updateAppUpdateInfo(appUpdateInfoData) {
        loadAndValidateUpdateAppUpdateInfoCommand(appUpdateInfoData)
        const appUpdateInfoRepository = createAppUpdateInfoRepository()
        let appUpdateInfo = await appUpdateInfoRepository.findOne({
            appUpdateInfoID: appUpdateInfoData.appUpdateInfoID
        })
        if (_.isNull(appUpdateInfo)) {
            throwServiceError(constant.STATUS_CODE.RES_NO_FIND)
        }
        appUpdateInfo.update(appUpdateInfoData)
        await appUpdateInfoRepository.save(appUpdateInfo)
        appUpdateInfo = await appUpdateInfoRepository.findOne({
            appUpdateInfoID: appUpdateInfoData.appUpdateInfoID
        })
        return {
            ...appUpdateInfo
        }
    }

    async removeAppUpdateInfo(appUpdateInfoID) {
        loadAndValidateRemoveAppUpdateInfoCommand({appUpdateInfoID})
        const appUpdateInfoRepository = createAppUpdateInfoRepository()
        let appUpdateInfo = await appUpdateInfoRepository.findOne({appUpdateInfoID})
        if (_.isNull(appUpdateInfo)) {
            throwServiceError(constant.STATUS_CODE.RES_NO_FIND)
        }
        await appUpdateInfoRepository.remove(appUpdateInfo)
        return {
            ...appUpdateInfo
        }
    }

    async getAppUpdateInfos(queryOptions) {
        const appUpdateInfoRepository = createAppUpdateInfoRepository()
        const {appUpdateInfos, count} = await appUpdateInfoRepository.find(queryOptions)
        return {
            count,
            appUpdateInfos: appUpdateInfos.map(appUpdateInfo => {
                return {...appUpdateInfo}
            })
        }
    }
}

module.exports = Service