const _ = require('lodash')
const {
    Feedback
} = require('../../domain')
const {
    createFeedbackRepository
} = require('../../infrastructure')
const {
    throwServiceError
} = require('../../util/errors')
const constant = require('../../util/constant')

class Service {
    constructor() {
    }

    async getFeedbackByID(feedbackID) {
        if (_.isUndefined(feedbackID)) {
            throwServiceError(constant.STATUS_CODE.ARG_ERROR)
        }
        const feedbackRepository = createFeedbackRepository()
        let feedback = await feedbackRepository.findOne({feedbackID})
        if (_.isNull(feedback)) {
            throwServiceError(constant.STATUS_CODE.RES_NO_FIND)
        }
        return {
            ...feedback
        }
    }

    async getFeedbacks(queryOptions) {
        const feedbackRepository = createFeedbackRepository()
        const {feedbacks, count} = await feedbackRepository.find(queryOptions)
        return {
            count,
            feedbacks: feedbacks.map(feedback => {
                return {...feedback}
            })
        }
    }
}

module.exports = Service