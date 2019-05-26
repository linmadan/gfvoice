const _ = require('lodash')
const constant = require('../../util/constant')

class AppUpdateInfo {
    constructor({
                    id = 0,
                    vcode = 0,
                    version = "",
                    channel = "",
                    mustUpdate = 0,
                    appUrl = "",
                    desc = "",
                } = {}) {
        this.id = id
        this.vcode = vcode
        this.version = version
        this.channel = channel
        this.mustUpdate = mustUpdate
        this.appUrl = appUrl
        this.desc = desc
    }

    update(updateData) {
        const {vcode, version, channel, mustUpdate, appUrl, desc} = updateData
        if (!_.isUndefined(vcode)) {
            this.vcode = vcode
        }
        if (!_.isUndefined(version)) {
            this.version = version
        }
        if (!_.isUndefined(channel)) {
            this.channel = channel
        }
        if (!_.isUndefined(mustUpdate)) {
            this.mustUpdate = mustUpdate
        }
        if (!_.isUndefined(appUrl)) {
            this.appUrl = appUrl
        }
        if (!_.isUndefined(desc)) {
            this.desc = desc
        }
    }
}

module.exports = AppUpdateInfo
