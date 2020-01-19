import createDataContext from "./createDataContext";
import chatApi from "../api/requester";

const channelReducer = (state, action) => {
  switch (action.type) {
    case "fetch_channels":
      return {
        currentUser: action.payload.currentUser,
        channels: action.payload.channels
      };
    case "update_user":
      return { ...state, currentUser: action.payload };
    case "create_channel":
      return { ...state, channels: [...state.channels, action.payload] };
    default:
      return state;
  }
};

const updateUser = dispatch => async ({
  username,
  newUsername,
  newPassword,
  newAvatar
}) => {
  const response = await chatApi.post("/updateuser", {
    username,
    newUsername,
    newPassword,
    newAvatar
  });
  console.log("response.data", response.data);
  dispatch({ type: "update_user", payload: response.data });
};

const fetchChannels = dispatch => async () => {
  const response = await chatApi.get("/channels");
  // console.log("fetchChannels response.data", response.data);
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
  { fetchChannels, createChannel, updateUser },
  { currentUser: null, channels: [] }
);
