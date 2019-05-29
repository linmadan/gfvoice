const _ = require('lodash')
const moment = require('moment')
const {
    getRepository,
    getManager
} = require('typeorm')
const constant = require('../../util/constant')

class DAO {
    constructor({
                    transactionContext = null
                } = {}) {
        this._transactionManager = _.isNull(transactionContext) ? null : transactionContext.queryRunner.manager
    }

    async handlePickRecord(pickRecord) {
        let manager
        if (_.isNull(this._transactionManager)) {
            manager = getManager()
        } else {
            manager = this._transactionManager
        }
        const day = moment(pickRecord.time).format('YYYY-MM-DD')
        if (await manager.findOne("PickDayRankItem", {
            userID: pickRecord.toUserID,
            day
        })) {
            await manager.increment("PickDayRankItem", {
                id: pickRecord.toUserID,
                day
            }, "pick", 1)
        } else {
            await manager.insert("PickDayRankItem", {
                userID: pickRecord.toUserID,
                pick: 1,
                day,
            })
        }
        await manager.increment("User", {id: pickRecord.toUserID}, "pick", 1)
        await manager.increment("PoetryVoice", {id: pickRecord.poetryVoiceID}, "pick", 1)
    }

    async findPickDayRankItem(queryOptions) {
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
        } else {
            queryBuilder.skip(offset)
        }
        if (_.isUndefined(limit)) {
            queryBuilder.take(20)
        } else {
            if (limit != 0) {
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

    async findPickDayRankTop() {
        const queryBuilder = getRepository("PickDayRankItem").createQueryBuilder("pickDayRankItem")
            .select("MAX(pickDayRankItem.pick)", "pick")
            .addSelect("pickDayRankItem.day", "day")
            .addSelect(subQuery => {
                return subQuery
                    .select("user.id", "id")
                    .from("User", "user")
                    .where("user.id = pickDayRankItem.userID")
                    .limit(1)
            }, "userID")
            .addSelect(subQuery => {
                return subQuery
                    .select("user.name", "name")
                    .from("User", "user")
                    .where("user.id = pickDayRankItem.userID")
                    .limit(1)
            }, "userName")
            .addSelect(subQuery => {
                return subQuery
                    .select("user.headImg", "headImg")
                    .from("User", "user")
                    .where("user.id = pickDayRankItem.userID")
                    .limit(1)
            }, "userHeadImg")
            .addSelect(subQuery => {
                return subQuery
                    .select("user.gender", "gender")
                    .from("User", "user")
                    .where("user.id = pickDayRankItem.userID")
                    .limit(1)
            }, "userGender")
            .groupBy("pickDayRankItem.day")
            .skip(0)
            .take(60)
            .orderBy("pickDayRankItem.day", "DESC")
        return await queryBuilder.getRawMany()
    }
}

function createDAO(options) {
    return new DAO(options)
}

module.exports = createDAO