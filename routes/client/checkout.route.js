const express = require('express');
const controller =require("../../controller/client/checkout.controllers");
const Router = express.Router();

Router.post('/', controller.index);

Router.post('/order', controller.order);

Router.get('/success/:orderId', controller.success);

module.exports = Router;