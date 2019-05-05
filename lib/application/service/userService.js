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
    loadAndValidateFocusUserCommand
} = require('../command')
const {
    createUserRepository
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
        return {
            user: {...user},
            focusUserIDs: []
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
        let bindUser = await userRepository.findOne({
            bindPhone: bindData.bindPhone
        })
        if (bindUser && bindUser.id != user.id) {
            throwServiceError(constant.STATUS_CODE.PHONE_HAD_BIND)
        }
        user.bindThePhone(bindData.bindPhone)
        await userRepository.save(user)
        return {
            ...user
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