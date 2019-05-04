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
    loadAndValidateRemoveSlideCommand
};