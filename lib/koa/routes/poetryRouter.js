const Router = require('koa-router')
const {
    responseData,
    responseError
} = require('../../util/tools')

const router = new Router({prefix: '/poetries'})

router.get('/types', async (ctx, next) => {
    try {
        const data = await ctx.poetryTypeService.getPoetryTypes(ctx.query)
        responseData(ctx, data)
    } catch (err) {
        responseError(ctx, err)
    }
    next()
})

router.get('/', async (ctx, next) => {
    try {
        const data = await ctx.poetryService.getPoetries(ctx.query)
        responseData(ctx, data)
    } catch (err) {
        responseError(ctx, err)
    }
    next()
})

module.exports = router