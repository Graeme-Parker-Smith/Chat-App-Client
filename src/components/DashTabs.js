import React, { useState, useContext, useRef, useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { Context as ChannelContext } from '../context/ChannelContext';
import UserAvatar from '../components/UserAvatar';

import FriendsList from './FriendsList';
import UserSearchList from './UserSearchList';
import PendingList from './PendingList';
import BlockedList from './BlockedList';
import EditUserScreen from '../screens/EditUserScreen';

export default function TabViewExample() {
	const FirstRoute = () => <UserSearchList user={state.currentUser} />;

	const SecondRoute = () => <FriendsList user={state.currentUser} />;
	const ThirdRoute = () => <PendingList user={state.currentUser} />;
	const FourthRoute = () => <BlockedList user={state.currentUser} />;
	const FifthRoute = () => <EditUserScreen user={state.currentUser} />

	const initialLayout = { width: Dimensions.get('window').width };

	const { state } = useContext(ChannelContext);

	const [index, setIndex] = useState(0);
	const [routes] = React.useState([
		{ key: 'first', title: 'Search' },
		{ key: 'second', title: 'Friends' },
		{ key: 'third', title: 'Pending' },
		{ key: 'fourth', title: 'Blocked' },
		{ key: 'fifth', icon: <UserAvatar avatar={state.currentUser.avatar} />}
	]);

	const renderScene = SceneMap({
		first: FirstRoute,
		second: SecondRoute,
		third: ThirdRoute,
		fourth: FourthRoute,
		fifth: FifthRoute
	});

	const getTabBarIcon = (props) => {

    const {route} = props

      if (route.key === 'fifth') {

       return <UserAvatar avatar={state.currentUser.avatar} />

      } else {

       return 

      }
}

	return (
		<TabView
			navigationState={{ index, routes }}
			renderScene={renderScene}
			onIndexChange={setIndex}
			initialLayout={initialLayout}
			swipeEnabled={false}
			renderTabBar={props =>
				<TabBar
						{...props}
						indicatorStyle={{backgroundColor: 'red'}}
						renderIcon={
								props => getTabBarIcon(props)
						}
						tabStyle={styles.bubble}
						labelStyle={styles.noLabel}
				/>
		}
			// style={{width: Dimensions.get('window').width * 0.9}}
		/>
	);
}

const styles = StyleSheet.create({
	scene: {
		flex: 1,
	},
});
