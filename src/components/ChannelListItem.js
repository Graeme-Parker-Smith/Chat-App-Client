import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ListItem } from 'react-native-elements';
import { AntDesign, Entypo } from '@expo/vector-icons';
import CacheImage from './CacheImage';

const ChannelListItem = ({ item, color }) => {
	const [showDescription, setShowDescription] = useState(false);

	return (
		<ListItem
			// badge={<Badge value={item.msgCount ? item.msgCount : 73} />}
			// # of messages on channel in badge
			// badge={{
			// 	value: item.msgCount >= 0 ? item.msgCount : null,
			// 	badgeStyle: { backgroundColor: item.msgCount >= 0 ? '#0af' : 'transparent' },
			// }}
			// value={73}
			containerStyle={[styles.channel(item.username ? '#036' : color), { height: showDescription ? 120 : 60 }]}
			title={item.name ? item.name : item.username}
			titleStyle={styles.title}
			rightElement={
				<TouchableOpacity
					onPress={() => setShowDescription(!showDescription)}
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
		/>
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

export default ChannelListItem;
