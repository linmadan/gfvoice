const adminPoetryVoiceRouter = require("./admin/adminPoetryVoiceRouter");

const adminImageRouter = require("./admin/adminImageRouter");

const adminAppUpdateInfoRouter = require("./admin/adminAppUpdateInfoRouter");

const adminFeedbackRouter = require("./admin/adminFeedbackRouter");

const adminWordRouter = require("./admin/adminWordRouter");

const pickRouter = require("./pickRouter");

const poetryVoiceRouter = require("./poetryVoiceRouter");

const poetryRouter = require("./poetryRouter");

const systemRouter = require("./systemRouter");

const userRouter = require("./userRouter");

const adminSlideRouter = require("./admin/adminSlideRouter");

const adminPoetryRouter = require("./admin/adminPoetryRouter");

const adminPoetryTypeRouter = require("./admin/adminPoetryTypeRouter");

const loadRoutes = app => {
    app.use(adminPoetryTypeRouter.routes());
    app.use(adminPoetryRouter.routes());
    app.use(adminSlideRouter.routes());
    app.use(userRouter.routes());
    app.use(systemRouter.routes());
    app.use(poetryRouter.routes());
    app.use(poetryVoiceRouter.routes());
    app.use(pickRouter.routes());
    app.use(adminWordRouter.routes());
    app.use(adminFeedbackRouter.routes());
    app.use(adminAppUpdateInfoRouter.routes());
    app.use(adminImageRouter.routes());
    app.use(adminPoetryVoiceRouter.routes());
};

module.exports = {
    loadRoutes
};