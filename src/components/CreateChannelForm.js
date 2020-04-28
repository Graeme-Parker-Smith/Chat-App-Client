import React, { useState, useContext } from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import { Input, Button, CheckBox } from 'react-native-elements';
import { SafeAreaView } from 'react-navigation';
import { Context as ChannelContext } from '../context/ChannelContext';
import AvatarPicker from '../components/AvatarPicker';
import LoadingIndicator from './LoadingIndicator';
import BouncyInput from './BouncyInput';
import WhiteText from './WhiteText';

const CreateChannelForm = ({ showForm }) => {
	const [newChannelName, setNewChannelName] = useState('');
	const { state, createChannel } = useContext(ChannelContext);
	const [avatar, setAvatar] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [lifespan, setLifespan] = useState('');
	const [msgLife, setMsgLife] = useState('');
	const [errMsg, setErrMsg] = useState('');

	const cancelForm = () => {
		showForm(false);
	};

	const handleSubmit = async () => {
		if (!newChannelName) return;
		setIsLoading(true);
		const response = await createChannel({
			name: newChannelName,
			creator: state.currentUser.username,
			avatar: avatar.base64Uri,
			lifespan: lifespan > 0 ? parseInt(lifespan) : null,
			msgLife: msgLife > 0 ? parseInt(msgLife) : null,
		});
		if (response && response.data.error) {
			console.log("yes", response.data);
			setIsLoading(false);
			setErrMsg(response.data.error);
			return;
		}
		setNewChannelName('');
		setLifespan(0);
		setIsLoading(false);
		showForm(false);
	};

	if (isLoading) return <LoadingIndicator />;

	return (
		<SafeAreaView forceInset={{ top: 'always' }} style={styles.container}>
			<BouncyInput
				value={newChannelName}
				onChangeText={setNewChannelName}
				label="Name Your New Public Channel"
				placeholder="(Required)"
				inputContainerStyle={{ marginBottom: 20 }}
				inputStyle={{ color: '#fff' }}
				placeholderTextColor="#fff"
				autoFocus={true}
				maxLength={22}
			/>
			<BouncyInput
				value={String(lifespan)}
				onChangeText={setLifespan}
				keyboardType="numeric"
				selectTextOnFocus={true}
				label="# in Minutes Before Channel is Deleted."
				placeholder="Forever"
				inputContainerStyle={{ marginBottom: 20 }}
				inputStyle={{ color: '#fff' }}
				placeholderTextColor="#fff"
				maxLength={22}
			/>
			<BouncyInput
				value={String(msgLife)}
				onChangeText={setMsgLife}
				keyboardType="numeric"
				selectTextOnFocus={true}
				label="# in Minutes Before Each Message is Deleted."
				placeholder="Forever"
				inputContainerStyle={{ marginBottom: 20 }}
				inputStyle={{ color: '#fff' }}
				placeholderTextColor="#fff"
				maxLength={22}
			/>
			<AvatarPicker avatar={avatar} setAvatar={setAvatar} whichForm={'Channel'} />
			<View style={styles.buttonRow}>
				<Button
					buttonStyle={styles.button}
					disabled={!newChannelName}
					title="Create New Channel"
					onPress={handleSubmit}
				/>
				<Button buttonStyle={styles.button} title="Cancel" onPress={cancelForm} />
			</View>
			<WhiteText style={{ color: 'red' }}>{errMsg}</WhiteText>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		height: Dimensions.get('window').height,
		backgroundColor: '#000',
	},
	button: {
		padding: 10,
	},
	buttonRow: {
		flexDirection: 'row',
		justifyContent: 'space-around',
	},
});

export default CreateChannelForm;
