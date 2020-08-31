import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Entypo } from '@expo/vector-icons';

const UserAvatar = ({ avatar, handleClick, color = '#0af' }) => {
	return (
		<View>
			<TouchableOpacity onPress={handleClick}>
				{avatar ? (
					<Image source={{ uri: avatar }} style={styles.avatarStyle} />
				) : (
					<Entypo name="user" size={35} color="#000" />
				)}
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	avatarStyle: {
		height: 35,
		width: 35,
		borderRadius: 17,
	},
});

export default UserAvatar;
