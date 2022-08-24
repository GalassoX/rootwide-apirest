"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const router = (0, express_1.Router)();
/*router.get('/pcu/user/:user', getPanelUser);

router.get('/samp/user/:name', myUser);*/
router.get('/user/discord/:id', user_controller_1.getPanelUserByDiscord);
//router.get('/user/update', updateUserServices);
//router.get('/user/samp/:id', myUser);
exports.default = router;
