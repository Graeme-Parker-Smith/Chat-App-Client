import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { Input, Button, ListItem } from 'react-native-elements';

const ChannelList = ({ listData, channelType, navigation, currentUser, handleEditChannel, channelSearch }) => {
	let color = '#808080';
	if (channelType === 'private') color = '#301934';
	if (channelType === 'pm') color = '#036';

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
									navigation.navigate('Room', {
										roomName: channelType === 'pm' ? item.username : item.name,
										username: currentUser.username,
										room_id:
											channelType === 'pm'
												? [item.username, state.currentUser.username]
												: item._id,
										roomType: channelType,
									})
								}
								onLongPress={() => handleEditChannel(item)}
							>
								<ListItem
									containerStyle={styles.channel(color)}
									chevron
									title={item.name}
									titleStyle={styles.title}
									leftAvatar={
										item.avatar ? (
											<View>
												<Image source={{ uri: item.avatar }} style={styles.avatarStyle} />
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
	channel: color => ({
		height: 60,
		backgroundColor: color,
		backgroundColor: '#808080',
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
