const _ = require('lodash')
const {
    getRepository
} = require('typeorm')
const constant = require('../../util/constant');

class DAO {
    constructor({
                    transactionContext = null
                } = {}) {
        this._transactionManager = _.isNull(transactionContext) ? null : transactionContext.queryRunner.manager
    }

    async calculatePoetryUseNum(poetryIDs) {
        if (poetryIDs.length == 0) {
            return []
        } else {
            const queryBuilder = getRepository("PoetryVoice").createQueryBuilder("poetryVoice")
                .select("COUNT(poetryVoice.id)", "useNum")
                .addSelect("poetryVoice.poetryID", "id")
                .andWhere(`poetryVoice.poetryID IN (${poetryIDs.join(",")})`)
                .groupBy("poetryVoice.poetryID")
            return await queryBuilder.getRawMany()
        }
    }
}

function createDAO(options) {
    return new DAO(options)
}

module.exports = createDAO