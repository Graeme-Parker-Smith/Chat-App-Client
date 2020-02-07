import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Input, Button, ListItem } from 'react-native-elements';
import { Entypo } from '@expo/vector-icons';


const ChannelList = ({ listData, channelType, navigation, currentUser, handleEditChannel, channelSearch }) => {
	let color = '#808080';
	if (channelType === 'private') color = '#301934';
	if (channelType === 'pm') color = '#036';
	console.log(color);
	return (
		<View>
			<FlatList
				style={{ marginTop: 20, height: 275, width: Dimensions.get('window').width * 0.5, }}
				data={listData}
				keyExtractor={item => (item.name ? item.name : item.username)}
				renderItem={({ item }) => {
					if (
						(item.name && item.name.includes(channelSearch)) ||
						(item.username && item.username.includes(channelSearch))
					) {
						return (
							<TouchableOpacity
								onPress={() =>
									navigation.navigate('Room', {
										roomName: item.name ? item.name : item.username,
										username: currentUser.username,
										room_id: item.name ? item._id : [item.username, state.currentUser.username],
										roomType: item.username ? 'pm' : channelType,
									})
								}
								onLongPress={() => handleEditChannel(item)}
							>
								<ListItem
									containerStyle={styles.channel(item.username ? '#036' : color)}
									chevron
									title={item.name ? item.name : item.username}
									titleStyle={styles.title}
									leftAvatar={
										item.avatar ? (
											<View>
												<Image source={{ uri: item.avatar }} style={styles.avatarStyle} />
											</View>
										) : <Entypo name="users" size={40} color="#0af" />
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
	channel: color => ({
		height: 60,
		backgroundColor: color,
		margin: 5,
		borderRadius: 10,
	}),
	title: {
		color: 'white',
	},
	avatarStyle: {
		height: 50,
		width: 50,
		borderRadius: 25,
	},
});

export default ChannelList;
