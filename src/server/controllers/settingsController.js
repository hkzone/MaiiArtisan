const catchAsync = require('../utils/catchAsync');
const Config = require('../models/configModel');
const factory = require('./handlerFactory');

exports.updateSettings = factory.updateOne(Config);
