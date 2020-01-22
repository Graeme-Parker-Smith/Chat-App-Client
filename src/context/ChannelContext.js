import createDataContext from "./createDataContext";
import chatApi from "../api/requester";

const channelReducer = (state, action) => {
  switch (action.type) {
    case "fetch_channels":
      return {
        currentUser: action.payload.currentUser,
        channels: action.payload.channels
      };
    case "update_channel":
      return state;
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
  dispatch({ type: "update_user", payload: response.data.userData });
};

const updateChannel = dispatch => async ({ username, prevName, newName, newAvatar }) => {
  const response = await chatApi.post("/updatechannel", {
    username,
    prevName,
    newName,
    newAvatar
  });
  dispatch({ type: "update_channel", payload: response.data });
};

const fetchChannels = dispatch => async () => {
  const response = await chatApi.get("/channels");
  // console.log("fetchChannels response.data", response.data);
  dispatch({ type: "fetch_channels", payload: response.data });
};
const createChannel = dispatch => async ({ name, creator, avatar }) => {
  await chatApi.post("/channels", { name, creator, avatar });
  // console.log("Channel saved!");
  dispatch({
    type: "create_channel",
    payload: { name, creator, members: [creator], messages: [], avatar }
  });
};

export const { Provider, Context } = createDataContext(
  channelReducer,
  { fetchChannels, createChannel, updateUser, updateChannel },
  { currentUser: null, channels: [] }
);
