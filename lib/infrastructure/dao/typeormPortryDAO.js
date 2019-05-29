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

    async getPoetryCount() {
        const queryBuilder = getRepository("Poetry").createQueryBuilder("poetry")
        return await queryBuilder.getCount()
    }

    async sortPoetryIDByUseNum() {
        const queryBuilder = getRepository("Poetry").createQueryBuilder("poetry")
            .select("poetry.id", "id")
            .orderBy("poetry.useNum", "DESC")
        const rowDataPackets = await queryBuilder.getRawMany()
        return rowDataPackets.map(rowDataPacket => rowDataPacket.id)
    }
}

function createDAO(options) {
    return new DAO(options)
}

module.exports = createDAO