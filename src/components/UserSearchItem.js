import React, { useState, useContext } from 'react';
import { View, StyleSheet, Text, Dimensions, Image, TouchableOpacity, TouchableHighlight } from 'react-native';
import { Input, Button, ListItem } from 'react-native-elements';
import { SafeAreaView } from 'react-navigation';
import { Context as ChannelContext } from '../context/ChannelContext';
import AvatarPicker from '../components/AvatarPicker';
import UserAvatar from './UserAvatar';
import LoadingIndicator from './LoadingIndicator';
import { Entypo, MaterialIcons, AntDesign } from '@expo/vector-icons';
import UserInteractButton from './UserInteractButton';
import UserMoreOptions from './UserMoreOptions';
import Spacer from './Spacer';

const UserSearchItem = ({ friend, showPanel, currentUser }) => {
	const handleClick = () => {
		showPanel('user_dash', friend);
	};
	let status;
	if (currentUser.friends.some((f) => f._id === friend._id)) status = 'added';
	else if (currentUser.pending.some((f) => f._id === friend._id)) status = 'pending';
	else status = 'add';

	return (
		<Spacer>
			<ListItem
				containerStyle={styles.container}
				title={friend.username}
				leftAvatar={<UserAvatar avatar={friend.avatar} handleClick={showPanel} />}
				rightIcon={<UserInteractButton friendName={friend.username} status={status} />}
				rightElement={<UserMoreOptions friend={friend} />}
			/>
		</Spacer>
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
