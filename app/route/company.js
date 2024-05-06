const express = require('express');
const { get_all_company } = require('../controller/company');
const { validation } = require("../views/validate");

const router = express.Router();

router.get('/get_all_company',get_all_company);

module.exports = router;