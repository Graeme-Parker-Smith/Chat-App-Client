import React, { useState, useContext, useRef, useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import { Context as ChannelContext } from '../context/ChannelContext';

import FriendsList from './FriendsList';
import UserSearchList from './UserSearchList';
import PendingList from './PendingList';
import BlockedList from './BlockedList';

const FirstRoute = () => <FriendsList />;

const SecondRoute = () => <View style={[styles.scene, { backgroundColor: '#673ab7' }]} />;
const SecondRoute = () => <View style={[styles.scene, { backgroundColor: '#673ab7' }]} />;
const SecondRoute = () => <View style={[styles.scene, { backgroundColor: '#673ab7' }]} />;

const initialLayout = { width: Dimensions.get('window').width };

export default function TabViewExample() {
	const { state } = useContext(ChannelContext);

	const [index, setIndex] = React.useState(0);
	const [routes] = React.useState([
		{ key: 'first', title: 'First' },
		{ key: 'second', title: 'Second' },
	]);

	const renderScene = SceneMap({
		first: FirstRoute,
		second: SecondRoute,
		third: ThirdRoute,
		fourth: FourthRoute,
	});

	return (
		<TabView
			navigationState={{ index, routes }}
			renderScene={renderScene}
			onIndexChange={setIndex}
			initialLayout={initialLayout}
		/>
	);
}

const styles = StyleSheet.create({
	scene: {
		flex: 1,
	},
});
