"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const soporte_controller_1 = require("../controllers/soporte.controller");
const router = (0, express_1.Router)();
router.get('/soporte', soporte_controller_1.getSoporte);
router.post('/soporte/new', soporte_controller_1.createPostSoporte);
router.get('/soporte/ticket', soporte_controller_1.getPost);
exports.default = router;
