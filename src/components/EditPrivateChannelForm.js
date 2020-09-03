import React, { useState, useContext } from 'react';
import { View, StyleSheet, Image, Dimensions } from 'react-native';
import { Input, Button, Text, CheckBox } from 'react-native-elements';
import { Context as ChannelContext } from '../context/ChannelContext';
import { Context as AuthContext } from '../context/AuthContext';
import Spacer from './Spacer';
import AvatarPicker from './AvatarPicker';
import LoadingIndicator from './LoadingIndicator';
import BouncyInput from './BouncyInput';
import AreYouSure from './AreYouSure';
import WhiteText from './WhiteText';

const EditPrivateChannelForm = ({ showForm, thisName, thisAvatar, thisDescription = '', thisMature = false }) => {
	const {
		state: { currentUser, privateChannels },
		updateChannel,
		fetchChannels,
		deleteChannel,
		invite,
		reportChannel,
	} = useContext(ChannelContext);
	const [newName, setNewName] = useState(thisName);
	const [newAvatar, setNewAvatar] = useState(thisAvatar);
	// const [userSearch, setUserSearch] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [modalVisible, setModalVisible] = useState(false);
	const channelInfo = privateChannels.find((channel) => channel.name === thisName);
	const channel_id = channelInfo._id;
	const channelCreator = channelInfo.creator;
	const userCanEdit = currentUser._id === channelCreator;
	const [errMsg, setErrMsg] = useState('');
	const [description, setDescription] = useState(thisDescription)
	const [mature, setMature] = useState(thisMature);



	const handleSubmit = async () => {
		if (!userCanEdit) {
			return;
		}
		setIsLoading(true);
		const response = await updateChannel({
			username: currentUser.username,
			prevName: thisName,
			newName,
			newAvatar,
			isPrivate: true,
			newDescription: description,
			newMature: mature


		});
		if (response && response.data.error) {
			console.log('yes', response.data);
			setIsLoading(false);
			setErrMsg(response.data.error);
			return;
		}
		showForm('');
		await fetchChannels();
		setIsLoading(false);
	};

	const handleReport = async () => {
		reportChannel({
			name: thisName,
			id: channel_id,
			avatar: thisAvatar,
			description: thisDescription,
			mature: thisMature,
		})
		showForm('');
		await fetchChannels();
		setIsLoading(false);
	}

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
		showForm('');
		await deleteChannel({
			username: currentUser.username,
			roomName: thisName,
			channel_id: channel_id,
			isPrivate: true,
		});
		await fetchChannels();
	};

	if (isLoading) return <LoadingIndicator />;

	return (
		<View style={styles.container}>
			{modalVisible ? (
				<AreYouSure
					yesAction={handleDelete}
					isOwner={userCanEdit}
					modalVisible={modalVisible}
					setModalVisible={setModalVisible}
				/>
			) : null}
			<Spacer>
				<BouncyInput
					label="Edit Channel Name"
					disabled={!userCanEdit}
					value={newName}
					onChangeText={setNewName}
					autoFocus={false}
					autoCapitalize="none"
					autoCorrect={false}
					inputStyle={{ color: 'white' }}
				/>
			</Spacer>
			<Spacer />
			<CheckBox title="Mature Content Allowed?" checked={mature} onPress={() => setMature(!mature)} />
			<Spacer />
			<BouncyInput
					value={description}
					onChangeText={setDescription}
					label="Edit Description"
					placeholder="225 char max"
					inputContainerStyle={{ marginBottom: 20 }}
					inputStyle={{ color: '#fff' }}
					placeholderTextColor="#fff"
					maxLength={225}
					multiline={true}
				/>
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
				<Button
					disabled={!userCanEdit}
					buttonStyle={styles.deleteButton}
					title="Delete Channel"
					onPress={() => setModalVisible(true)}
				/>
			</View>
			{userCanEdit ? null : (
				<Button
					containerStyle={styles.button}
					buttonStyle={{ padding: 15, backgroundColor: 'red' }}
					title="Report Channel"
					onPress={handleReport}
				/>
			)}
			<View>
				{/* <Input
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
				<Button disabled={!userCanEdit} title="Invite User" onPress={handleInvite} /> */}
			</View>
			<WhiteText style={{ color: 'red' }}>{errMsg}</WhiteText>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		height: Dimensions.get('window').height,
		width: Dimensions.get('window').width,
		backgroundColor: '#000',
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
