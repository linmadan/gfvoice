const _ = require('lodash')
const {
    getRepository
} = require('typeorm')
const {
    transformToDomainModel,
    transformToEntity
} = require('../typeorm/transform')
const CommentEntity = require('../typeorm/entities/comment')
const Comment = require('../../domain/comment')
const constant = require('../../util/constant')

class Repository {
    constructor({
                    transactionContext = null
                } = {}) {
        this._transactionManager = _.isNull(transactionContext) ? null : transactionContext.queryRunner.manager
    }

    async save(comment) {
        const commentEntity = transformToEntity(comment, "comment", CommentEntity)
        if (_.isNull(this._transactionManager)) {
            const commentRepository = getRepository("Comment")
            await commentRepository.save(commentEntity)
        }
        else {
            await this._transactionManager.save(commentEntity)
        }
        if (comment.id) {
            return comment
        }
        else {
            comment.id = commentEntity.id
        }
        return comment
    }

    async remove(comment) {
        const commentEntity = transformToEntity(comment, "comment", CommentEntity)
        if (_.isNull(this._transactionManager)) {
            const commentRepository = getRepository("Comment")
            await commentRepository.remove(commentEntity)
        }
        else {
            await this._transactionManager.remove(commentEntity)
        }
    }

    async findOne(queryOptions) {
        const queryBuilder = getRepository("Comment").createQueryBuilder("comment")
            .leftJoinAndMapOne("comment.user", "users", "user", "user.id = comment.userID")
            .leftJoinAndMapOne("comment.poetryVoice", "poetryVoices", "poetryVoice", "poetryVoice.id = comment.poetryVoiceID")
            .leftJoinAndMapOne("poetryVoice.user", "users", "poetryVoiceUser", "poetryVoiceUser.id = poetryVoice.userID")
            .leftJoinAndMapMany("comment.replies", "replies", "reply", "reply.commentID = comment.id")
            .leftJoinAndMapOne("reply.user", "users", "replyUser", "replyUser.id = reply.userID")
        const {
            commentID
        } = queryOptions
        if (commentID) {
            queryBuilder.where(`comment.id = :commentID`, {commentID})
        }
        const commentEntity = await queryBuilder.getOne()
        if (commentEntity) {
            return transformToDomainModel(commentEntity, "comment", Comment)
        }
        else {
            return null
        }
    }

    async find(queryOptions) {
        const queryBuilder = getRepository("Comment").createQueryBuilder("comment")
            .leftJoinAndMapOne("comment.user", "users", "user", "user.id = comment.userID")
            .leftJoinAndMapOne("comment.poetryVoice", "poetryVoices", "poetryVoice", "poetryVoice.id = comment.poetryVoiceID")
            .leftJoinAndMapOne("poetryVoice.user", "users", "poetryVoiceUser", "poetryVoiceUser.id = poetryVoice.userID")
            .leftJoinAndMapMany("comment.replies", "replies", "reply", "reply.commentID = comment.id")
            .leftJoinAndMapOne("reply.user", "users", "replyUser", "replyUser.id = reply.userID")
        const {
            userID,
            poetryVoiceID,
            offset,
            limit
        } = queryOptions
        if (userID) {
            queryBuilder.andWhere(`comment.userID = :userID`, {userID})
        }
        if (poetryVoiceID) {
            queryBuilder.andWhere(`comment.poetryVoiceID = :poetryVoiceID`, {poetryVoiceID})
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
            .orderBy("comment.id", "DESC")
        const [commentEntitys, count] = await queryBuilder.getManyAndCount()
        return {
            comments: commentEntitys.map(commentEntity => transformToDomainModel(commentEntity, "comment", Comment)),
            count
        }
    }
}

function createRepository(options) {
    return new Repository(options)
}

module.exports = createRepository
