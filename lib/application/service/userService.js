const _ = require('lodash')
const {
    User,
    UserInfo
} = require('../../domain')
const {
    loadAndValidateRegisterUserCommand,
    loadAndValidateUserLoginCommand,
    loadAndValidateUpdateUserCommand,
    loadAndValidateBindPhoneCommand,
    loadAndValidateThirdRegisterAndLoginCommand
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

    async register(userData) {
        loadAndValidateRegisterUserCommand(userData)
        userData.info = new UserInfo(userData)
        const userRepository = createUserRepository()
        const user = await userRepository.save(new User(userData))
        return {
            ...user
        }
    }

    async login(loginData) {
        loadAndValidateUserLoginCommand(loginData)
        const userRepository = createUserRepository()
        let user = await userRepository.findOne({
            phone: loginData.phone
        })
        if (_.isNull(user)) {
            throwServiceError(constant.STATUS_CODE.INVALID_PHONE)
        }
        const focusRelationRepository = createFocusRelationRepository()
        const {focusRelations} = await focusRelationRepository.find({
            followerID: user.id,
            offset: null,
            limit: null
        })
        return {
            user: {...user},
            focusUserIDs: focusRelations.map(focusRelation => {
                return focusRelation.focuser.id
            })
        }
    }

    async thirdRegisterAndLogin(userData) {
        loadAndValidateThirdRegisterAndLoginCommand(userData)
        const userRepository = createUserRepository()
        let user = await userRepository.findOne({
            platID: userData.platID
        })
        if (_.isNull(user)) {
            userData.info = new UserInfo(userData)
            user = await userRepository.save(new User(userData))
        }
        const focusRelationRepository = createFocusRelationRepository()
        const {focusRelations} = await focusRelationRepository.find({
            followerID: user.id,
            offset: null,
            limit: null
        })
        return {
            user: {...user},
            focusUserIDs: focusRelations.map(focusRelation => {
                return focusRelation.focuser.id
            })
        }
    }

    async updateUserInfo(userData) {
        const updateData = loadAndValidateUpdateUserCommand(userData)
        const userRepository = createUserRepository()
        let user = await userRepository.findOne({
            userID: updateData.userID
        })
        if (_.isNull(user)) {
            throwServiceError(constant.STATUS_CODE.RES_NO_FIND)
        }
        const userInfoData = {
            ...user.info,
            ...updateData
        }
        updateData.info = new UserInfo(userInfoData)
        user.update(updateData)
        await userRepository.save(user)
        return {
            ...user
        }
    }

    async bindPhone(bindData) {
        loadAndValidateBindPhoneCommand(bindData)
        const userRepository = createUserRepository()
        let user = await userRepository.findOne({
            userID: bindData.userID
        })
        if (_.isNull(user)) {
            throwServiceError(constant.STATUS_CODE.RES_NO_FIND)
        }
        user.bindThePhone(bindData.bindPhone)
        await userRepository.save(user)
        return {
            ...user
        }
    }

    async getUserStatisticTotal(userID) {
        if (_.isUndefined(userID)) {
            throwServiceError(constant.STATUS_CODE.ARG_ERROR)
        }
        const userRepository = createUserRepository()
        const user = await userRepository.findOne({
            userID: userID
        })
        if (_.isNull(user)) {
            throwServiceError(constant.STATUS_CODE.RES_NO_FIND)
        }
        const focusRelationRepository = createFocusRelationRepository()
        const {count: followerTotal} = await focusRelationRepository.find({
            focuserID: userID
        })
        const {count: focuserTotal} = await focusRelationRepository.find({
            followerID: userID
        })
        return {
            pickTotal: user.pick,
            followerTotal,
            focuserTotal
        }
    }

    async getUserHomePageData(userID) {
        if (_.isUndefined(userID)) {
            throwServiceError(constant.STATUS_CODE.ARG_ERROR)
        }
        const userRepository = createUserRepository()
        const user = await userRepository.findOne({
            userID: userID
        })
        if (_.isNull(user)) {
            throwServiceError(constant.STATUS_CODE.RES_NO_FIND)
        }
        const focusRelationRepository = createFocusRelationRepository()
        const {count: followerTotal} = await focusRelationRepository.find({
            focuserID: userID
        })
        const {count: focuserTotal} = await focusRelationRepository.find({
            followerID: userID
        })
        return {
            user: {...user},
            followerTotal,
            focuserTotal
        }
    }

    //
    // async removeUser(userID) {
    //     loadAndValidateRemoveUserCommand({userID})
    //     const userRepository = createUserRepository()
    //     let user = await userRepository.findOne({userID})
    //     if (_.isNull(user)) {
    //         throwServiceError(constant.STATUS_CODE.RES_NO_FIND)
    //     }
    //     await userRepository.remove(user)
    //     return {
    //         ...user
    //     }
    // }
    //
    // async getUsers(queryOptions) {
    //     const userRepository = createUserRepository()
    //     const {users, count} = await userRepository.find(queryOptions)
    //     return {
    //         count,
    //         users: users.map(user => {
    //             return {...user}
    //         })
    //     }
    // }
}

module.exports = Service