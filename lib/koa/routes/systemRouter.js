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
    next()
})

module.exports = router