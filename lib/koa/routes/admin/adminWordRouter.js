const Router = require('koa-router')
const {
    responseData,
    responseError
} = require('../../../util/tools')

const router = new Router({prefix: '/admin/words'})

router.post('/', async (ctx, next) => {
    try {
        const data = await ctx.wordService.createWord(ctx.request.body)
        responseData(ctx, data)
    } catch (err) {
        responseError(ctx, err)
    }
    next()
})

router.get('/:wordID', async (ctx, next) => {
    try {
        const {wordID} = ctx.params
        const data = await ctx.wordService.getWordByID(wordID)
        responseData(ctx, data)
    } catch (err) {
        responseError(ctx, err)
    }
    next()
})

router.put('/:wordID', async (ctx, next) => {
    try {
        const {wordID} = ctx.params
        const data = await ctx.wordService.updateWord({
            wordID,
            ...ctx.request.body
        })
        responseData(ctx, data)
    } catch (err) {
        responseError(ctx, err)
    }
    next()
})

router.delete('/:wordID', async (ctx, next) => {
    try {
        const {wordID} = ctx.params
        const data = await ctx.wordService.removeWord(wordID)
        responseData(ctx, data)
    } catch (err) {
        responseError(ctx, err)
    }
    next()
})

router.get('/', async (ctx, next) => {
    try {
        const data = await ctx.wordService.getWords(ctx.query)
        responseData(ctx, data)
    } catch (err) {
        responseError(ctx, err)
    }
    next()
})

module.exports = router