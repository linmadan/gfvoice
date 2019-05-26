class AppUpdateInfo {
    constructor({
                    id,
                    vcode,
                    version,
                    channel,
                    mustUpdate,
                    appUrl,
                    desc,
                } = {}) {
        this.id = id
        this.vcode = vcode
        this.version = version
        this.channel = channel
        this.mustUpdate = mustUpdate
        this.appUrl = appUrl
        this.desc = desc
    }
}

module.exports = AppUpdateInfo
