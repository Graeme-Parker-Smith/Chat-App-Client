import { Notifications } from "expo";
import * as Permissions from "expo-permissions";
import { AsyncStorage } from "react-native";
import axios from "axios";

const PUSH_ENDPOINT = "https://exp.host/--/api/v2/push/send";

export default async () => {
  let previousToken = await AsyncStorage.getItem("pushtoken");
  // console.log(previousToken);

  if (previousToken) {
    await axios.post(PUSH_ENDPOINT, { 
      to: previousToken,
      title: "Hello",
      body: "World",
      sound: "default"
     });
    return;
  } else {
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);

    if (status !== "granted") {
      return;
    }

    let token = await Notifications.getExpoPushTokenAsync();
    console.log("token: ", token);
    await axios.post(PUSH_ENDPOINT, { 
      to: token,
      sound: "default",
      title: "Hello",
      body: "World"
     });
    AsyncStorage.setItem("pushtoken", token);
  }
};
