import React, { useState, useContext } from 'react';
import { View, StyleSheet, Text, Dimensions, Image, TouchableOpacity, TouchableHighlight, Modal } from 'react-native';
import { Button } from 'react-native-elements';
import { Context as ChannelContext } from '../context/ChannelContext';
import { Entypo, MaterialIcons, AntDesign, Foundation } from '@expo/vector-icons';

const InviteUserForm = ({ friend }) => {
	const [modalVisible, setModalVisible] = useState(false);
	const { addFriend, unblock, state } = useContext(ChannelContext);

	return (
		<View style={{ marginTop: 0 }}>
			<Modal
				style={{ width: 50, height: 50 }}
				animationType="slide"
				transparent={true}
				visible={modalVisible}
				onRequestClose={() => {
					Alert.alert('Modal has been closed.');
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
						style={{ width: 100, height: 100, backgroundColor: '#fff' }}
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

							<Input />

              <Button />
						</View>
					</TouchableOpacity>
				</TouchableHighlight>
			</Modal>

			<TouchableOpacity onPress={() => setModalVisible(true)}>
				<MaterialIcon name="add-user" size={20} color="#0af" />
			</TouchableOpacity>
		</View>
	);
};

export default InviteUserForm;
