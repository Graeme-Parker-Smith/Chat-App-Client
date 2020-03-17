import React, { useState, useContext } from 'react';
import { View, StyleSheet, Text, Dimensions, Image, TouchableOpacity, TouchableHighlight, Modal } from 'react-native';
import { Button, Input } from 'react-native-elements';
import { Context as ChannelContext } from '../context/ChannelContext';
import { Entypo, MaterialIcons, MaterialCommunityIcons, AntDesign, Foundation } from '@expo/vector-icons';

const InviteMenu = ({ roomName }) => {
	const [modalVisible, setModalVisible] = useState(false);
	const [invitee, setInvitee] = useState('');
	const [removee, setRemovee] = useState('');
	const { addFriend, unblock, state, invite, kick } = useContext(ChannelContext);

	const handleSubmit = async () => {
		await invite({ invitee, roomName });
		setModalVisible(false);
	};

	const handleKick = async () => {
		await kick({ removee, roomName });
		setModalVisible(false);
	};

	return (
		<View style={{ marginTop: 0 }}>
			<Modal
				style={{ width: 50, height: 50 }}
				animationType="slide"
				transparent={true}
				visible={modalVisible}
				onRequestClose={() => {
					console.log('Modal has been closed.');
				}}
			>
				<TouchableHighlight
					style={{
						flex: 1,
						flexDirection: 'column',
						justifyContent: 'center',
						alignItems: 'center',
						backgroundColor: '#00000080',
					}}
					onPress={() => setModalVisible(!modalVisible)}
				>
					<TouchableOpacity
						activeOpacity={1}
						onPress={() => console.log('Pressed inside modal!')}
						style={{ width: 150, height: 110, backgroundColor: '#000', paddingTop: 5, paddingBottom: 5 }}
					>
						<View>
							<View
								style={{
									position: 'absolute',
									top: -15,
									right: -15,
									backgroundColor: 'black',
									borderRadius: 20,
									zIndex: 2,
								}}
							>
								<TouchableHighlight
									onPress={() => {
										setModalVisible(!modalVisible);
									}}
								>
									<MaterialIcons
										name="cancel"
										size={30}
										color="red"
										onPress={() => setModalVisible(!modalVisible)}
									/>
								</TouchableHighlight>
							</View>
							{/* modal menu starts here */}
							<View>
								<Input
									label="invitee"
									value={invitee}
									onChangeText={setInvitee}
									autoFocus={true}
									autoCapitalize="none"
									autoCorrect={false}
									inputStyle={{ color: 'white' }}
									returnKeyType="send"
									selectTextOnFocus={true}
									onSubmitEditing={handleSubmit}
								/>
								<TouchableHighlight>
									<Button disabled={!invitee} title="Send Invite" onPress={handleSubmit} />
								</TouchableHighlight>
								<Input
									label="Kick User"
									value={removee}
									onChangeText={setRemovee}
									autoFocus={true}
									autoCapitalize="none"
									autoCorrect={false}
									inputStyle={{ color: 'white' }}
									returnKeyType="send"
									selectTextOnFocus={true}
									onSubmitEditing={handleKick}
								/>
								<TouchableHighlight>
									<Button disabled={!removee} title="Kick User" onPress={handleKick} />
								</TouchableHighlight>
							</View>
						</View>
					</TouchableOpacity>
				</TouchableHighlight>
			</Modal>

			<TouchableOpacity style={{ alignSelf: 'center' }} onPress={() => setModalVisible(true)}>
				<MaterialCommunityIcons name="account-star" size={40} color="#0af" />
			</TouchableOpacity>
		</View>
	);
};

const styles = {
	modalButton: {
		margin: 10,
		marginTop: 5,
		marginBottom: 5,
	},
};

export default InviteMenu;
