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
        const {pickDayRankItems, count} = await pickDAO.findPickDayRankItem({
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

    async getPickDayRankTop() {
        const pickDAO = createPickDAO()
        const rowDataPackets = await pickDAO.findPickDayRankTop()
        _.remove(rowDataPackets,rowDataPacket=>{
            return rowDataPacket.day == moment().format('YYYY-MM-DD')
        })
        return {
            count: rowDataPackets.length,
            list: rowDataPackets.map(rowDataPacket => {
                let user = {}
                user.id = rowDataPacket.userID
                user.name = rowDataPacket.userName
                user.headImg = rowDataPacket.userHeadImg
                user.gender = rowDataPacket.userGender
                return {
                    user,
                    pick: rowDataPacket.pick,
                    createTime: (new Date(rowDataPacket.day)).getTime()
                }
            })
        }
    }
}

module.exports = Service