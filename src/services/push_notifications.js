import { Notifications } from "expo";
import * as Permissions from "expo-permissions";
import { AsyncStorage } from "react-native";
import chatApi from "../api/requester";
import axios from "axios";

const PUSH_ENDPOINT = "https://exp.host/--/api/v2/push/send";

export default async ({ user }) => {
  let previousToken = await AsyncStorage.getItem("pushtoken");
  // console.log(previousToken);

  if (previousToken) {
    console.log("previous token", previousToken);
    const response = await chatApi.post("/pushToken", {
      token: previousToken,
      user
    });
    return response.data;
  } else {
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);

    if (status !== "granted") {
      return;
    }

    let token = await Notifications.getExpoPushTokenAsync();
    console.log("token: ", token);
    const response = await chatApi.post("/pushToken", {
      token,
      user
    });
    AsyncStorage.setItem("pushtoken", token);
    return response.data;
  }
};
