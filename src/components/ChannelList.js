import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Input, Button, ListItem } from 'react-native-elements';
import { Entypo } from '@expo/vector-icons';

const ChannelList = ({ listData, channelType, navigation, currentUser, handleEditChannel, channelSearch, PMs }) => {
	let color = '#808080';
	if (channelType === 'private') color = '#301934';
	if (channelType === 'pm') color = '#036';
	return (
		<View>
			<FlatList
				style={{ marginTop: 20, height: 275, width: Dimensions.get('window').width * 0.5 }}
				data={listData}
				keyExtractor={item => item._id}
				renderItem={({ item }) => {
					if (
						(item.name && item.name.includes(channelSearch)) ||
						(item.username && item.username.includes(channelSearch))
					) {
						let Pm_id;
						if (item.username) {

						let thisPM = PMs.find(pm => pm.members.includes(item.username));
						console.log("thisPM", thisPM);
						Pm_id = thisPM._id;
						}
						return (
							<TouchableOpacity
								onPress={() =>
									navigation.navigate('Room', {
										roomName: item.name ? item.name : item.username,
										username: currentUser.username,
										// room_id: item.name ? item._id : [item.username, currentUser.username],
										room_id: item.name ? item._id : Pm_id,
										roomType: item.username ? 'pm' : channelType,
									})
								}
								onLongPress={item.name ? () => handleEditChannel(`edit_${channelType}`, item) : null}
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
										) : (
											<Entypo name="users" size={40} color="#0af" />
										)
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
