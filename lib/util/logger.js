const {Logger} = require("./log")
const options = {
    serviceName: "gfvoice",
    logType: "console",
    contextKeys: [],
}
const logger = new Logger(options)
logger.setLevel(process.env.LOG_LEVEL ? process.env.LOG_LEVEL : "debug")

module.exports = logger