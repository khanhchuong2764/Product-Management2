const express = require('express');
const RoleController =require("../../controller/admin/roles.controllers");
const Router = express.Router();

Router.get('/', RoleController.index);

Router.get('/create', RoleController.create);

Router.post('/create', RoleController.createPost);

Router.delete('/delete/:id', RoleController.delete);

Router.get('/edit/:id', RoleController.edit);

Router.patch('/edit/:id', RoleController.editPatch);

Router.get('/detail/:id', RoleController.detail);

Router.get('/permission', RoleController.permission);

Router.patch('/permission', RoleController.permissionPatch);

module.exports = Router;