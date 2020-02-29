import React, { useState, useContext } from 'react';
import { View, StyleSheet, Text, Dimensions, Image, TouchableOpacity, TouchableHighlight, Modal } from 'react-native';
import { Button, Input } from 'react-native-elements';
import { Context as MessageContext } from '../context/MessageContext';
import { Entypo, MaterialIcons, AntDesign, Foundation } from '@expo/vector-icons';

const EditMessageForm = ({ isOwner, currentContent, editMessageVisible, setEditMessageVisible }) => {
	const { updateMessage } = useContext(MessageContext);
	const [content, setContent] = useState(currentContent);

	const handleSubmit = async () => {
		await updateMessage({ currentContent, newContent: content });
		console.log('message edited');
		setEditMessageVisible(false);
	};

	return (
		<View style={{ marginTop: 0 }}>
			<Modal
				style={{ width: 50, height: 50 }}
				animationType="slide"
				transparent={true}
				visible={editMessageVisible}
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
					onPress={() => setEditMessageVisible(!editMessageVisible)}
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
										setEditMessageVisible(!editMessageVisible);
									}}
								>
									<MaterialIcons
										name="cancel"
										size={30}
										color="red"
										onPress={() => setEditMessageVisible(!editMessageVisible)}
									/>
								</TouchableHighlight>
							</View>
							{/* modal menu starts here */}
							<View>
								<Input
									disabled={!isOwner}
									label="Message Content"
									value={content}
									onChangeText={setContent}
									autoFocus={true}
									autoCapitalize="none"
									autoCorrect={false}
									inputStyle={{ color: 'white' }}
									returnKeyType="send"
									selectTextOnFocus={true}
									onSubmitEditing={handleSubmit}
								/>
								<TouchableHighlight>
									<Button disabled={!isOwner} title="Update Message" onPress={handleSubmit} />
								</TouchableHighlight>
							</View>
						</View>
					</TouchableOpacity>
				</TouchableHighlight>
			</Modal>

			<TouchableOpacity style={{ alignSelf: 'center' }} onPress={() => setEditMessageVisible(true)}>
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

export default EditMessageForm;
