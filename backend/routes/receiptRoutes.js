const express = require('express');
const router = express.Router();
const receiptController = require('../controllers/receiptController');

router.post('/', receiptController.createReceipt);
router.get('/', receiptController.getReceipts);
router.get('/:id', receiptController.getReceipt);

module.exports = router;