const express = require('express');
const controller =require("../../controller/client/roomchat.controllers");
const Router = express.Router();

const ChatMiddelware = require("../../middleware/client/chat.middelware");

Router.get('/', controller.index);

Router.get('/create', controller.create);

Router.post('/create', controller.createPost);

Router.get('/adduser/:roomchatId',ChatMiddelware.roleaddUser, controller.addUser);

Router.patch('/adduser/:roomchatId',ChatMiddelware.roleaddUser, controller.addUserPatch);

Router.get('/user/:roomchatId',ChatMiddelware.isAccess, controller.User);

module.exports = Router;