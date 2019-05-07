const Router = require('koa-router')
const {
    responseData,
    responseError
} = require('../../util/tools')

const router = new Router({prefix: '/poetry-voices'})

router.post('/submit', async (ctx, next) => {
    try {
        const data = await ctx.poetryVoiceService.submitPoetryVoice(ctx.request.body)
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