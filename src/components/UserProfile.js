import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, Text, Dimensions, Image, TouchableOpacity, TouchableHighlight, Modal } from 'react-native';
import SocketContext from '../context/SocketContext';
import { Context as ChannelContext } from '../context/ChannelContext';
import { Button, Input } from 'react-native-elements';
import { Context as MessageContext } from '../context/MessageContext';
import { Entypo, MaterialIcons, AntDesign, Foundation } from '@expo/vector-icons';
import BouncyInput from './BouncyInput';
import Spacer from './Spacer';
import WhiteText from './WhiteText';

const UserProfile = ({ username, source, modalVisible, setModalVisible }) => {
	const socket = useContext(SocketContext);
	const { addFriend, unblock, state } = useContext(ChannelContext);
	const [searchResults, setSearchResults] = useState([]);
	const [friendState, setFriendState] = useState(null);

	let isFriend;
	let isPending;
	let isBlocked;

	useEffect(() => {
		socket.on('usersearch', ({ results }) => {
			setSearchResults(results[0]);
			console.log('friend._id is: ', results[0]._id);
			if (state.currentUser.friends.some((f) => f._id === results[0]._id)) {
				setFriendState('isFriend');
			} else if (state.currentUser.pending.some((f) => f._id === results[0]._id)) {
				setFriendState('isPending');
			} else if (state.currentUser.blocked.some((b) => b._id === results[0]._id)) {
				setFriendState('isBlocked');
			}
		});
	}, [state, searchResults]);

	// useEffect(() => {
	// 	socket.emit('usersearch', { currentUser: state.currentUser, searchKey: username });
	// }, []);

	const fetchUserInfo = () => {
		console.log('FETCH user info!', username);
	};
	console.log('image source is: ', source);

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
				onShow={() => {
					socket.emit('usersearch', { currentUser: state.currentUser, searchKey: username });
				}}
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
									source={{ uri: source }}
									style={{
										height: 200,
										width: 200,
										resizeMode: 'contain',
										alignSelf: 'center',
									}}
								/>
								<View style={styles.userBox}>
									<WhiteText>{username}</WhiteText>
									{searchResults ? (
										<>
											<WhiteText>Created:{searchResults.createdAt}</WhiteText>
											<WhiteText>Score: {searchResults.msgsSent}</WhiteText>

											{friendState === 'isFriend' || friendState === 'isPending' ? (
												<Button
													containerStyle={styles.modalButton}
													buttonStyle={{ padding: 15 }}
													title={
														friendState === 'isFriend' ? 'Remove Friend' : 'Cancel Request'
													}
													onPress={() =>
														addFriend({
															username: state.currentUser.username,
															friendName: searchResults.username,
															shouldRemove: true,
														})
													}
												/>
											) : (
												<Button
													containerStyle={styles.modalButton}
													buttonStyle={{ padding: 15 }}
													title="Add Friend"
													onPress={() =>
														addFriend({
															username: state.currentUser.username,
															friendName: searchResults.username,
														})
													}
												/>
											)}
											<Spacer />

											{friendState === 'isBlocked' ? (
												<Button
													containerStyle={styles.modalButton}
													buttonStyle={{ padding: 15 }}
													title="Unblock"
													onPress={() =>
														unblock({
															username: state.currentUser.username,
															friendName: searchResults.username,
														})
													}
												/>
											) : (
												<Button
													containerStyle={styles.modalButton}
													buttonStyle={{ padding: 15 }}
													title="Block"
													onPress={() =>
														addFriend({
															username: state.currentUser.username,
															friendName: searchResults.username,
															shouldRemove: true,
															shouldBlock: true,
														})
													}
												/>
											)}
										</>
									) : null}
								</View>
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
		padding: 5,
	},
	userBox: {
		marginTop: 0,
		alignSelf: 'center',
	},
};

export default UserProfile;
