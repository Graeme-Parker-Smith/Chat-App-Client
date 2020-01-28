import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { Input, Button } from "react-native-elements";

const ChannelList = ({ listData }) => {
  return (
    <View>
       <FlatList
            style={{ marginTop: 20, height: 175 }}
            data={listData}
            keyExtractor={item => item.name}
            renderItem={({ item }) => {
              if (item.name.includes(channelSearch)) {
                return (
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("Room", {
                        roomName: item.name,
                        username: state.currentUser.username,
                        room_id: item._id,
                        roomType: "public"
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
              }
            }}
          />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default ChannelList;
