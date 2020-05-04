import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Dimensions, Animated } from 'react-native';
import { Input, Button, ListItem, Badge } from 'react-native-elements';
import { Entypo, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import CacheImage from './CacheImage';
import ChannelListItem from './ChannelListItem';

const MessageCount = ({ msgCount }) => (
	<View
		style={{
			position: 'absolute',
			top: 5,
			right: 80,
			// backgroundColor: 'black',
			borderRadius: 5,
			zIndex: 2,
			flexDirection: 'row',
			alignItems: 'center',
		}}
	>
		{/* <View style={{ flexDirection: 'row' }}> */}
		<MaterialCommunityIcons name="message-text" color="black" size={20} />
		<Badge
			value={msgCount >= 0 ? msgCount : null}
			badgeStyle={{ backgroundColor: msgCount >= 0 ? 'black' : 'transparent' }}
		/>
		{/* </View> */}
	</View>
);
const Fawkes = ({ userCount }) => (
	<View
		style={{
			position: 'absolute',
			top: 5,
			right: 45,
			// backgroundColor: 'black',
			borderRadius: 5,
			zIndex: 2,
			flexDirection: 'row',
			alignItems: 'center',
		}}
	>
		{/* <View style={{ flexDirection: 'row' }}> */}
		<MaterialCommunityIcons name="guy-fawkes-mask" color="black" size={20} />
		<Badge
			value={userCount >= 0 ? userCount : null}
			badgeStyle={{ backgroundColor: userCount >= 0 ? 'black' : 'transparent' }}
		/>
		{/* </View> */}
	</View>
);

const ChannelList = ({
	listData,
	channelType,
	navigation,
	currentUser,
	handleEditChannel,
	channelSearch,
	PMs,
	showLists,
}) => {
	let color = '#808080';
	if (channelType === 'private') color = '#301934';
	if (channelType === 'pm') color = '#036';
	return (
		<View>
			<FlatList
				style={{ marginTop: 0 }}
				data={listData}
				keyExtractor={(item) => item._id}
				renderItem={({ item }) => {
					if (
						(item.name && item.name.includes(channelSearch)) ||
						(item.username && item.username.includes(channelSearch))
					) {
						let Pm_id;
						if (item.username) {
							let thisPM = PMs.find((pm) => pm.members.includes(item._id));
							item.msgCount = thisPM.msgCount;
							item.userCount = thisPM.userCount;
							if (!thisPM) {
								return;
							}
							console.log('userCount', item.userCount);
							Pm_id = thisPM._id;
						}
						return (
							<TouchableOpacity
								onPress={() =>
									navigation.replace('Room', {
										roomName: item.name ? item.name : item.username,
										username: currentUser.username,
										friend: item.username ? item : null,
										// room_id: item.name ? item._id : [item.username, currentUser.username],
										room_id: item.name ? item._id : Pm_id,
										roomCreator: item.creator,
										roomType: item.username ? 'pm' : channelType,
									})
								}
								onLongPress={item.name ? () => handleEditChannel(`edit_${channelType}`, item) : null}
							>
								<MessageCount msgCount={item.msgCount ? item.msgCount : null} />
								<Fawkes userCount={item.userCount ? item.userCount : null} />
								{/* <ListItem
									// badge={<Badge value={item.msgCount ? item.msgCount : 73} />}
									// # of messages on channel in badge
									// badge={{
									// 	value: item.msgCount >= 0 ? item.msgCount : null,
									// 	badgeStyle: { backgroundColor: item.msgCount >= 0 ? '#0af' : 'transparent' },
									// }}
									// value={73}
									containerStyle={styles.channel(item.username ? '#036' : color)}
									title={item.name ? item.name : item.username}
									titleStyle={styles.title}
									rightElement={
										<TouchableOpacity
											onPress={() => console.log('Show Description!')}
											style={{ borderLeftWidth: 1, borderLeftColor: 'black' }}
										>
											<AntDesign name="caretdown" size={20} color="black" />
										</TouchableOpacity>
									}
									leftAvatar={
										item.avatar ? (
											<View>
												<CacheImage uri={item.avatar} style={styles.avatarStyle} />
											</View>
										) : (
											<Entypo name={item.username ? 'user' : 'users'} size={40} color="#0af" />
										)
									}
								/> */}
								<ChannelListItem color={color} item={item} />
							</TouchableOpacity>
						);
					}
				}}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	channel: (color) => ({
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
