const express = require('express');

const contactController = require('../controllers/contactController');

const router = express.Router();

router.post('/', function (req, res) {
  contactController.contactUs;
});

module.exports = router;
