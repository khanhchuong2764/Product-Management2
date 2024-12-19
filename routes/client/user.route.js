const express = require('express');
const multer  = require('multer');
const upload = multer();
const UploadsCloud = require("../../middleware/admin/UploadCloud");
const controller =require("../../controller/client/user.controllers");
const authenMiddelware = require("../../middleware/client/auth.middelware");
const Validate = require("../../validates/client/user.validate");
const Router = express.Router();

Router.get('/register', controller.register);

Router.post('/register',Validate.RegisterPost, controller.registerPost);

Router.get('/login', controller.login);

Router.post('/login',Validate.loginPost, controller.loginPost);

Router.get('/logout', controller.logout);

Router.get('/password/forgot',controller.forgotPassword);

Router.post('/password/forgot',Validate.forgotPassword,controller.forgotPasswordPost);

Router.get('/password/otp', controller.optPassword);

Router.post('/password/otp',Validate.forgotPasswordPost, controller.optPasswordPost);

Router.get('/password/reset', controller.resetPassword);

Router.post('/password/reset',Validate.resetPasswordPost, controller.resetPasswordPost);

Router.get('/info',authenMiddelware.requireAuth, controller.infoUser);

Router.patch('/info',authenMiddelware.requireAuth,upload.single('avatar'),UploadsCloud.upload,Validate.editInfo,controller.infoUserPatch);

module.exports = Router;