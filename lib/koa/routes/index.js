const userRouter = require("./userRouter");

const adminSlideRouter = require("./admin/adminSlideRouter");

const adminPoetryRouter = require("./admin/adminPoetryRouter");

const adminPoetryTypeRouter = require("./admin/adminPoetryTypeRouter");

const loadRoutes = app => {
    app.use(adminPoetryTypeRouter.routes());
    app.use(adminPoetryRouter.routes());
    app.use(adminSlideRouter.routes());
    app.use(userRouter.routes());
};

module.exports = {
    loadRoutes
};