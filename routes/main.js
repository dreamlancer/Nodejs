const express = require('express');
const inforCtrl = require('../controllers/information');

const router = express.Router();

router.get('/', inforCtrl.getAll);
router.get('/edit/:id', inforCtrl.editInformation);
router.post('/delete', inforCtrl.deleteInformation);
router.post('/xml-upload', inforCtrl.xmlUploadInformation);
router.post('/update', inforCtrl.updateInformation);

module.exports = router;