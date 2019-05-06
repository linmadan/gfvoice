const Router = require('koa-router')
const {
    responseData,
    responseError
} = require('../../../util/tools')

const router = new Router({prefix: '/admin/poetries'})

router.post('/', async (ctx, next) => {
    try {
        const data = await ctx.poetryService.createPoetry(ctx.request.body)
        responseData(ctx, data)
    } catch (err) {
        responseError(ctx, err)
    }
    next()
})

router.get('/:poetryID', async (ctx, next) => {
    try {
        const {poetryID} = ctx.params
        const data = await ctx.poetryService.getPoetryByID(poetryID)
        responseData(ctx, data)
    } catch (err) {
        responseError(ctx, err)
    }
    next()
})

router.put('/:poetryID', async (ctx, next) => {
    try {
        const {poetryID} = ctx.params
        const data = await ctx.poetryService.updatePoetry({
            poetryID,
            ...ctx.request.body
        })
        responseData(ctx, data)
    } catch (err) {
        responseError(ctx, err)
    }
    next()
})

router.delete('/:poetryID', async (ctx, next) => {
    try {
        const {poetryID} = ctx.params
        const data = await ctx.poetryService.removePoetry(poetryID)
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