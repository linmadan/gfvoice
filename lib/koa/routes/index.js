const adminPoetryTypeRouter = require("./admin/adminPoetryTypeRouter");

const loadRoutes = app => {
    app.use(adminPoetryTypeRouter.routes());
};

module.exports = {
    loadRoutes
};