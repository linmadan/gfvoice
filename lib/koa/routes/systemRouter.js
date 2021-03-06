const Router = require('koa-router')
const {
    responseData,
    responseError
} = require('../../util/tools')

const router = new Router({prefix: '/system'})

router.get('/entry-data', async (ctx, next) => {
    try {
        const data = await ctx.systemService.getEntryData()
        responseData(ctx, data)
    } catch (err) {
        responseError(ctx, err)
    }
    await next()
})

router.get('/users/:userID/messages', async (ctx, next) => {
    try {
        const {userID} = ctx.params
        const data = await ctx.systemService.getSystemMessage({
            toUserID: userID,
            ...ctx.query
        })
        responseData(ctx, data)
    } catch (err) {
        responseError(ctx, err)
    }
    await next()
})

router.get('/hot-words', async (ctx, next) => {
    try {
        const data = await ctx.systemService.listHotWord()
        responseData(ctx, data)
    } catch (err) {
        responseError(ctx, err)
    }
    await next()
})

router.post('/feedback', async (ctx, next) => {
    try {
        const data = await ctx.systemService.submitFeedback({
            ...ctx.request.body
        })
        responseData(ctx, data)
    } catch (err) {
        responseError(ctx, err)
    }
    next()
})

router.post('/check-app-update', async (ctx, next) => {
    try {
        const data = await ctx.systemService.checkAppUpdate({
            ...ctx.request.body
        })
        responseData(ctx, data)
    } catch (err) {
        responseError(ctx, err)
    }
    next()
})

module.exports = router