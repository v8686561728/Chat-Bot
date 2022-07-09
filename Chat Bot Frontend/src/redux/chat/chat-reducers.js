import * as constants from "./chat-constants";

const initialState = {
  conversationData: [],
};

const chatReducer = (state = initialState, { type, data }) => {
  switch (type) {
    case constants.UPDATE_CONVERSATION:
        console.log(state)
      return { ...state, conversationData: data };

    default:
      return state;
  }
};
export default chatReducer;
