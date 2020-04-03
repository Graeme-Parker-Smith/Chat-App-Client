import React, { useState, useContext } from 'react';
import { View, StyleSheet, Text, Dimensions, Image, TouchableOpacity, TouchableHighlight, Modal } from 'react-native';
import { Button, Input } from 'react-native-elements';
import { Context as MessageContext } from '../context/MessageContext';
import { Entypo, MaterialIcons, AntDesign, Foundation } from '@expo/vector-icons';
import BouncyInput from './BouncyInput';

const EditMessageForm = ({ isOwner, itemId, currentContent, editMessageVisible, setEditMessageVisible, channelId }) => {
	const { updateMessage, deleteMessage, fetchMessages } = useContext(MessageContext);
	const [content, setContent] = useState(currentContent);

	const handleSubmit = async () => {
		if (!isOwner) return;
		await updateMessage({ currentContent, newContent: content, itemId });
		console.log('message edited');
		setEditMessageVisible(false);
		await fetchMessages(undefined, undefined, channelId);
	};

	const handleDelete = async () => {
		console.log('pressed Delete Button. isOwner?: ', isOwner);
		if (!isOwner) return;
		// console.log('itemId', itemId);
		await deleteMessage({ itemId });
		console.log('message deleted!');
		setEditMessageVisible(false);
		await fetchMessages(undefined, undefined, channelId);
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
								<BouncyInput
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
								<TouchableHighlight>
									<Button
										disabled={!isOwner}
										buttonStyle={{ backgroundColor: 'red' }}
										title="Delete Message"
										onPress={handleDelete}
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

export default EditMessageForm;
