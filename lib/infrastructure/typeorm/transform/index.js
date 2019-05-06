const _ = require('lodash')
const rules = require('./rule')

function transformToDomainModel(typeormEntity, ruleName, domainModelClass) {
    const domainModel = new domainModelClass()
    if(_.isNull(typeormEntity)){
        return domainModel
    }
    const rule = rules[ruleName]
    for (let entityAttribute of _.keys(rule)) {
        if (_.has(domainModel, rule[entityAttribute].path)) {
            if (!_.isUndefined(rule[entityAttribute].appendType) && !_.isUndefined(typeormEntity[entityAttribute])) {
                if (_.isArray(typeormEntity[entityAttribute])) {
                    domainModel[entityAttribute] = []
                    for (let appendType of typeormEntity[entityAttribute]) {
                        domainModel[entityAttribute].push(transformToDomainModel(appendType, rule[entityAttribute].rule, rule[entityAttribute].appendType))
                    }
                } else {
                    domainModel[entityAttribute] = transformToDomainModel(typeormEntity[entityAttribute], rule[entityAttribute].rule, rule[entityAttribute].appendType)
                }
            } else {
                _.set(domainModel, rule[entityAttribute].path, typeormEntity[entityAttribute])
            }
        }
    }
    return domainModel
}

function transformToEntity(domainModel, ruleName, typeormEntityClass) {
    const rule = rules[ruleName]
    const typeormEntity = new typeormEntityClass()
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