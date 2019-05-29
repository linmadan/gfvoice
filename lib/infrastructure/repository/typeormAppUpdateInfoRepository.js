const _ = require('lodash')
const {
    getRepository
} = require('typeorm')
const {
    transformToDomainModel,
    transformToEntity
} = require('../typeorm/transform')
const AppUpdateInfoEntity = require('../typeorm/entities/appUpdateInfo')
const AppUpdateInfo = require('../../domain/system/appUpdateInfo')
const constant = require('../../util/constant')

class Repository {
    constructor({
                    transactionContext = null
                } = {}) {
        this._transactionManager = _.isNull(transactionContext) ? null : transactionContext.queryRunner.manager
    }

    async save(appUpdateInfo) {
        const appUpdateInfoEntity = transformToEntity(appUpdateInfo, "appUpdateInfo", AppUpdateInfoEntity)
        if (_.isNull(this._transactionManager)) {
            const appUpdateInfoRepository = getRepository("AppUpdateInfo")
            await appUpdateInfoRepository.save(appUpdateInfoEntity)
        }
        else {
            await this._transactionManager.save(appUpdateInfoEntity)
        }
        if (appUpdateInfo.id) {
            return appUpdateInfo
        }
        else {
            appUpdateInfo.id = appUpdateInfoEntity.id
        }
        return appUpdateInfo
    }

    async remove(appUpdateInfo) {
        const appUpdateInfoEntity = transformToEntity(appUpdateInfo, "appUpdateInfo", AppUpdateInfoEntity)
        if (_.isNull(this._transactionManager)) {
            const appUpdateInfoRepository = getRepository("AppUpdateInfo")
            await appUpdateInfoRepository.remove(appUpdateInfoEntity)
        }
        else {
            await this._transactionManager.remove(appUpdateInfoEntity)
        }
    }

    async findOne(queryOptions) {
        let queryBuilder
        if (_.isNull(this._transactionManager)) {
            queryBuilder = getRepository("AppUpdateInfo").createQueryBuilder("appUpdateInfo")
        }
        else {
            queryBuilder = this._transactionManager.createQueryBuilder("AppUpdateInfo", "appUpdateInfo")
        }
        const {
            appUpdateInfoID
        } = queryOptions
        if (appUpdateInfoID) {
            queryBuilder.where(`appUpdateInfo.id = :appUpdateInfoID`, {appUpdateInfoID})
        }
        const appUpdateInfoEntity = await queryBuilder.getOne()
        if (appUpdateInfoEntity) {
            return transformToDomainModel(appUpdateInfoEntity, "appUpdateInfo", AppUpdateInfo)
        }
        else {
            return null
        }
    }

    async find(queryOptions) {
        let queryBuilder
        if (_.isNull(this._transactionManager)) {
            queryBuilder = getRepository("AppUpdateInfo").createQueryBuilder("appUpdateInfo")
        }
        else {
            queryBuilder = this._transactionManager.createQueryBuilder("AppUpdateInfo", "appUpdateInfo")
        }
        const {
            vcode,
            channel,
            offset,
            limit
        } = queryOptions
        if (!_.isUndefined(vcode)) {
            queryBuilder.andWhere(`appUpdateInfo.vcode = :vcode`, {vcode})
        }
        if (!_.isUndefined(channel)) {
            queryBuilder.andWhere(`appUpdateInfo.channel = :channel`, {channel})
        }
        if (_.isUndefined(offset)) {
            queryBuilder.skip(0)
        }
        else {
            if (_.isInteger(offset)) {
                queryBuilder.skip(offset)
            }
        }
        if (_.isUndefined(limit)) {
            queryBuilder.take(20)
        }
        else {
            if (_.isInteger(limit) && limit != 0) {
                queryBuilder.take(limit)
            }
        }
        queryBuilder
            .orderBy("appUpdateInfo.id", "DESC")
        const [appUpdateInfoEntitys, count] = await queryBuilder.getManyAndCount()
        return {
            appUpdateInfos: appUpdateInfoEntitys.map(appUpdateInfoEntity => transformToDomainModel(appUpdateInfoEntity, "appUpdateInfo", AppUpdateInfo)),
            count
        }
    }
}

function createRepository(options) {
    return new Repository(options)
}

module.exports = createRepository
