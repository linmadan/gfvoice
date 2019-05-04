class Slide {
    constructor({
                    id,
                    type,
                    param,
                    tag,
                    pic,
                } = {}) {
        this.id = id
        this.type = type
        this.param = param
        this.tag = tag
        this.pic = pic
    }
}

module.exports = Slide
