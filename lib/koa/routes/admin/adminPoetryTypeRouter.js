const Router = require('koa-router')
const {
    responseData,
    responseError
} = require('../../../util/tools')

const router = new Router({prefix: '/admin/poetry-types'})

router.post('/', async (ctx, next) => {
    try {
        const data = await ctx.poetryTypeService.createPoetryType(ctx.request.body)
        responseData(ctx, data)
    }
    catch (err) {
        responseError(ctx, err)
    }
    next()
})

router.get('/:poetryTypeID', async (ctx, next) => {
    try {
        const {poetryTypeID} = ctx.params
        const data = await ctx.poetryTypeService.getPoetryTypeByID(poetryTypeID)
        responseData(ctx, data)
    }
    catch (err) {
        responseError(ctx, err)
    }
    next()
})

router.put('/:poetryTypeID', async (ctx, next) => {
    try {
        const {poetryTypeID} = ctx.params
        const data = await ctx.poetryTypeService.updatePoetryType({
            poetryTypeID,
            ...ctx.request.body
        })
        responseData(ctx, data)
    }
    catch (err) {
        responseError(ctx, err)
    }
    next()
})

router.delete('/:poetryTypeID', async (ctx, next) => {
    try {
        const {poetryTypeID} = ctx.params
        const data = await ctx.poetryTypeService.removePoetryType(poetryTypeID)
        responseData(ctx, data)
    }
    catch (err) {
        responseError(ctx, err)
    }
    next()
})

router.get('/', async (ctx, next) => {
    try {
        const data = await ctx.poetryTypeService.getPoetryTypes(ctx.query)
        responseData(ctx, data)
    }
    catch (err) {
        responseError(ctx, err)
    }
    next()
})

module.exports = router