const express = require('express');
const controller =require("../../controller/client/chat.controllers");
const Router = express.Router();

Router.get('/', controller.index);

module.exports = Router;