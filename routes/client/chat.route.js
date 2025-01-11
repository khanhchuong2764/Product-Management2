const express = require('express');
const controller =require("../../controller/client/chat.controllers");
const Router = express.Router();
const ChatMiddelware = require("../../middleware/client/chat.middelware");

Router.get('/:roomchatId',ChatMiddelware.isAccess, controller.index);

module.exports = Router;