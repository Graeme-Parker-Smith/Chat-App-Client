import axios from "axios";
import { AsyncStorage } from "react-native";

const instance = axios.create({
  baseURL: "http://9e79e57b.ngrok.io"
  // baseURL: "https://graeme-chat-app.herokuapp.com"
});

// before making an authentication request, check to see if jwtoken is already present
instance.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  err => {
    return Promise.reject(err);
  }
);

export default instance;