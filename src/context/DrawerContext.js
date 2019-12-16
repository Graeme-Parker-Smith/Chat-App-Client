import createDataContext from "./createDataContext";
import chatApi from "../api/requester";

const drawerReducer = (state, action) => {
  switch (action.type) {
    case "set_users":
      return {users: action.payload};
    default:
      return {...state};
  }
};

const setUsers = dispatch => usersInRoom => {
  dispatch({
    type: "set_users",
    payload: usersInRoom
  });
};

export const { Provider, Context } = createDataContext(
  drawerReducer,
  { setUsers },
  {users: []}
);
