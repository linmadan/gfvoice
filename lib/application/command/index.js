const loadAndValidateLikeReplyCommand = require('./likeReply');

const loadAndValidateLikeCommentCommand = require('./likeComment');

const loadAndValidateReplyCommentCommand = require('./replyComment');

const loadAndValidateCommentPoetryVoiceCommand = require('./commentPoetryVoice');

const loadAndValidateSubmitComplainCommand = require('./submitComplain');

const loadAndValidatePickPoetryVoiceCommand = require('./pickPoetryVoice');

const loadAndValidateThirdRegisterAndLoginCommand = require('./thirdRegisterAndLogin');

const loadAndValidateSubmitPoetryVoiceCommand = require('./submitPoetryVoice');

const loadAndValidateCancelFocusUserCommand = require('./cancelFocusUser');

const loadAndValidateFocusUserCommand = require('./focusUser');

const loadAndValidateBindPhoneCommand = require('./bindPhone');

const loadAndValidateUpdateUserCommand = require('./updateUser');

const loadAndValidateUserLoginCommand = require('./userLogin');

const loadAndValidateRegisterUserCommand = require('./registerUser');

const loadAndValidateRemoveSlideCommand = require('./removeSlide');

const loadAndValidateUpdateSlideCommand = require('./updateSlide');

const loadAndValidateCreateSlideCommand = require('./createSlide');

const loadAndValidateRemovePoetryCommand = require('./removePoetry');

const loadAndValidateUpdatePoetryCommand = require('./updatePoetry');

const loadAndValidateCreatePoetryCommand = require('./createPoetry');

const loadAndValidateCreatePoetryTypeCommand = require('./createPoetryType');
const loadAndValidateUpdatePoetryTypeCommand = require('./updatePoetryType');
const loadAndValidateRemovePoetryTypeCommand = require('./removePoetryType');

module.exports = {
    loadAndValidateCreatePoetryTypeCommand,
    loadAndValidateUpdatePoetryTypeCommand,
    loadAndValidateRemovePoetryTypeCommand,
    loadAndValidateCreatePoetryCommand,
    loadAndValidateUpdatePoetryCommand,
    loadAndValidateRemovePoetryCommand,
    loadAndValidateCreateSlideCommand,
    loadAndValidateUpdateSlideCommand,
    loadAndValidateRemoveSlideCommand,
    loadAndValidateRegisterUserCommand,
    loadAndValidateUserLoginCommand,
    loadAndValidateUpdateUserCommand,
    loadAndValidateBindPhoneCommand,
    loadAndValidateFocusUserCommand,
    loadAndValidateCancelFocusUserCommand,
    loadAndValidateSubmitPoetryVoiceCommand,
    loadAndValidateThirdRegisterAndLoginCommand,
    loadAndValidatePickPoetryVoiceCommand,
    loadAndValidateSubmitComplainCommand,
    loadAndValidateCommentPoetryVoiceCommand,
    loadAndValidateReplyCommentCommand,
    loadAndValidateLikeCommentCommand,
    loadAndValidateLikeReplyCommand
};