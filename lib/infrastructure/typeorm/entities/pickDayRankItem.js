class PickDayRankItem {
    constructor({
                    id,
                    userID,
                    pick,
                    day,
                } = {}) {
        this.id = id
        this.userID = userID
        this.pick = pick
        this.day = day
    }
}

module.exports = PickDayRankItem
