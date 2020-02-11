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

	return <ListItem title={user.username} leftAvatar={<UserAvatar avatar={user.avatar} handleClick={showPanel} />} />;
};

const styles = StyleSheet.create({
	avatarStyle: {
		height: 50,
		width: 50,
		borderRadius: 25,
	},
});

export default UserSearchItem;
