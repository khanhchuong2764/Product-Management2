const express = require('express');
const controller =require("../../controller/client/users.controllers");
const Router = express.Router();

Router.get('/not-friend', controller.notFriend);

Router.get('/request', controller.request);

Router.get('/accept', controller.accept);

Router.get('/friends', controller.friends);

module.exports = Router;