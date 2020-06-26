import React, { useState, useContext, useRef, useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import { Context as ChannelContext } from '../context/ChannelContext';

import FriendsList from './FriendsList';
import UserSearchList from './UserSearchList';
import PendingList from './PendingList';
import BlockedList from './BlockedList';

export default function TabViewExample() {
	const FirstRoute = () => <FriendsList user={state.currentUser} />;

	const SecondRoute = () => <UserSearchList user={state.currentUser} />;
	const ThirdRoute = () => <PendingList user={state.currentUser} />;
	const FourthRoute = () => <BlockedList user={state.currentUser} />;

	const initialLayout = { width: Dimensions.get('window').width };

	const { state } = useContext(ChannelContext);

	const [index, setIndex] = useState(0);
	const [routes] = React.useState([
		{ key: 'first', title: 'Friends' },
		{ key: 'second', title: 'Second' },
		{ key: 'third', title: 'Third' },
		{ key: 'fourth', title: 'Fourth' },
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
