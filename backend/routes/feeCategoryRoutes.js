const express = require('express');
const router = express.Router();
const feeCategoryController = require('../controllers/feeCategoryController');

router.post('/', feeCategoryController.createCategory);
router.get('/', feeCategoryController.getCategories);
router.put('/:id', feeCategoryController.updateCategory);
router.delete('/:id', feeCategoryController.deleteCategory);

module.exports = router;