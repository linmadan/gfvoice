const _ = require('lodash')

function transformToDomainModel(typeormEntity, rule, domainModelClass) {
    let domainModel = new domainModelClass()
    for (let entityAttribute of _.keys(rule)) {
        if (_.has(domainModel, rule[entityAttribute].path)) {
            _.set(domainModel, rule[entityAttribute].path, typeormEntity[entityAttribute])
        }
    }
    return domainModel
}

function transformToEntity(domainModel, rule, typeormEntityClass) {
    let typeormEntity = new typeormEntityClass()
    for (let entityAttribute of _.keys(rule)) {
        if (_.has(domainModel, rule[entityAttribute].path)) {
            typeormEntity[entityAttribute] = _.get(domainModel, rule[entityAttribute].path)
        }
    }
    return typeormEntity
}

module.exports = {
    transformToDomainModel,
    transformToEntity
}