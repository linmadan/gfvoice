const Router = require('koa-router')
const {
    responseData,
    responseError
} = require('../../util/tools')

const router = new Router({prefix: '/picks'})

router.get('/rank/day', async (ctx, next) => {
    try {
        const data = await ctx.pickRankService.getPickDayRank()
        responseData(ctx, data)
    } catch (err) {
        responseError(ctx, err)
    }
    next()
})

module.exports = router