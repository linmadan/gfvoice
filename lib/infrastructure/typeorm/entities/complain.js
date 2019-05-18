class Complain {
    constructor({
                    id,
                    type,
                    reason,
                    complainant,
                    target,
                    createTime
                } = {}) {
        this.id = id
        this.type = type
        this.reason = reason
        this.complainant = complainant
        this.target = target
        this.createTime = createTime
    }
}

module.exports = Complain
