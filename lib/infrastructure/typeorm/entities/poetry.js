class Poetry {
    constructor({
                    id,
                    name,
                    word,
                    author,
                    accompany,
                    useNum,
                    poetryTypeID,
                } = {}) {
        this.id = id
        this.name = name
        this.word = word
        this.author = author
        this.accompany = accompany
        this.useNum = useNum
        this.poetryTypeID = poetryTypeID
    }
}

module.exports = Poetry
