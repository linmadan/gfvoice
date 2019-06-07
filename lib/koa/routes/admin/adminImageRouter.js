const Router = require('koa-router')
const {
    responseData,
    responseError
} = require('../../../util/tools')

const router = new Router({prefix: '/admin/images'})

router.post('/', async (ctx, next) => {
    try {
        const data = await ctx.imageService.createImage(ctx.request.body)
        responseData(ctx, data)
    } catch (err) {
        responseError(ctx, err)
    }
    next()
})

router.get('/:imageID', async (ctx, next) => {
    try {
        const {imageID} = ctx.params
        const data = await ctx.imageService.getImageByID(imageID)
        responseData(ctx, data)
    } catch (err) {
        responseError(ctx, err)
    }
    next()
})

router.put('/:imageID', async (ctx, next) => {
    try {
        const {imageID} = ctx.params
        const data = await ctx.imageService.updateImage({
            imageID,
            ...ctx.request.body
        })
        responseData(ctx, data)
    } catch (err) {
        responseError(ctx, err)
    }
    next()
})

router.delete('/:imageID', async (ctx, next) => {
    try {
        const {imageID} = ctx.params
        const data = await ctx.imageService.removeImage(imageID)
        responseData(ctx, data)
    } catch (err) {
        responseError(ctx, err)
    }
    next()
})

router.get('/', async (ctx, next) => {
    try {
        const data = await ctx.imageService.getImages(ctx.query)
        responseData(ctx, data)
    } catch (err) {
        responseError(ctx, err)
    }
    next()
})

module.exports = router