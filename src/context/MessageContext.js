import createDataContext from "./createDataContext";
import chatApi from "../api/requester";
import uuid from "uuid/v4";

const messageReducer = (state, action) => {
  switch (action.type) {
    case "fetch_messages":
      return action.payload.messages;
    case "add_message":
      return [...action.payload];
    case "add_quick_message":
      return [...state, action.payload];
    case "clear_messages":
      return [];
    default:
      return state;
  }
};

const clearMessages = dispatch => () => {
  // console.log("clearing message state");
  dispatch({ type: "clear_messages" });
};

const fetchEarlierMessages = dispatch => async (state, roomName, roomType) => {
  if (state.length > 18) {
    const response = await chatApi.get("/messages", {
      params: { stateLength: state.length, roomName, roomType  }
    });
    // console.log(
    //   "response.data.messages.length is: ",
    //   response.data.messages.length
    // );
    dispatch({ type: "fetch_messages", payload: response.data });
  }
};

const fetchMessages = dispatch => async (roomName, roomType) => {
  const response = await chatApi.get("/messages", {
    params: { roomName,  roomType}
  });
  dispatch({ type: "fetch_messages", payload: response.data });
};
const addMessage = dispatch => async (
  { creator, avatar, content, roomName, isImage, isVideo },
  state
) => {
  const date = new Date();
  const time = date.toLocaleString();
  const message = {
    creator,
    avatar,
    content,
    roomName,
    time,
    isImage,
    isVideo,
    _id: uuid()
  };
  const response = await chatApi.post("/messages", { ...message });
  dispatch({
    type: "add_message",
    payload: [...state, response.data]
  });
};
const addQuickMessage = dispatch => ({
  creator,
  avatar,
  content,
  roomName,
  isImage,
  isVideo
}) => {
  const quickMessage = {
    creator,
    avatar,
    content,
    roomName,
    time: "",
    isImage,
    isVideo,
    _id: uuid()
  };
  dispatch({
    type: "add_quick_message",
    payload: quickMessage
  });
};

export const { Provider, Context } = createDataContext(
  messageReducer,
  {
    fetchMessages,
    addMessage,
    addQuickMessage,
    fetchEarlierMessages,
    clearMessages
  },
  []
);
