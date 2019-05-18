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

router.post('/third-login', async (ctx, next) => {
    try {
        const data = await ctx.userService.thirdRegisterAndLogin(ctx.request.body)
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

router.post('/:userID/focus', async (ctx, next) => {
    try {
        const {userID} = ctx.params
        const data = await ctx.focusService.focusUser({
            followerID: userID,
            ...ctx.request.body
        })
        responseData(ctx, data)
    } catch (err) {
        responseError(ctx, err)
    }
    next()
})

router.post('/:userID/cancel-focus', async (ctx, next) => {
    try {
        const {userID} = ctx.params
        const data = await ctx.focusService.cancelFocusUser({
            followerID: userID,
            ...ctx.request.body
        })
        responseData(ctx, data)
    } catch (err) {
        responseError(ctx, err)
    }
    next()
})

router.get('/:userID/followers', async (ctx, next) => {
    try {
        const {userID} = ctx.params
        const data = await ctx.focusService.listFollower({
            focuserID: userID,
            ...ctx.query
        })
        responseData(ctx, data)
    } catch (err) {
        responseError(ctx, err)
    }
    next()
})

router.get('/:userID/focusers', async (ctx, next) => {
    try {
        const {userID} = ctx.params
        const data = await ctx.focusService.listFocuser({
            followerID: userID,
            ...ctx.query
        })
        responseData(ctx, data)
    } catch (err) {
        responseError(ctx, err)
    }
    next()
})

router.get('/:userID/statistic-total', async (ctx, next) => {
    try {
        const {userID} = ctx.params
        const data = await ctx.userService.getUserStatisticTotal(userID)
        responseData(ctx, data)
    } catch (err) {
        responseError(ctx, err)
    }
    next()
})

router.get('/:userID/home-page-data', async (ctx, next) => {
    try {
        const {userID} = ctx.params
        const data = await ctx.userService.getUserHomePageData(userID)
        responseData(ctx, data)
    } catch (err) {
        responseError(ctx, err)
    }
    next()
})

router.post('/:userID/complain', async (ctx, next) => {
    try {
        const {userID} = ctx.params
        const data = await ctx.complainService.submitComplain({
            targetID: userID,
            type: 1,
            ...ctx.request.body
        })
        responseData(ctx, data)
    } catch (err) {
        responseError(ctx, err)
    }
    next()
})

module.exports = router