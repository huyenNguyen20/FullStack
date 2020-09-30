import * as ActionTypes from "./ActionTypes";   

export const Feedbacks = (state = {feedbacks: []}, action) => {
    switch(action.type){
        case ActionTypes.ADD_FEEDBACK:
            var feedback = action.payload;
            feedback.id = state.feedbacks.length;
            return {
                feedbacks: state.feedbacks.concat(feedback)
            };
        case ActionTypes.ADD_FEEDBACKS:
            return {
                feedbacks: action.payload
            };
        default:
            return state;
    }
}