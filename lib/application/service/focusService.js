const _ = require('lodash')
const {
    loadAndValidateFocusUserCommand,
    loadAndValidateCancelFocusUserCommand
} = require('../command')
const {
    createUserRepository,
    createFocusRelationRepository
} = require('../../infrastructure')
const {
    throwServiceError
} = require('../../util/errors')
const constant = require('../../util/constant')

class Service {
    constructor() {
    }

    async focusUser(focusData) {
        loadAndValidateFocusUserCommand(focusData)
        const focusRelationRepository = createFocusRelationRepository()
        const focusRelation = await focusRelationRepository.findOne({
            followerID: focusData.followerID,
            focuserID: focusData.focuserID
        })
        if (focusRelation) {
            throwServiceError(constant.STATUS_CODE.HAD_FOCUS)
        }
        const userRepository = createUserRepository()
        let follower = await userRepository.findOne({
            userID: focusData.followerID
        })
        if (_.isNull(follower)) {
            throwServiceError(constant.STATUS_CODE.RES_NO_FIND)
        }
        let focuser = await userRepository.findOne({
            userID: focusData.focuserID
        })
        if (_.isNull(focuser)) {
            throwServiceError(constant.STATUS_CODE.RES_NO_FIND)
        }
        const newFocusRelation = follower.focus(focuser)
        await focusRelationRepository.save(newFocusRelation)
        return {
            ...newFocusRelation
        }
    }

    async cancelFocusUser(focusData) {
        loadAndValidateCancelFocusUserCommand(focusData)
        const focusRelationRepository = createFocusRelationRepository()
        const focusRelation = await focusRelationRepository.findOne({
            followerID: focusData.followerID,
            focuserID: focusData.focuserID
        })
        if (_.isNull(focusRelation)) {
            throwServiceError(constant.STATUS_CODE.FOCUS_RELATION_NO_EXIST)
        }
        await focusRelationRepository.remove(focusRelation)
        return {
            ...focusRelation
        }
    }

    async listFollower(queryOptions) {
        if (_.isUndefined(queryOptions.focuserID)) {
            throwServiceError(constant.STATUS_CODE.ARG_ERROR)
        }
        const focusRelationRepository = createFocusRelationRepository()
        const {count, focusRelations} = await focusRelationRepository.find(queryOptions)
        return {
            count,
            followers: focusRelations.map(focusRelation => {
                return {
                    id: focusRelation.follower.id,
                    name: focusRelation.follower.name,
                    headImg: focusRelation.follower.info.headImg,
                    gender: focusRelation.follower.info.gender
                }
            })
        }
    }

    async listFocuser(queryOptions) {
        if (_.isUndefined(queryOptions.followerID)) {
            throwServiceError(constant.STATUS_CODE.ARG_ERROR)
        }
        const focusRelationRepository = createFocusRelationRepository()
        const {count, focusRelations} = await focusRelationRepository.find(queryOptions)
        return {
            count,
            focusers: focusRelations.map(focusRelation => {
                return {
                    id: focusRelation.focuser.id,
                    name: focusRelation.focuser.name,
                    headImg: focusRelation.focuser.info.headImg,
                    gender: focusRelation.focuser.info.gender
                }
            })
        }
    }
}

module.exports = Service