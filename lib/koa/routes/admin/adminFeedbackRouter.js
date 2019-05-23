const Router = require('koa-router')
const {
    responseData,
    responseError
} = require('../../../util/tools')

const router = new Router({prefix: '/admin/feedbacks'})

router.get('/:feedbackID', async (ctx, next) => {
    try {
        const {feedbackID} = ctx.params
        const data = await ctx.feedbackService.getFeedbackByID(feedbackID)
        responseData(ctx, data)
    } catch (err) {
        responseError(ctx, err)
    }
    next()
})

router.get('/', async (ctx, next) => {
    try {
        const data = await ctx.feedbackService.getFeedbacks(ctx.query)
        responseData(ctx, data)
    } catch (err) {
        responseError(ctx, err)
    }
    next()
})

module.exports = router