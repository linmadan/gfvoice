const _ = require('lodash')
const {
    getRepository
} = require('typeorm')
const {
    transformToDomainModel,
    transformToEntity
} = require('../typeorm/transform')
const FocusRelationEntity = require('../typeorm/entities/focusRelation')
const FocusRelation = require('../../domain/focusRelation')
const constant = require('../../util/constant')

class Repository {
    constructor({
                    transactionContext = null
                } = {}) {
        this._transactionManager = _.isNull(transactionContext) ? null : transactionContext.queryRunner.manager
    }

    async save(focusRelation) {
        const focusRelationEntity = transformToEntity(focusRelation, "focusRelation", FocusRelationEntity)
        if (_.isNull(this._transactionManager)) {
            const focusRelationRepository = getRepository("FocusRelation")
            await focusRelationRepository.save(focusRelationEntity)
        }
        else {
            await this._transactionManager.save(focusRelationEntity)
        }
        if (focusRelation.id) {
            return focusRelation
        }
        else {
            focusRelation.id = focusRelationEntity.id
        }
        return focusRelation
    }

    async remove(focusRelation) {
        const focusRelationEntity = transformToEntity(focusRelation, "focusRelation", FocusRelationEntity)
        if (_.isNull(this._transactionManager)) {
            const focusRelationRepository = getRepository("FocusRelation")
            await focusRelationRepository.remove(focusRelationEntity)
        }
        else {
            await this._transactionManager.remove(focusRelationEntity)
        }
    }

    async findOne(queryOptions) {
        const queryBuilder = getRepository("FocusRelation").createQueryBuilder("focusRelation")
            .leftJoinAndMapOne("focusRelation.follower", "users", "follower", "follower.id = focusRelation.followerID")
            .leftJoinAndMapOne("focusRelation.focuser", "users", "focuser", "focuser.id = focusRelation.focuserID")
        const {
            focusRelationID,
            followerID,
            focuserID
        } = queryOptions
        if (focusRelationID) {
            queryBuilder.where(`focusRelation.id = :focusRelationID`, {focusRelationID})
        }
        if (followerID && focuserID) {
            queryBuilder.where(`focusRelation.followerID = :followerID`, {followerID})
                .andWhere(`focusRelation.focuserID = :focuserID`, {focuserID})
        }
        const focusRelationEntity = await queryBuilder.getOne()
        if (focusRelationEntity) {
            return transformToDomainModel(focusRelationEntity, "focusRelation", FocusRelation)
        }
        else {
            return null
        }
    }

    async find(queryOptions) {
        const queryBuilder = getRepository("FocusRelation").createQueryBuilder("focusRelation")
            .leftJoinAndMapOne("focusRelation.follower", "users", "follower", "follower.id = focusRelation.followerID")
            .leftJoinAndMapOne("focusRelation.focuser", "users", "focuser", "focuser.id = focusRelation.focuserID")
        const {
            followerID,
            focuserID,
            offset,
            limit
        } = queryOptions
        if (followerID) {
            queryBuilder.andWhere(`focusRelation.followerID = :followerID`, {followerID})
        }
        if (focuserID) {
            queryBuilder.andWhere(`focusRelation.focuserID = :focuserID`, {focuserID})
        }
        if (_.isUndefined(offset)) {
            queryBuilder.skip(0)
        } else {
            queryBuilder.skip(offset)
        }
        if (_.isUndefined(limit)) {
            queryBuilder.take(20)
        } else {
            if (limit != 0) {
                queryBuilder.take(limit)
            }
        }
        queryBuilder
            .orderBy("focusRelation.id", "DESC")
        const [focusRelationEntitys, count] = await queryBuilder.getManyAndCount()
        return {
            focusRelations: focusRelationEntitys.map(focusRelationEntity => transformToDomainModel(focusRelationEntity, "focusRelation", FocusRelation)),
            count
        }
    }
}

function createRepository(options) {
    return new Repository(options)
}

module.exports = createRepository
