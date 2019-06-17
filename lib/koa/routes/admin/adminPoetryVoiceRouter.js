const Router = require('koa-router')
const {
    responseData,
    responseError
} = require('../../../util/tools')

const router = new Router({prefix: '/admin/poetry-voices'})

router.get('/:poetryVoiceID', async (ctx, next) => {
    try {
        const {poetryVoiceID} = ctx.params
        const data = await ctx.poetryVoiceService.getPoetryVoiceByID(poetryVoiceID)
        responseData(ctx, data)
    } catch (err) {
        responseError(ctx, err)
    }
    next()
})

router.post('/:poetryVoiceID/set-status', async (ctx, next) => {
    try {
        const {poetryVoiceID} = ctx.params
        const data = await ctx.poetryVoiceService.setPoetryVoiceStatus({
            poetryVoiceID,
            ...ctx.request.body
        })
        responseData(ctx, data)
    } catch (err) {
        responseError(ctx, err)
    }
    next()
})

router.delete('/:poetryVoiceID', async (ctx, next) => {
    try {
        const {poetryVoiceID} = ctx.params
        const data = await ctx.poetryVoiceService.removePoetryVoice(poetryVoiceID)
        responseData(ctx, data)
    } catch (err) {
        responseError(ctx, err)
    }
    next()
})

router.get('/', async (ctx, next) => {
    try {
        const data = await ctx.poetryVoiceService.getPoetryVoices(ctx.query)
        responseData(ctx, data)
    } catch (err) {
        responseError(ctx, err)
    }
    next()
})

module.exports = router