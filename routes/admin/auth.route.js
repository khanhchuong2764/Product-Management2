const express = require('express');
const Controller =require("../../controller/admin/auth.controllers");
const AuthValidate = require("../../validates/admin/auth.validate");
const Router = express.Router();

Router.get('/login', Controller.login);

Router.post('/login',AuthValidate.login ,Controller.loginPost)

Router.get('/logout' ,Controller.logout)

module.exports = Router;