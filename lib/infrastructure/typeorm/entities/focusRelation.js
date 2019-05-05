class FocusRelation {
    constructor({
                    id,
                    followerID,
                    focuserID,
                    time,
                } = {}) {
        this.id = id
        this.followerID = followerID
        this.focuserID = focuserID
        this.time = time
    }
}

module.exports = FocusRelation
