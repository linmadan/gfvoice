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

router.post('/:poetryVoiceID/pick', async (ctx, next) => {
    try {
        const {poetryVoiceID} = ctx.params
        const data = await ctx.poetryVoiceService.pickPoetryVoice({
            poetryVoiceID,
            ...ctx.request.body
        })
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

router.post('/:poetryVoiceID/complain', async (ctx, next) => {
    try {
        const {poetryVoiceID} = ctx.params
        const data = await ctx.complainService.submitComplain({
            targetID: poetryVoiceID,
            type: 2,
            ...ctx.request.body
        })
        responseData(ctx, data)
    } catch (err) {
        responseError(ctx, err)
    }
    next()
})

router.post('/:poetryVoiceID/comment', async (ctx, next) => {
    try {
        const {poetryVoiceID} = ctx.params
        const data = await ctx.poetryVoiceService.commentPoetryVoice({
            poetryVoiceID,
            ...ctx.request.body
        })
        responseData(ctx, data)
    } catch (err) {
        responseError(ctx, err)
    }
    next()
})

router.post('/:poetryVoiceID/comments/:commentID/reply', async (ctx, next) => {
    try {
        const {commentID} = ctx.params
        const data = await ctx.poetryVoiceService.replyComment({
            commentID,
            ...ctx.request.body
        })
        responseData(ctx, data)
    } catch (err) {
        responseError(ctx, err)
    }
    next()
})

router.get('/:poetryVoiceID/comments', async (ctx, next) => {
    try {
        const {poetryVoiceID} = ctx.params
        const data = await ctx.poetryVoiceService.listPoetryVoiceComment({
            poetryVoiceID,
            ...ctx.query
        })
        responseData(ctx, data)
    } catch (err) {
        responseError(ctx, err)
    }
    next()
})

module.exports = router