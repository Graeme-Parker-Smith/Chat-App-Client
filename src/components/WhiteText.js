import React from 'react';
import { Text } from 'react-native';

const WhiteText = props => {
	return <Text style={styles.textStyle}>{props.children}</Text>;
};

const styles = { textStyle: { color: 'white' } };

export default WhiteText;
