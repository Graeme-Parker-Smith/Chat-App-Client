import createDataContext from "./createDataContext";
import chatApi from "../api/requester";

const channelReducer = (state, action) => {
  switch (action.type) {
    case "fetch_channels":
      return {
        currentUser: action.payload.username,
        channels: action.payload.channels
      };
    default:
      return state;
  }
};

const fetchChannels = dispatch => async () => {
  const response = await chatApi.get("/channels");
  dispatch({ type: "fetch_channels", payload: response.data });
};
const createChannel = dispatch => async (name, locations) => {
  await chatApi.post("/channels", { name, locations });
};

export const { Provider, Context } = createDataContext(
  channelReducer,
  { fetchChannels, createChannel },
  { currentUser: null, channels: [] }
);
