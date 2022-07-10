import * as constants from "./chat-constants";

const initialState = {
  conversationData: [],
  channelId: "",
  userId: "",
  subscriptionChannelId: "",
  initialData: "",
};

const chatReducer = (state = initialState, { type, data }) => {
  switch (type) {
    case constants.UPDATE_CONVERSATION:
      return { ...state, conversationData: data };
    case constants.UPDATE_USER_ID:
      return { ...state, userId: data };
    case constants.UPDATE_CHANNEL_ID:
      return { ...state, channelId: data };
    case constants.UPDATE_SUBSCRIPTION_ID:
      return { ...state, subscriptionChannelId: data };
    case constants.SET_INITIAL_DATA:
      return { ...state, initialData: data };
    default:
      return state;
  }
};
export default chatReducer;
