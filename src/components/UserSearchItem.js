import React, { useState, useContext } from 'react';
import { View, StyleSheet, Text, Dimensions, Image, TouchableOpacity, TouchableHighlight } from 'react-native';
import { Input, Button, ListItem } from 'react-native-elements';
import { SafeAreaView } from 'react-navigation';
import { Context as ChannelContext } from '../context/ChannelContext';
import AvatarPicker from '../components/AvatarPicker';
import UserAvatar from './UserAvatar';
import LoadingIndicator from './LoadingIndicator';
import { Entypo, MaterialIcons } from '@expo/vector-icons';

const UserSearchItem = ({ user, showPanel }) => {
	const handleClick = () => {
		showPanel('user_dash', user);
	};
	// console.log('UserSearchItem user', user);

	return (
		<ListItem
			containerStyle={styles.container}
			title={user.username}
			leftAvatar={<UserAvatar avatar={user.avatar} handleClick={showPanel} />}
		/>
	);
};

const styles = StyleSheet.create({
	container: {
		// width: Dimensions.get('window').width * 0.8,
		marginLeft: 10,
		marginRight: 10,
		backgroundColor: '#adaba3',
		borderWidth: 1,
		borderColor: '#808080',
		borderRadius: 10,
	},
});

export default UserSearchItem;
