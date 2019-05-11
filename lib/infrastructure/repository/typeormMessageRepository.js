const _ = require('lodash')
const {
    getRepository
} = require('typeorm')
const {
    transformToDomainModel,
    transformToEntity
} = require('../typeorm/transform')
const MessageEntity = require('../typeorm/entities/message')
const Message = require('../../domain/message')
const constant = require('../../util/constant')

class Repository {
    constructor({
                    transactionContext = null
                } = {}) {
        this._transactionManager = _.isNull(transactionContext) ? null : transactionContext.queryRunner.manager
    }

    async save(message) {
        const messageEntity = transformToEntity(message, "message", MessageEntity)
        if (_.isNull(this._transactionManager)) {
            const messageRepository = getRepository("Message")
            await messageRepository.save(messageEntity)
        }
        else {
            await this._transactionManager.save(messageEntity)
        }
        if (message.id) {
            return message
        }
        else {
            message.id = messageEntity.id
        }
        return message
    }

    async remove(message) {
        const messageEntity = transformToEntity(message, "message", MessageEntity)
        if (_.isNull(this._transactionManager)) {
            const messageRepository = getRepository("Message")
            await messageRepository.remove(messageEntity)
        }
        else {
            await this._transactionManager.remove(messageEntity)
        }
    }

    async findOne(queryOptions) {
        const queryBuilder = getRepository("Message").createQueryBuilder("message")
            .leftJoinAndMapOne("message.toUser", "users", "user", "user.id = message.toUserID")
        const {
            messageID
        } = queryOptions
        if (messageID) {
            queryBuilder.where(`message.id = :messageID`, {messageID})
        }
        const messageEntity = await queryBuilder.getOne()
        if (messageEntity) {
            return transformToDomainModel(messageEntity, "message", Message)
        }
        else {
            return null
        }
    }

    async find(queryOptions) {
        const queryBuilder = getRepository("Message").createQueryBuilder("message")
            .leftJoinAndMapOne("message.toUser", "users", "user", "user.id = message.toUserID")
        const {
            toUserID,
            offset,
            limit
        } = queryOptions
        if (toUserID) {
            queryBuilder.where(`message.toUserID = :toUserID`, {toUserID})
        }
        if (_.isUndefined(offset)) {
            queryBuilder.skip(0)
        }
        else {
            if (!_.isNull(offset)) {
                queryBuilder.skip(offset)
            }
        }
        if (_.isUndefined(limit)) {
            queryBuilder.take(20)
        }
        else {
            if (!_.isNull(limit)) {
                queryBuilder.take(limit)
            }
        }
        queryBuilder
            .orderBy("message.id", "DESC")
        const [messageEntitys, count] = await queryBuilder.getManyAndCount()
        return {
            messages: messageEntitys.map(messageEntity => transformToDomainModel(messageEntity, "message", Message)),
            count
        }
    }
}

function createRepository(options) {
    return new Repository(options)
}

module.exports = createRepository
