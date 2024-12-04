const DashboardRouter = require("./dashboard.route");
const SystemConfig = require("../../config/system");

module.exports = (app) => {
    const Path_Admin = SystemConfig.PrefixAdmin;
    app.use(Path_Admin + '/dashboard', DashboardRouter)
}