const _ = require('lodash')
const {
    getRepository
} = require('typeorm')
const {
    transformToDomainModel,
    transformToEntity
} = require('../typeorm/transform')
const ReplyEntity = require('../typeorm/entities/reply')
const Reply = require('../../domain/reply')
const constant = require('../../util/constant')

class Repository {
    constructor({
                    transactionContext = null
                } = {}) {
        this._transactionManager = _.isNull(transactionContext) ? null : transactionContext.queryRunner.manager
    }

    async save(reply) {
        const replyEntity = transformToEntity(reply, "reply", ReplyEntity)
        if (_.isNull(this._transactionManager)) {
            const replyRepository = getRepository("Reply")
            await replyRepository.save(replyEntity)
        }
        else {
            await this._transactionManager.save(replyEntity)
        }
        if (reply.id) {
            return reply
        }
        else {
            reply.id = replyEntity.id
        }
        return reply
    }

    async remove(reply) {
        const replyEntity = transformToEntity(reply, "reply", ReplyEntity)
        if (_.isNull(this._transactionManager)) {
            const replyRepository = getRepository("Reply")
            await replyRepository.remove(replyEntity)
        }
        else {
            await this._transactionManager.remove(replyEntity)
        }
    }

    async findOne(queryOptions) {
        let queryBuilder
        if (_.isNull(this._transactionManager)) {
            queryBuilder = getRepository("Reply").createQueryBuilder("reply")
        }
        else {
            queryBuilder = this._transactionManager.createQueryBuilder("Reply", "reply")
        }
        queryBuilder.leftJoinAndMapOne("reply.user", "users", "user", "user.id = reply.userID")
            .leftJoinAndMapOne("reply.comment", "comments", "comment", "comment.id = reply.commentID")
            .leftJoinAndMapOne("comment.poetryVoice", "poetryVoices", "poetryVoice", "poetryVoice.id = comment.poetryVoiceID")
        const {
            replyID
        } = queryOptions
        if (replyID) {
            queryBuilder.where(`reply.id = :replyID`, {replyID})
        }
        const replyEntity = await queryBuilder.getOne()
        if (replyEntity) {
            return transformToDomainModel(replyEntity, "reply", Reply)
        }
        else {
            return null
        }
    }

    async find(queryOptions) {
        let queryBuilder
        if (_.isNull(this._transactionManager)) {
            queryBuilder = getRepository("Reply").createQueryBuilder("reply")
        }
        else {
            queryBuilder = this._transactionManager.createQueryBuilder("Reply", "reply")
        }
        queryBuilder.leftJoinAndMapOne("reply.user", "users", "user", "user.id = reply.userID")
            .leftJoinAndMapOne("reply.comment", "comments", "comment", "comment.id = reply.commentID")
            .leftJoinAndMapOne("comment.poetryVoice", "poetryVoices", "poetryVoice", "poetryVoice.id = comment.poetryVoiceID")
        const {
            userID,
            commentID,
            offset,
            limit
        } = queryOptions
        if (userID) {
            queryBuilder.andWhere(`reply.userID = :userID`, {userID})
        }
        if (commentID) {
            queryBuilder.andWhere(`reply.commentID = :commentID`, {commentID})
        }
        if (_.isUndefined(offset)) {
            queryBuilder.skip(0)
        }
        else {
            if (_.isInteger(offset)) {
                queryBuilder.skip(offset)
            }
        }
        if (_.isUndefined(limit)) {
            queryBuilder.take(20)
        }
        else {
            if (_.isInteger(limit) && limit != 0) {
                queryBuilder.take(limit)
            }
        }
        queryBuilder
            .orderBy("reply.id", "DESC")
        const [replyEntitys, count] = await queryBuilder.getManyAndCount()
        return {
            replys: replyEntitys.map(replyEntity => transformToDomainModel(replyEntity, "reply", Reply)),
            count
        }
    }
}

function createRepository(options) {
    return new Repository(options)
}

module.exports = createRepository
