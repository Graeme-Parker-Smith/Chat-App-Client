import createDataContext from "./createDataContext";
import chatApi from "../api/requester";

const channelReducer = (state, action) => {
  switch (action.type) {
    case "fetch_channels":
      return {
        currentUser: action.payload.username,
        channels: action.payload.channels
      };
    case "create_channel":
      return { ...state, channels: [...state.channels, action.payload] };
    default:
      return state;
  }
};

const fetchChannels = dispatch => async () => {
  const response = await chatApi.get("/channels");
  dispatch({ type: "fetch_channels", payload: response.data });
};
const createChannel = dispatch => async ({ name, creator }) => {
  await chatApi.post("/channels", { name, creator });
  console.log("Channel saved!");
  dispatch({
    type: "create_channel",
    payload: { name, creator, members: [creator], messages: [] }
  });
};

export const { Provider, Context } = createDataContext(
  channelReducer,
  { fetchChannels, createChannel },
  { currentUser: null, channels: [] }
);
