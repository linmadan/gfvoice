const PoetryVoiceService = require('./poetryVoiceService');

const SystemService = require('./systemService');

const FocusService = require('./focusService');

const UserService = require('./userService');

const SlideService = require('./slideService');

const PoetryService = require('./poetryService');

const PoetryTypeService = require('./poetryTypeService');

const { createPrivateInstanceWrap } = require('../../util/tools');

module.exports = {
  createPoetryTypeService: createPrivateInstanceWrap(PoetryTypeService),
  createPoetryService: createPrivateInstanceWrap(PoetryService),
  createSlideService: createPrivateInstanceWrap(SlideService),
  createUserService: createPrivateInstanceWrap(UserService),
  createFocusService: createPrivateInstanceWrap(FocusService),
  createSystemService: createPrivateInstanceWrap(SystemService),
  createPoetryVoiceService: createPrivateInstanceWrap(PoetryVoiceService)
};