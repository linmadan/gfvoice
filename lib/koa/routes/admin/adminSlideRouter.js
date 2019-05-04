const Router = require('koa-router')
const {
    responseData,
    responseError
} = require('../../../util/tools')

const router = new Router({prefix: '/admin/slides'})

router.post('/', async (ctx, next) => {
    try {
        const data = await ctx.slideService.createSlide(ctx.request.body)
        responseData(ctx, data)
    } catch (err) {
        responseError(ctx, err)
    }
    next()
})

router.get('/:slideID', async (ctx, next) => {
    try {
        const {slideID} = ctx.params
        const data = await ctx.slideService.getSlideByID(slideID)
        responseData(ctx, data)
    } catch (err) {
        responseError(ctx, err)
    }
    next()
})

router.put('/:slideID', async (ctx, next) => {
    try {
        const {slideID} = ctx.params
        const data = await ctx.slideService.updateSlide({
            slideID,
            ...ctx.request.body
        })
        responseData(ctx, data)
    } catch (err) {
        responseError(ctx, err)
    }
    next()
})

router.delete('/:slideID', async (ctx, next) => {
    try {
        const {slideID} = ctx.params
        const data = await ctx.slideService.removeSlide(slideID)
        responseData(ctx, data)
    } catch (err) {
        responseError(ctx, err)
    }
    next()
})

router.get('/', async (ctx, next) => {
    try {
        const data = await ctx.slideService.getSlides(ctx.query)
        responseData(ctx, data)
    } catch (err) {
        responseError(ctx, err)
    }
    next()
})

module.exports = router