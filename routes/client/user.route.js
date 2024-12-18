const express = require('express');
const controller =require("../../controller/client/user.controllers");
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

module.exports = Router;