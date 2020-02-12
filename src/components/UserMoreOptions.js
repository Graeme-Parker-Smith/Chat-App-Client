import React, { useState, useContext } from 'react';
import { View, StyleSheet, Text, Dimensions, Image, TouchableOpacity, TouchableHighlight, Modal } from 'react-native';
import { Button } from 'react-native-elements';
import { Context as ChannelContext } from '../context/ChannelContext';
import { Entypo, MaterialIcons, AntDesign, Foundation } from '@expo/vector-icons';

const UserMoreOptions = () => {
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

              <Button
				title="Add Friend"
				onPress={() =>
					addFriend({
						username: user.username,
						friendName: userSearch,
					})
				}
			/>
			<Button
				title="Remove Friend"
				onPress={() =>
					addFriend({
						username: user.username,
						friendName: userSearch,
						shouldRemove: true,
					})
				}
			/>
			<Button
				title="Block User"
				onPress={() =>
					addFriend({
						username: user.username,
						friendName: userSearch,
						shouldRemove: true,
						shouldBlock: true,
					})
				}
			/>
			<Button
				title="Unblock User"
				onPress={() =>
					unblock({
						username: user.username,
						friendName: userSearch,
					})
				}
			/>
							
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
