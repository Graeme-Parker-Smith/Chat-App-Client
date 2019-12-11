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
    default:
      return state;
  }
};

const fetchMessages = dispatch => async roomName => {
  // console.log("roomName to fetch messages is: ", roomName);
  const response = await chatApi.get("/messages", {
    params: { roomName: roomName }
  });
  // console.log("messages fetched!");
  dispatch({ type: "fetch_messages", payload: response.data });
};
const addMessage = dispatch => async ({ creator, content, roomName }) => {
  const date = new Date();
  const time = date.toLocaleString();
  const message = { creator, content, roomName, time, id: uuid() };
  const response = await chatApi.post("/messages", { ...message });
  // console.log("Message successfully saved!");
  // console.log("response.data is: ", response.data);
  dispatch({
    type: "add_message",
    payload: response.data.messages
  });
};
const addQuickMessage = dispatch => ({ creator, content, roomName }) => {
  const quickMessage = { creator, content, roomName, id: uuid() };
  console.log("quickMessage is: ", quickMessage);
  dispatch({
    type: "add_quick_message",
    payload: quickMessage
  });
};

export const { Provider, Context } = createDataContext(
  messageReducer,
  { fetchMessages, addMessage, addQuickMessage },
  []
);
