const _ = require('lodash')
const moment = require('moment')
const {
    getRepository
} = require('typeorm')
const constant = require('../../util/constant')

class DAO {
    constructor({
                    transactionContext = null
                } = {}) {
        this._transactionManager = _.isNull(transactionContext) ? null : transactionContext.queryRunner.manager
    }

    async handlePickRecord(pickRecord) {
        if (_.isNull(this._transactionManager)) {
            throw new Error("无效的事务上下文")
        }
        const day = moment(pickRecord.time).format('YYYY-MM-DD')
        if (await this._transactionManager.findOne("PickDayRankItem", {
            userID: pickRecord.toUserID,
            day
        })) {
            await this._transactionManager.increment("PickDayRankItem", {
                id: pickRecord.toUserID,
                day
            }, "pick", 1)
        } else {
            await this._transactionManager.insert("PickDayRankItem", {
                userID: pickRecord.toUserID,
                pick: 1,
                day,
            })
        }
        await this._transactionManager.increment("User", {id: pickRecord.toUserID}, "pick", 1)
        await this._transactionManager.increment("PoetryVoice", {id: pickRecord.poetryVoiceID}, "pick", 1)
    }

    async find(queryOptions) {
        const queryBuilder = getRepository("PickDayRankItem").createQueryBuilder("pickDayRankItem")
            .leftJoinAndMapOne("pickDayRankItem.user", "users", "user", "user.id = pickDayRankItem.userID")
        const {
            day,
            offset,
            limit
        } = queryOptions
        if (day) {
            queryBuilder.where(`pickDayRankItem.day = :day`, {day})
        }
        if (_.isUndefined(offset)) {
            queryBuilder.skip(0)
        }
        else {
            if (!_.isNull(offset)) {
                queryBuilder.skip(offset)
            }
        }
        if (_.isUndefined(limit)) {
            queryBuilder.take(20)
        }
        else {
            if (!_.isNull(limit)) {
                queryBuilder.take(limit)
            }
        }
        queryBuilder
            .orderBy("pickDayRankItem.pick", "DESC")
        const [pickDayRankItems, count] = await queryBuilder.getManyAndCount()
        return {
            pickDayRankItems,
            count
        }
    }
}

function createDAO(options) {
    return new DAO(options)
}

module.exports = createDAO