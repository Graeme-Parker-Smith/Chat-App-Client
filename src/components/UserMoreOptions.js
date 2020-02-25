import React, { useState, useContext } from 'react';
import { View, StyleSheet, Text, Dimensions, Image, TouchableOpacity, TouchableHighlight, Modal } from 'react-native';
import { Button } from 'react-native-elements';
import { Context as ChannelContext } from '../context/ChannelContext';
import { Entypo, MaterialIcons, AntDesign, Foundation } from '@expo/vector-icons';

const UserMoreOptions = ({ friend }) => {
	const [modalVisible, setModalVisible] = useState(false);
	const { addFriend, unblock, state } = useContext(ChannelContext);

	const isFriend = state.currentUser.friends.some(f => f._id === friend._id);
	const isBlocked = state.currentUser.blocked.some(b => b._id === friend._id);

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
                  zIndex: 2
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

							{isFriend ? (
								<Button
									title="Remove Friend"
									onPress={() =>
										addFriend({
											username: state.currentUser.username,
											friendName: friend.username,
											shouldRemove: true,
										})
									}
								/>
							) : (
								<Button
									title="Add Friend"
									onPress={() =>
										addFriend({
											username: state.currentUser.username,
											friendName: friend.username,
										})
									}
								/>
							)}

							{isBlocked ? (
								<Button
									title="Unblock"
									onPress={() =>
										unblock({
											username: state.currentUser.username,
											friendName: friend.username,
										})
									}
								/>
							) : (
								<Button
									title="Block"
									onPress={() =>
										addFriend({
											username: state.currentUser.username,
											friendName: friend.username,
											shouldRemove: true,
											shouldBlock: true,
										})
									}
								/>
							)}
						</View>
					</TouchableOpacity>
				</TouchableHighlight>
			</Modal>

			<TouchableOpacity onPress={() => setModalVisible(true)}>
				<Entypo name="dots-three-vertical" size={20} color="black" />
			</TouchableOpacity>
		</View>
	);
};

export default UserMoreOptions;
