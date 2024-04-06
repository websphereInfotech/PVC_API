const express = require('express');
const { validation } = require('../views/validate');
const adminAuth = require('../middleware/adminAuth');
const { create_expense, create_expenseItem, update_expense, update_expenseItem, delete_expense, delete_expenseItem, get_all_expense, view_expense } = require('../controller/expense');

const router = express.Router();

router.post('/create_expense',adminAuth,validation('create_expense'),create_expense);
router.post('/create_expenseItem',adminAuth,validation('create_expenseItem'),create_expenseItem);
router.put('/update_expense/:id',adminAuth,update_expense);
router.put('/update_expenseItem/:id',adminAuth,update_expenseItem);
router.delete('/delete_expense/:id',adminAuth,delete_expense);
router.delete('/delete_expenseItem.:id',adminAuth,delete_expenseItem);
router.get('/get_all_expense',adminAuth,get_all_expense);
router.get('/view_expense/:id',adminAuth,view_expense);

module.exports = router;