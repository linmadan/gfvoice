const _ = require('lodash')
const {
    getRepository
} = require('typeorm')
const {
    transformToDomainModel,
    transformToEntity
} = require('../typeorm/transform')
const FeedbackEntity = require('../typeorm/entities/feedback')
const Feedback = require('../../domain/system/feedback')
const constant = require('../../util/constant')

class Repository {
    constructor({
                    transactionContext = null
                } = {}) {
        this._transactionManager = _.isNull(transactionContext) ? null : transactionContext.queryRunner.manager
    }

    async save(feedback) {
        const feedbackEntity = transformToEntity(feedback, "feedback", FeedbackEntity)
        if (_.isNull(this._transactionManager)) {
            const feedbackRepository = getRepository("Feedback")
            await feedbackRepository.save(feedbackEntity)
        }
        else {
            await this._transactionManager.save(feedbackEntity)
        }
        if (feedback.id) {
            return feedback
        }
        else {
            feedback.id = feedbackEntity.id
        }
        return feedback
    }

    async remove(feedback) {
        const feedbackEntity = transformToEntity(feedback, "feedback", FeedbackEntity)
        if (_.isNull(this._transactionManager)) {
            const feedbackRepository = getRepository("Feedback")
            await feedbackRepository.remove(feedbackEntity)
        }
        else {
            await this._transactionManager.remove(feedbackEntity)
        }
    }

    async findOne(queryOptions) {
        let queryBuilder
        if (_.isNull(this._transactionManager)) {
            queryBuilder = getRepository("Feedback").createQueryBuilder("feedback")
        }
        else {
            queryBuilder = this._transactionManager.createQueryBuilder("Feedback", "feedback")
        }
        queryBuilder.leftJoinAndMapOne("feedback.user", "users", "user", "user.id = feedback.userID")
        const {
            feedbackID
        } = queryOptions
        if (feedbackID) {
            queryBuilder.where(`feedback.id = :feedbackID`, {feedbackID})
        }
        const feedbackEntity = await queryBuilder.getOne()
        if (feedbackEntity) {
            return transformToDomainModel(feedbackEntity, "feedback", Feedback)
        }
        else {
            return null
        }
    }

    async find(queryOptions) {
        let queryBuilder
        if (_.isNull(this._transactionManager)) {
            queryBuilder = getRepository("Feedback").createQueryBuilder("feedback")
        }
        else {
            queryBuilder = this._transactionManager.createQueryBuilder("Feedback", "feedback")
        }
        queryBuilder.leftJoinAndMapOne("feedback.user", "users", "user", "user.id = feedback.userID")
        const {
            offset,
            limit
        } = queryOptions
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
            .orderBy("feedback.id", "DESC")
        const [feedbackEntitys, count] = await queryBuilder.getManyAndCount()
        return {
            feedbacks: feedbackEntitys.map(feedbackEntity => transformToDomainModel(feedbackEntity, "feedback", Feedback)),
            count
        }
    }
}

function createRepository(options) {
    return new Repository(options)
}

module.exports = createRepository
