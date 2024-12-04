const express = require('express');
const HomeController =require("../../controller/client/home.controllers");
const Router = express.Router();

Router.get('/', HomeController.index);

module.exports = Router;