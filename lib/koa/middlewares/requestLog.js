module.exports = (options) => {
    return async (ctx, next) => {
        ctx.logger.info(`${ctx.request.method} ${ctx.request.originalUrl}`)
        if (ctx.is('application/json')) {
            ctx.logger.debug(`${ctx.request.method} ${ctx.request.originalUrl} 数据输入：${JSON.stringify(ctx.request.body)}`)
        }
        await next()
        if (ctx.response.is('application/json')) {
            if (ctx.response.body.code == 0) {
                ctx.logger.debug(`${ctx.request.method} ${ctx.request.originalUrl} 数据输出：${JSON.stringify(ctx.response.body)}`)
            }
            else {
                ctx.logger.error(`${ctx.request.method} ${ctx.request.originalUrl} 数据输出：${JSON.stringify(ctx.response.body)}`)
            }
        }
    }
}
