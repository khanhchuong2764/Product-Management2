const DashboardRouter = require("./dashboard.route");
const ProductRouter = require("./product.route");
const ProductCategoryRouter = require("./product-category.route");
const RoleRouter = require("./role.route");
const AccountRouter = require("./account.route");
const AuthRouter = require("./auth.route");
const MyaccountRouter = require("./my-account.route");
const AuthenMiddelware = require("../../middleware/admin/auth.middelware");
const SystemConfig = require("../../config/system");

module.exports = (app) => {
    const Path_Admin = SystemConfig.PrefixAdmin;
    app.use(Path_Admin + '/dashboard',AuthenMiddelware.requireAuth,DashboardRouter)

    app.use(Path_Admin + '/products',AuthenMiddelware.requireAuth, ProductRouter)

    app.use(Path_Admin + '/product-category',AuthenMiddelware.requireAuth, ProductCategoryRouter)

    app.use(Path_Admin + '/roles',AuthenMiddelware.requireAuth, RoleRouter)

    app.use(Path_Admin + '/accounts',AuthenMiddelware.requireAuth, AccountRouter)

    app.use(Path_Admin + '/auth', AuthRouter)

    app.use(Path_Admin + '/my-accounts',AuthenMiddelware.requireAuth, MyaccountRouter)

}