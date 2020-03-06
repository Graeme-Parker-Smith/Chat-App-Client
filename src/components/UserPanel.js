import React, { useState, useContext } from 'react';
import { View, StyleSheet, Text, Dimensions, Image, TouchableOpacity, TouchableHighlight } from 'react-native';
import { Input, Button } from 'react-native-elements';
import { SafeAreaView } from 'react-navigation';
import { Context as ChannelContext } from '../context/ChannelContext';
import AvatarPicker from '../components/AvatarPicker';
import LoadingIndicator from './LoadingIndicator';
import { Entypo, MaterialIcons } from '@expo/vector-icons';
import { navigate } from '../navigationRef';

const UserPanel = ({ user, handleClick }) => {
	const onPress = () => {
		handleClick('user_dash', user);
		navigate("Dash")
	};

	if (user.avatar) {
		return (
			<TouchableOpacity onPress={onPress}>
				<View>
					<Image source={{ uri: user.avatar }} style={styles.avatarStyle} />
				</View>
			</TouchableOpacity>
		);
	} else {
		return (
			<TouchableOpacity onPress={onPress}>
				<View>
					<Entypo name="user" size={40} color="#0af" />
				</View>
			</TouchableOpacity>
		);
	}
};

const styles = StyleSheet.create({
	avatarStyle: {
		height: 50,
		width: 50,
		borderRadius: 25,
	},
});

export default UserPanel;
