import React, { useState, useContext } from 'react';
import { View, StyleSheet, Text, Dimensions, Image, TouchableOpacity, TouchableHighlight, Modal } from 'react-native';
import { Button, Input } from 'react-native-elements';
import { Context as MessageContext } from '../context/MessageContext';
import { Entypo, MaterialIcons, AntDesign, Foundation } from '@expo/vector-icons';
import BouncyInput from './BouncyInput';

const FullscreenImage = ({ source, modalVisible, setModalVisible }) => {
	return (
		<View style={{ marginTop: 0 }}>
			<Modal
				style={{
					height: Dimensions.get('window').height,
					width: Dimensions.get('window').width,
					backgroundColor: '#000',
				}}
				animationType="none"
				transparent={true}
				visible={modalVisible}
				// onRequestClose={() => {
				// 	console.log('Modal has been closed.');
				// }}
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
						onPress={() => setModalVisible(!modalVisible)}
						style={{
							height: Dimensions.get('window').height,
							width: Dimensions.get('window').width,
							backgroundColor: '#000',
							paddingTop: 5,
							paddingBottom: 5,
						}}
					>
						<View>
							{/* <View
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
							</View> */}
							{/* modal menu starts here */}
							<View style={{ flex: 1 }}>
								<Image
									source={source}
									style={{
										height: Dimensions.get('window').height,
										width: Dimensions.get('window').width,
										resizeMode: 'contain',
									}}
								/>
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

export default FullscreenImage;
