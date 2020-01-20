import { AsyncStorage } from "react-native";
import createDataContext from "./createDataContext";
import chatApi from "../api/requester";
import { navigate } from "../navigationRef";

const authReducer = (state, action) => {
  switch (action.type) {
    case "add_error":
      return { ...state, errorMessage: action.payload };
    case "signin":
      return {
        errorMessage: "",
        token: action.payload.token,
      };
    case "localsignin":
      return {
        errorMessage: "",
        token: action.payload.token,
      };
    case "clear_error_message":
      return { ...state, errorMessage: "" };
    case "signout":
      return { token: null, avatar: null, errorMessage: "" };
    default:
      return state;
  }
};

const tryLocalSignin = dispatch => async () => {
  const token = await AsyncStorage.getItem("token");
  if (token) {
    // const response = await chatApi.get("/userdata");
    dispatch({
      type: "localsignin",
      payload: { token }
    });
    navigate("Account");
  } else {
    navigate("Signin");
  }
};

const clearErrorMessage = dispatch => () => {
  dispatch({ type: "clear_error_message" });
};

const signup = dispatch => async ({ username, password, avatar }) => {
  try {
    const response = await chatApi.post("/signup", {
      username,
      password,
      avatar
    });
    await AsyncStorage.setItem("token", response.data.token);
    dispatch({ type: "signin", payload: response.data.token });
    navigate("Account");
  } catch (err) {
    console.error(err);
    dispatch({
      type: "add_error",
      payload: "Something went wrong with sign up"
    });
  }
};

const signin = dispatch => async ({ username, password }) => {
  // navigate('Account');
  try {
    const response = await chatApi.post("/signin", { username, password });
    await AsyncStorage.setItem("token", response.data.token);
    // console.log("signin response.data", response.data);
    dispatch({ type: "signin", payload: response.data });
    navigate("Account");
  } catch (err) {
    console.error(err);
    dispatch({
      type: "add_error",
      payload: "Something went wrong with sign up"
    });
  }
};

const signout = dispatch => async () => {
  await AsyncStorage.removeItem("token");
  dispatch({ type: "signout" });
  navigate("Signin");
};

export const { Provider, Context } = createDataContext(
  authReducer,
  { signup, signin, signout, clearErrorMessage, tryLocalSignin },
  { token: null, errorMessage: "" }
);
