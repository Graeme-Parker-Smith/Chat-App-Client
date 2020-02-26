import React, { useState, useContext } from 'react';
import { View, StyleSheet, Text, Dimensions, Image, TouchableOpacity, TouchableHighlight, Modal } from 'react-native';
import { Button } from 'react-native-elements';
import { Context as ChannelContext } from '../context/ChannelContext';
import { Entypo, MaterialIcons, AntDesign, Foundation } from '@expo/vector-icons';

const InviteMenu = ({ roomName }) => {
	const [modalVisible, setModalVisible] = useState(false);
	const [invitee, setInvitee] = useState('');
	const { addFriend, unblock, state, invite } = useContext(ChannelContext);

	const handleSubmit = async () => {
		await invite({ invitee, roomName });
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
									returnKeyType="submit"
									selectTextOnFocus={true}
									onSubmitEditing={handleSubmit}
								/>
								<TouchableHighlight onPress={handleSubmit}>
									<Button title="Send Invite" />
								</TouchableHighlight>
							</View>
						</View>
					</TouchableOpacity>
				</TouchableHighlight>
			</Modal>

			<TouchableOpacity style={{ alignSelf: 'center' }} onPress={() => setModalVisible(true)}>
				<MaterialIcons name="person-add" size={40} color="#0af" />
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
