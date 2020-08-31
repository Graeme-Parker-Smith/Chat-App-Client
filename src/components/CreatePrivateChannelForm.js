import React, { useState, useContext } from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import { Input, Button, CheckBox } from 'react-native-elements';
import { SafeAreaView } from 'react-navigation';
import { Context as ChannelContext } from '../context/ChannelContext';
import AvatarPicker from '../components/AvatarPicker';
import LoadingIndicator from './LoadingIndicator';
import BouncyInput from './BouncyInput';
import WhiteText from './WhiteText';
import Spacer from './Spacer';
import ScrollWithKeyboard from './ScrollWithKeyboard';

const CreatePrivateChannelForm = ({ showForm }) => {
	const [newChannelName, setNewChannelName] = useState('');
	const [description, setDescription] = useState('');
	const { state, createPrivateChannel } = useContext(ChannelContext);
	const [avatar, setAvatar] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [lifespan, setLifespan] = useState('');
	const [msgLife, setMsgLife] = useState('');
	const [errMsg, setErrMsg] = useState('');
	const [mature, setMature] = useState(false);

	const cancelForm = () => {
		showForm(false);
	};

	const handleSubmit = async () => {
		if (!newChannelName) return;
		setIsLoading(true);
		const response = await createPrivateChannel({
			name: newChannelName,
			creator: state.currentUser.username,
			avatar: avatar.base64Uri,
			description,
			lifespan: lifespan > 0 ? parseInt(lifespan) : undefined,
			msgLife: msgLife > 0 ? parseInt(msgLife) : null,
			mature,
		});
		setIsLoading(false);
		if (response && response.data.error) {
			console.log('yes', response.data);
			setErrMsg(response.data.error);
			return;
		}
		setNewChannelName('');
		setLifespan(0);
		showForm(false);
	};

	if (isLoading) return <LoadingIndicator />;

	return (
		<SafeAreaView forceInset={{ top: 'always' }} style={styles.container}>
			<ScrollWithKeyboard>
				<BouncyInput
					value={newChannelName}
					onChangeText={setNewChannelName}
					label="Name Your New Private Channel"
					placeholder="(Required)"
					inputContainerStyle={{ marginBottom: 20 }}
					inputStyle={{ color: '#fff' }}
					placeholderTextColor="#fff"
					autoFocus={false}
					maxLength={22}
				/>
				<View style={{ flexDirection: 'row' }}>
					<BouncyInput
						value={String(lifespan)}
						onChangeText={setLifespan}
						keyboardType="numeric"
						selectTextOnFocus={true}
						label="Channel Life in mins."
						placeholder="Forever"
						inputContainerStyle={{ marginBottom: 20, width: Dimensions.get('window').width * 0.45 }}
						inputStyle={{ color: '#fff' }}
						placeholderTextColor="#fff"
						maxLength={22}
						containerStyle={{}}
					/>
					<BouncyInput
						value={String(msgLife)}
						onChangeText={setMsgLife}
						keyboardType="numeric"
						selectTextOnFocus={true}
						label="Msg Life in mins."
						placeholder="Forever"
						inputContainerStyle={{ marginBottom: 20, width: Dimensions.get('window').width * 0.45 }}
						inputStyle={{ color: '#fff' }}
						placeholderTextColor="#fff"
						maxLength={22}
						containerStyle={{}}
					/>
				</View>
				<CheckBox title="Mature Content Allowed?" checked={mature} onPress={() => setMature(!mature)} />
				<Spacer />
				<BouncyInput
					value={description}
					onChangeText={setDescription}
					label="Add A Description For Your Channel"
					placeholder="(Optional. 225 char max.)"
					inputContainerStyle={{ marginBottom: 20 }}
					inputStyle={{ color: '#fff' }}
					placeholderTextColor="#fff"
					maxLength={225}
					multiline={true}
				/>
				<Spacer />
				<AvatarPicker avatar={avatar} setAvatar={setAvatar} whichForm={'Channel'} />
				<Spacer />
				<View style={styles.buttonRow}>
					<Button
						disabled={!newChannelName}
						buttonStyle={styles.button}
						title="Create New Private Channel"
						onPress={handleSubmit}
					/>
					<Button buttonStyle={styles.button} title="Cancel" onPress={cancelForm} />
				</View>
				<Spacer />
				<WhiteText style={{ color: 'red' }}>{errMsg}</WhiteText>
			</ScrollWithKeyboard>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#301934',
	},
	button: {
		padding: 10,
	},
	buttonRow: {
		flexDirection: 'row',
		justifyContent: 'space-around',
	},
});

export default CreatePrivateChannelForm;
