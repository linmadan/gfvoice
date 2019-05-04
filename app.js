const http = require('http')
const app = require('./lib/koa')
const logger = require('./lib/util/logger')
const {
    createDBConnection
} = require('./lib/infrastructure')

process.on('unhandledRejection', err => {
    logger.error(`unhandledRejection message: ${err.message}`)
    logger.error(`unhandledRejection stack: ${err.stack}`)
})
createDBConnection().connect().then(async () => {
    logger.info("database is connected")
    const PORT = process.env.PORT || 3000
    http.createServer(app.callback()).listen(PORT, (err) => {
        if (err) {
            logger.error(`server is fail: ${err.message}`)
        }
        logger.info("server is start")
    })
})
