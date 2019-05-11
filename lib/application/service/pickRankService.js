const _ = require('lodash')
const moment = require('moment')
const {
    createPickDAO
} = require('../../infrastructure')
const {
    throwServiceError
} = require('../../util/errors')
const constant = require('../../util/constant')

class Service {
    constructor() {
    }

    async getPickDayRank() {
        const pickDAO = createPickDAO()
        const {pickDayRankItems, count} = await pickDAO.find({
            day: moment().format('YYYY-MM-DD'),
            offset: 0,
            limit: 99
        })
        return {
            count,
            list: pickDayRankItems.map(pickDayRankItem => {
                return {
                    user: {
                        id: pickDayRankItem.user.id,
                        name: pickDayRankItem.user.name,
                        headImg: pickDayRankItem.user.headImg,
                        gender: pickDayRankItem.user.gender
                    },
                    pick: pickDayRankItem.pick
                }
            })
        }
    }
}

module.exports = Service