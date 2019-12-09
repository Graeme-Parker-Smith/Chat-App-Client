import createDataContext from "./createDataContext";
import chatApi from "../api/requester";

const messageReducer = (state, action) => {
  switch (action.type) {
    case "fetch_messages":
      return action.payload;
    case "add_message":
      return [...state, action.payload];
    default:
      return state;
  }
};

const fetchMessages = dispatch => async () => {
  const response = await chatApi.get("/messages");
  console.log("message fetched!");
  dispatch({ type: "fetch_messages", payload: response.data });
};
const addMessage = dispatch => async ({ username, content, roomName }) => {
  const date = new Date();
  const combo = date.toLocaleString();
  const message = { creator: username, content, time: combo, roomName };
  console.log("message is: ", message);
  const response = await chatApi.post("/messages", { ...message });
  console.log("Message successfully saved!");
  console.log("response.data is: ", response.data);
  dispatch({
    type: "add_message",
    payload: { ...message }
  });
};

export const { Provider, Context } = createDataContext(
  messageReducer,
  { fetchMessages, addMessage },
  []
);
