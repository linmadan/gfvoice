const _ = require('lodash')
const {
    loadAndValidateSubmitComplainCommand
} = require('../command')
const {
    createComplainRepository,
    createUserRepository,
    createPoetryVoiceRepository
} = require('../../infrastructure')
const {
    throwServiceError
} = require('../../util/errors')
const constant = require('../../util/constant')

class Service {
    constructor() {
    }

    async submitComplain(complainData) {
        loadAndValidateSubmitComplainCommand(complainData)
        const complainRepository = createComplainRepository()
        let complain = await complainRepository.findOne({
            type: complainData.type,
            complainant: complainData.fromUserID,
            target: complainData.targetID
        })
        if (!_.isNull(complain)) {
            throwServiceError(constant.STATUS_CODE.HAD_COMPLAIN)
        }
        const userRepository = createUserRepository()
        let complainant = await userRepository.findOne({
            userID: complainData.fromUserID
        })
        if (_.isNull(complainant)) {
            throwServiceError(constant.STATUS_CODE.RES_NO_FIND)
        }
        if (complainData.type == constant.COMPLAIN_TYPE.USER) {
            let user = await userRepository.findOne({
                userID: complainData.targetID
            })
            if (_.isNull(user)) {
                throwServiceError(constant.STATUS_CODE.RES_NO_FIND)
            }
            complain = complainant.complainUser(user, complainData.reason)
        }
        if (complainData.type == constant.COMPLAIN_TYPE.POETRY_VOICE) {
            const poetryVoiceRepository = createPoetryVoiceRepository()
            let poetryVoice = await poetryVoiceRepository.findOne({
                poetryVoiceID: complainData.targetID
            })
            if (_.isNull(poetryVoice)) {
                throwServiceError(constant.STATUS_CODE.RES_NO_FIND)
            }
            complain = complainant.complainPoetryVoice(poetryVoice, complainData.reason)
        }
        await complainRepository.save(complain)
    }

    async getComplainByID(complainID) {
        if (_.isUndefined(complainID)) {
            throwServiceError(constant.STATUS_CODE.ARG_ERROR)
        }
        const complainRepository = createComplainRepository()
        let complain = await complainRepository.findOne({complainID})
        if (_.isNull(complain)) {
            throwServiceError(constant.STATUS_CODE.RES_NO_FIND)
        }
        return {
            ...complain
        }
    }

    async getComplains(queryOptions) {
        const complainRepository = createComplainRepository()
        const {complains, count} = await complainRepository.find(queryOptions)
        return {
            count,
            complains: complains.map(complain => {
                return {...complain}
            })
        }
    }
}

module.exports = Service