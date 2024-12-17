const express = require('express');
const Controller =require("../../controller/client//order.controllers");
const Router = express.Router();

Router.get('/', Controller.index);

module.exports = Router;