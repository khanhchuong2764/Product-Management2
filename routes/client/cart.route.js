const express = require('express');
const controller =require("../../controller/client/carts.controllers");
const Router = express.Router();

Router.post('/add/:id', controller.addPost);

module.exports = Router;