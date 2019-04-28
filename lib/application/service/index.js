const PoetryTypeService = require('./poetryTypeService');

const { createPrivateInstanceWrap } = require('../../util/tools');

module.exports = {
  createPoetryTypeService: createPrivateInstanceWrap(PoetryTypeService)
};