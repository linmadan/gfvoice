class User {
    constructor({
                    id,
                    name,
                    phone,
                    registerType,
                    platID,
                    openID,
                    bindPhone,
                    pick,
                    gender,
                    location,
                    birthday,
                    headImg,
                    pics
                } = {}) {
        this.id = id
        this.name = name
        this.phone = phone
        this.registerType = registerType
        this.platID = platID
        this.openID = openID
        this.bindPhone = bindPhone
        this.pick = pick
        this.gender = gender
        this.location = location
        this.birthday = birthday
        this.headImg = headImg
        this.pics = pics
    }
}

module.exports = User
