import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Image,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ActivityIndicator
} from "react-native";
import { Button, Input } from "react-native-elements";
import { SafeAreaView } from "react-navigation";
import { NavigationEvents } from "react-navigation";
import Spacer from "../components/Spacer";
import LoadingIndicator from "../components/LoadingIndicator";
import CreateChannelForm from "../components/CreateChannelForm";
import CreatePrivateChannelForm from "../components/CreatePrivateChannelForm";
import EditUserForm from "../components/EditUserForm";
import EditChannelForm from "../components/EditChannelForm";
import EditPrivateChannelForm from "../components/EditPrivateChannelForm";
import { ListItem } from "react-native-elements";
import { Context as AuthContext } from "../context/AuthContext";
import { Context as ChannelContext } from "../context/ChannelContext";
import { FontAwesome, Entypo } from "@expo/vector-icons";

const AccountScreen = ({ navigation }) => {
  const { signout } = useContext(AuthContext);
  const { state, fetchChannels, addFriend } = useContext(ChannelContext);
  const [showEditUserForm, setShowEditUserForm] = useState(false);
  const [showCreateChannelForm, setShowCreateChannelForm] = useState(false);
  const [
    showCreatePrivateChannelForm,
    setShowCreatePrivateChannelForm
  ] = useState(false);
  const [showEditChannelForm, setShowEditChannelForm] = useState({
    showForm: false,
    roomName: "",
    avatar: ""
  });
  const [showEditPrivateChannelForm, setShowEditPrivateChannelForm] = useState({
    showForm: false,
    roomName: "",
    avatar: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [userSearch, setUserSearch] = useState("");
  // console.log("currentUser", state.currentUser);

  const handleEditUserClick = () => {
    setShowEditUserForm(true);
    setShowCreateChannelForm(false);
    setShowCreatePrivateChannelForm(false);
    setShowEditChannelForm({
      showForm: false,
      roomName: "",
      avatar: ""
    });
  };
  const handleCreateChannelClick = () => {
    setShowCreateChannelForm(true);
    setShowCreatePrivateChannelForm(false);
    setShowEditUserForm(false);
    setShowEditChannelForm({
      showForm: false,
      roomName: "",
      avatar: ""
    });
  };
  const handleCreatePrivateChannelClick = () => {
    setShowCreatePrivateChannelForm(true);
    setShowCreateChannelForm(false);
    setShowEditUserForm(false);
    setShowEditChannelForm({
      showForm: false,
      roomName: "",
      avatar: ""
    });
  };
  const handleEditChannelClick = item => {
    setShowEditChannelForm({
      showForm: true,
      roomName: item.name,
      avatar: item.avatar
    });
    setShowEditUserForm(false);
    setShowCreateChannelForm(false);
    setShowCreatePrivateChannelForm(false);
  };
  const handleEditPrivateChannelClick = item => {
    setShowEditPrivateChannelForm({
      showForm: true,
      roomName: item.name,
      avatar: item.avatar
    });
    setShowEditUserForm(false);
    setShowCreateChannelForm(false);
    setShowCreatePrivateChannelForm(false);
  };

  if (!state.currentUser || isLoading) {
    return (
      <View>
        <NavigationEvents onWillFocus={fetchChannels} />
        <LoadingIndicator />
      </View>
    );
  }

  return (
    <>
      <SafeAreaView forceInset={{ top: "always" }} style={styles.container}>
        <View style={styles.userDisplay}>
          <View>
            {state.currentUser ? (
              <Image
                source={{ uri: state.currentUser.avatar }}
                style={styles.avatarStyle}
              />
            ) : null}
          </View>
          <Text style={styles.userTitle}>{state.currentUser.username}</Text>
          <Entypo
            name="edit"
            color="#0af"
            size={32}
            onPress={handleEditUserClick}
            style={{ alignSelf: "center", marginLeft: 10 }}
          />
          <FontAwesome
            name="plus-circle"
            color="#0af"
            size={32}
            style={{ alignSelf: "center", marginLeft: 10 }}
            onPress={handleCreateChannelClick}
          />
          <FontAwesome
            name="plus-circle"
            color="#301934"
            size={32}
            style={{ alignSelf: "center", marginLeft: 10 }}
            onPress={handleCreatePrivateChannelClick}
          />
        </View>
        <View>
          {showEditUserForm ? (
            <EditUserForm
              showForm={setShowEditUserForm}
              setIsLoading={setIsLoading}
            />
          ) : null}
          {showCreateChannelForm ? (
            <CreateChannelForm showForm={setShowCreateChannelForm} />
          ) : null}
          {showCreatePrivateChannelForm ? (
            <CreatePrivateChannelForm
              showForm={setShowCreatePrivateChannelForm}
            />
          ) : null}
          {showEditChannelForm.showForm ? (
            <EditChannelForm
              showForm={setShowEditChannelForm}
              setIsLoading={setIsLoading}
              thisName={showEditChannelForm.roomName}
              thisAvatar={showEditChannelForm.avatar}
            />
          ) : null}
          {showEditPrivateChannelForm.showForm ? (
            <EditPrivateChannelForm
              showForm={setShowEditPrivateChannelForm}
              setIsLoading={setIsLoading}
              thisName={showEditPrivateChannelForm.roomName}
              thisAvatar={showEditPrivateChannelForm.avatar}
            />
          ) : null}
        </View>
        <View>
          <Input
            label="Search Users"
            value={userSearch}
            onChangeText={setUserSearch}
            autoCapitalize="none"
            autoCorrect={false}
            inputStyle={{ color: "white" }}
            returnKeyType="send"
            selectTextOnFocus={true}
          />
          <Button
            title="Add Friend"
            onPress={() =>
              addFriend({
                username: state.currentUser.username,
                friendName: userSearch
              })
            }
          />
        </View>
        <View>
          <FlatList
            style={{ marginTop: 20, height: 175 }}
            data={state.channels}
            keyExtractor={item => item.name}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("Room", {
                      roomName: item.name,
                      username: state.currentUser.username
                    })
                  }
                  onLongPress={() => handleEditChannelClick(item)}
                >
                  <ListItem
                    containerStyle={styles.channel}
                    chevron
                    title={item.name}
                    titleStyle={styles.title}
                    leftAvatar={
                      item.avatar ? (
                        <View>
                          <Image
                            source={{ uri: item.avatar }}
                            style={styles.avatarStyle}
                          />
                        </View>
                      ) : null
                    }
                  />
                </TouchableOpacity>
              );
            }}
          />
        </View>
        <View>
          <FlatList
            style={{ marginTop: 20, height: 175 }}
            data={state.privateChannels}
            keyExtractor={item => item.name}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("Room", {
                      roomName: item.name,
                      username: state.currentUser.username
                    })
                  }
                  onLongPress={() => handleEditPrivateChannelClick(item)}
                >
                  <ListItem
                    containerStyle={styles.privateChannel}
                    chevron
                    title={item.name}
                    titleStyle={styles.title}
                    leftAvatar={
                      item.avatar ? (
                        <View>
                          <Image
                            source={{ uri: item.avatar }}
                            style={styles.avatarStyle}
                          />
                        </View>
                      ) : null
                    }
                  />
                </TouchableOpacity>
              );
            }}
          />
        </View>
        <Spacer>
          <Button title="Sign Out" onPress={signout} />
        </Spacer>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  channel: {
    height: 60,
    backgroundColor: "#808080",
    margin: 5,
    borderRadius: 10
  },
  privateChannel: {
    height: 60,
    backgroundColor: "#301934",
    margin: 5,
    borderRadius: 10
  },
  title: {
    color: "white"
  },
  avatarStyle: {
    height: 50,
    width: 50,
    borderRadius: 25
  },
  container: {
    height: Dimensions.get("window").height,
    backgroundColor: "#000"
  },
  userDisplay: {
    flexDirection: "row",
    justifyContent: "flex-start",
    borderBottomWidth: 1,
    borderBottomColor: "#d3d3d3",
    paddingBottom: 10
  },
  userTitle: {
    fontSize: 32,
    textAlign: "center",
    marginLeft: 10,
    marginBottom: 3,
    alignSelf: "center",
    color: "white"
  }
});

export default AccountScreen;
