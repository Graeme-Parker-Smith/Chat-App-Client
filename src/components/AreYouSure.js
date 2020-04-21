import React, { useState, useContext } from 'react';
import { View, StyleSheet, Text, Dimensions, Image, TouchableOpacity, TouchableHighlight, Modal } from 'react-native';
import { Button, Input } from 'react-native-elements';
import { Context as MessageContext } from '../context/MessageContext';
import { Entypo, MaterialIcons, AntDesign, Foundation } from '@expo/vector-icons';
import BouncyInput from './BouncyInput';

const AreYouSure = ({ yesAction, isOwner, modalVisible, setModalVisible }) => {
	const handleSubmit = async () => {
		if (!isOwner) return;
		yesAction();
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
						style={{ width: 150, backgroundColor: '#000', paddingTop: 5, paddingBottom: 5 }}
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
							<View style={{ flexDirection: 'row' }}>
								<TouchableHighlight>
									<Button title="YES" onPress={handleSubmit} />
								</TouchableHighlight>
								<TouchableHighlight>
									<Button
										buttonStyle={{ backgroundColor: 'red' }}
										title="NO"
										onPress={() => setModalVisible(false)}
									/>
								</TouchableHighlight>
							</View>
						</View>
					</TouchableOpacity>
				</TouchableHighlight>
			</Modal>
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

export default AreYouSure;
