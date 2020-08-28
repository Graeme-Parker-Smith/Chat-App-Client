import React, { useState, useContext, useRef, useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { Context as ChannelContext } from '../context/ChannelContext';
import UserAvatar from '../components/UserAvatar';
import { FontAwesome, Entypo, MaterialCommunityIcons } from '@expo/vector-icons';

import FriendsList from './FriendsList';
import UserSearchList from './UserSearchList';
import PendingList from './PendingList';
import BlockedList from './BlockedList';
import EditUserForm from './EditUserForm';

export default function TabViewExample() {
	const FirstRoute = () => <UserSearchList user={state.currentUser} />;

	const SecondRoute = () => <FriendsList user={state.currentUser} />;
	const ThirdRoute = () => <PendingList user={state.currentUser} />;
	const FourthRoute = () => <BlockedList user={state.currentUser} />;
	const FifthRoute = () => <EditUserForm user={state.currentUser} />;

	const initialLayout = { width: Dimensions.get('window').width };

	const { state } = useContext(ChannelContext);

	const [index, setIndex] = useState(0);
	const [routes] = React.useState([
		{ key: 'first' },
		{ key: 'second' },
		{ key: 'third' },
		{ key: 'fourth' },
		{ key: 'fifth', icon: <UserAvatar avatar={state.currentUser.avatar} color="#000" /> },
	]);

	const renderScene = SceneMap({
		first: FirstRoute,
		second: SecondRoute,
		third: ThirdRoute,
		fourth: FourthRoute,
		fifth: FifthRoute,
	});

	const getTabBarIcon = (props) => {
		const { route } = props;

		if (route.key === 'fifth') {
			return <UserAvatar avatar={state.currentUser.avatar} />;
		} else if (route.key === 'first') {
			return <FontAwesome name="search" size={32} color="#000" />;
		} else if (route.key === 'second') {
			return <MaterialCommunityIcons name="emoticon-happy" size={32} color="#000" />;
		} else if (route.key === 'third') {
			return <MaterialCommunityIcons name="progress-clock" size={32} color="#000" />;
		} else if (route.key === 'fourth') {
			return <Entypo name="block" size={32} color="#000" />;
		}
	};

	return (
		<TabView
			navigationState={{ index, routes }}
			renderScene={renderScene}
			onIndexChange={setIndex}
			initialLayout={initialLayout}
			swipeEnabled={false}
			renderTabBar={(props) => (
				<TabBar
					{...props}
					indicatorStyle={{ backgroundColor: 'red' }}
					renderIcon={(props) => getTabBarIcon(props)}
					tabStyle={styles.bubble}
					labelStyle={styles.noLabel}
				/>
			)}
			// style={{width: Dimensions.get('window').width * 0.9}}
		/>
	);
}

const styles = StyleSheet.create({
	scene: {
		flex: 1,
	},
});
