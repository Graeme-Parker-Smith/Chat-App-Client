import React, { useState, useContext } from 'react';
import { View, StyleSheet, Image, Dimensions } from 'react-native';
import { Input, Button, Text } from 'react-native-elements';
import { Context as ChannelContext } from '../context/ChannelContext';
import { Context as AuthContext } from '../context/AuthContext';
import Spacer from './Spacer';
import AvatarPicker from './AvatarPicker';
import LoadingIndicator from './LoadingIndicator';


const EditPrivateChannelForm = ({ showForm, thisName, thisAvatar }) => {
	const {
		state: { currentUser, privateChannels },
		updateChannel,
    fetchChannels,
    deleteChannel,
		invite,
	} = useContext(ChannelContext);
	const { tryLocalSignin } = useContext(AuthContext);
	const [newName, setNewName] = useState(thisName);
	const [newAvatar, setNewAvatar] = useState(thisAvatar);
  const [userSearch, setUserSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
	console.log(thisName);
	console.log(thisAvatar);
	const channelInfo = privateChannels.find(channel => channel.name === thisName);
	const channel_id = channelInfo._id;
	console.log('channel_id', channel_id);
	const channelCreator = channelInfo.creator;
	console.log('channelCreator', channelCreator);
	const userCanEdit = currentUser.username === channelCreator;

	const handleSubmit = async () => {
		if (!userCanEdit) {
			return;
		}
		setIsLoading(true);
		await updateChannel({
			username: currentUser.username,
			prevName: thisName,
			newName,
			newAvatar,
			private: true,
		});
		showForm('');
		await fetchChannels();
		setIsLoading(false);
	};

	const cancelForm = () => {
		showForm('');
	};

	const handleInvite = async () => {
		if (!userCanEdit) {
			return;
		}
		setIsLoading(true);
		await invite({ invitee: userSearch, roomName: thisName });
		showForm({
			showForm: false,
			roomName: '',
			avatar: '',
		});
		await fetchChannels();
		setIsLoading(false);
	};

	const handleDelete = async () => {
		if (!userCanEdit) {
			return;
		}
		// setIsLoading(true);
    showForm('');
		await deleteChannel({
			username: currentUser.username,
			roomName: thisName,
      channel_id: channel_id,
      isPrivate: true
		});
		await fetchChannels();
		// setIsLoading(false);
  };
  
  if (isLoading) return <LoadingIndicator />;


	return (
		<View style={styles.container}>
			<Text style={{ color: 'white' }}>Edit Private Channel Info</Text>
			<Spacer>
				<Input
					label="Edit Channel Name"
					disabled={!userCanEdit}
					value={newName}
					onChangeText={setNewName}
					autoFocus={true}
					autoCapitalize="none"
					autoCorrect={false}
					inputStyle={{ color: 'white' }}
				/>
			</Spacer>
			<AvatarPicker avatar={newAvatar} setAvatar={setNewAvatar} whichForm={'Channel'} />
			<Spacer />
			<View style={styles.buttonRow}>
				<Button
					disabled={!userCanEdit}
					buttonStyle={styles.button}
					title="Update Channel Info"
					onPress={handleSubmit}
				/>
				<Button buttonStyle={styles.button} title="Cancel" onPress={cancelForm} />
			</View>
			<View>
				<Input
					disabled={!userCanEdit}
					label="Invite Users"
					value={userSearch}
					onChangeText={setUserSearch}
					autoCapitalize="none"
					autoCorrect={false}
					inputStyle={{ color: 'white' }}
					returnKeyType="send"
					selectTextOnFocus={true}
				/>
				<Button disabled={!userCanEdit} title="Invite User" onPress={handleInvite} />
				<Button
					disabled={!userCanEdit}
					buttonStyle={styles.deleteButton}
					title="Delete Channel"
					onPress={handleDelete}
				/>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		height: Dimensions.get('window').height,
		width: Dimensions.get('window').width,
		backgroundColor: '#301934',
	},
	button: {
		padding: 10,
  },
  deleteButton: {
		padding: 10,
		backgroundColor: 'red',
	},
	buttonRow: {
		flexDirection: 'row',
		justifyContent: 'space-around',
	},
});

export default EditPrivateChannelForm;
