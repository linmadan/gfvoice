const Router = require('koa-router')
const {
    responseData,
    responseError
} = require('../../util/tools')

const router = new Router({prefix: '/users'})

router.post('/register', async (ctx, next) => {
    try {
        const data = await ctx.userService.register(ctx.request.body)
        responseData(ctx, data)
    } catch (err) {
        responseError(ctx, err)
    }
    next()
})

router.post('/login', async (ctx, next) => {
    try {
        const data = await ctx.userService.login(ctx.request.body)
        responseData(ctx, data)
    } catch (err) {
        responseError(ctx, err)
    }
    next()
})

router.post('/:userID/update-info', async (ctx, next) => {
    try {
        const {userID} = ctx.params
        const data = await ctx.userService.updateUserInfo({
            userID,
            ...ctx.request.body
        })
        responseData(ctx, data)
    } catch (err) {
        responseError(ctx, err)
    }
    next()
})

router.post('/:userID/bind-phone', async (ctx, next) => {
    try {
        const {userID} = ctx.params
        const data = await ctx.userService.bindPhone({
            userID,
            ...ctx.request.body
        })
        responseData(ctx, data)
    } catch (err) {
        responseError(ctx, err)
    }
    next()
})

module.exports = router