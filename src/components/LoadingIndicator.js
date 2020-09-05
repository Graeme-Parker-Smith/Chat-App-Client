import React from 'react';
import { View, ActivityIndicator, StyleSheet, Dimensions } from 'react-native';

const LoadingIndicator = () => {
	return (
		<View style={{ height: Dimensions.get('window').height * 0.8 }}>
			<View style={styles.container}>
				<ActivityIndicator size="large" color="#0af" />
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		// height: 500,
		// width: 500,

		backgroundColor: 'black',
		justifyContent: 'center',
		alignItems: 'center',
	},
});

export default LoadingIndicator;
