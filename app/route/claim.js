const express = require('express');
const { create_claim } = require('../controller/claim');
const adminToken = require('../middleware/adminAuth');

const router = express.Router();

router.post('/create_claim',adminToken("Claim:create_claim"),create_claim);

module.exports = router;