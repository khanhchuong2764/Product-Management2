const express = require('express');
const DasboardController =require("../../controller/admin/dashboard.controllers");
const Router = express.Router();

Router.get('/', DasboardController.dashboard);

module.exports = Router;