const express = require('express');
const controller =require("../../controller/client/carts.controllers");
const Router = express.Router();

Router.get('/', controller.index);

Router.post('/add/:id', controller.addPost);


Router.get('/delete/:productId', controller.delete);

Router.get('/update/:productId/:quantity', controller.updateQuantity);



module.exports = Router;