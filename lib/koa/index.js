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
    createSystemService
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
loadRoutes(app);

module.exports = app;