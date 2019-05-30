const _ = require('lodash')
const {
    getRepository,
    getManager
} = require('typeorm')
const constant = require('../../util/constant');

class DAO {
    constructor({
                    transactionContext = null
                } = {}) {
        this._transactionManager = _.isNull(transactionContext) ? null : transactionContext.queryRunner.manager
    }

    async usePoetry(poetryID) {
        if (_.isNull(this._transactionManager)) {
            await getManager().increment("Poetry", {id: poetryID}, "useNum", 1)
        } else {
            await this._transactionManager.increment("Poetry", {id: poetryID}, "useNum", 1)
        }
    }

    async getUsedPoetryCount() {
        const queryBuilder = getRepository("Poetry").createQueryBuilder("poetry")
            .where(`poetry.useNum > :useNum`, {useNum: 0})
        return await queryBuilder.getCount()
    }

    async sortPoetryIDByUseNum() {
        const queryBuilder = getRepository("Poetry").createQueryBuilder("poetry")
            .select("poetry.id", "id")
            .where(`poetry.useNum > :useNum`, {useNum: 0})
            .orderBy("poetry.useNum", "DESC")
        const rowDataPackets = await queryBuilder.getRawMany()
        return rowDataPackets.map(rowDataPacket => rowDataPacket.id)
    }

    async listRecommendPoetryVoiceIDs(poetryIDs) {
        if (!_.isArray(poetryIDs) || poetryIDs.length == 0) {
            return []
        }
        const queryBuilder = getRepository("PoetryVoice").createQueryBuilder("poetryVoice")
            .select("MAX(poetryVoice.id)", "id")
            .where(`poetryVoice.poetryID IN (${poetryIDs.join(",")})`)
            .groupBy("poetryVoice.poetryID")
        const rowDataPackets = await queryBuilder.getRawMany()
        return rowDataPackets.map(rowDataPacket => rowDataPacket.id)
    }
}

function createDAO(options) {
    return new DAO(options)
}

module.exports = createDAO