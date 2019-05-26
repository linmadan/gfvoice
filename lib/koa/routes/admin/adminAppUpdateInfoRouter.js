const Router = require('koa-router')
const {
    responseData,
    responseError
} = require('../../../util/tools')

const router = new Router({prefix: '/admin/app-update-infos'})

router.post('/', async (ctx, next) => {
    try {
        const data = await ctx.appUpdateInfoService.createAppUpdateInfo(ctx.request.body)
        responseData(ctx, data)
    } catch (err) {
        responseError(ctx, err)
    }
    next()
})

router.get('/:appUpdateInfoID', async (ctx, next) => {
    try {
        const {appUpdateInfoID} = ctx.params
        const data = await ctx.appUpdateInfoService.getAppUpdateInfoByID(appUpdateInfoID)
        responseData(ctx, data)
    } catch (err) {
        responseError(ctx, err)
    }
    next()
})

router.put('/:appUpdateInfoID', async (ctx, next) => {
    try {
        const {appUpdateInfoID} = ctx.params
        const data = await ctx.appUpdateInfoService.updateAppUpdateInfo({
            appUpdateInfoID,
            ...ctx.request.body
        })
        responseData(ctx, data)
    } catch (err) {
        responseError(ctx, err)
    }
    next()
})

router.delete('/:appUpdateInfoID', async (ctx, next) => {
    try {
        const {appUpdateInfoID} = ctx.params
        const data = await ctx.appUpdateInfoService.removeAppUpdateInfo(appUpdateInfoID)
        responseData(ctx, data)
    } catch (err) {
        responseError(ctx, err)
    }
    next()
})

router.get('/', async (ctx, next) => {
    try {
        const data = await ctx.appUpdateInfoService.getAppUpdateInfos(ctx.query)
        responseData(ctx, data)
    } catch (err) {
        responseError(ctx, err)
    }
    next()
})

module.exports = router