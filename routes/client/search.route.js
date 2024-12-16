const express = require('express');
const Controller =require("../../controller/client/search.controllers");
const Router = express.Router();

Router.get('/', Controller.index);
    
module.exports = Router;