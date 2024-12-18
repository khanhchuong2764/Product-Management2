const express = require('express');
const controller =require("../../controller/client/user.controllers");
const Validate = require("../../validates/client/user.validate");
const Router = express.Router();

Router.get('/register', controller.register);

Router.post('/register',Validate.RegisterPost, controller.registerPost);

Router.get('/login', controller.login);

Router.post('/login',Validate.loginPost, controller.loginPost);

Router.get('/logout', controller.logout);

module.exports = Router;