const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const { loadRoutes } = require('./routes');
const { createRequestLogMiddleware } = require('./middlewares');
const {
    createPoetryTypeService,
    createPoetryService,
    createSlideService,
    createUserService,
    createFocusService,
    createSystemService,
    createPoetryVoiceService,
    createPickRankService,
    createComplainService,
    createWordService,
    createFeedbackService,
    createAppUpdateInfoService,
    createImageService
} = require('../application');
const logger = require('../util/logger');

const app = new Koa();
app.on('error', (err, ctx) => {
    ctx.logger.error(`${ctx.request.method} ${ctx.request.originalUrl} ${err.stack}`);
    ctx.logger.error(`${ctx.request.method} ${ctx.request.originalUrl} ${err.message}`);
});
app.use(bodyParser({
    onerror: (err, ctx) => {
        ctx.throw('body parse error', 422);
    }
}));
app.use(createRequestLogMiddleware());
app.context.logger = logger;
app.context.poetryTypeService = createPoetryTypeService();
app.context.poetryService = createPoetryService();
app.context.slideService = createSlideService();
app.context.userService = createUserService();
app.context.focusService = createFocusService();
app.context.systemService = createSystemService();
app.context.poetryVoiceService = createPoetryVoiceService();
app.context.pickRankService = createPickRankService();
app.context.complainService = createComplainService();
app.context.wordService = createWordService();
app.context.feedbackService = createFeedbackService();
app.context.appUpdateInfoService = createAppUpdateInfoService();
app.context.imageService = createImageService();
loadRoutes(app);

module.exports = app;