import React from 'react';
import { Text } from 'react-native';

const WhiteText = props => {
	return <Text h3 style={[styles.textStyle, { ...props.style }]}>{props.children}</Text>;
};

const styles = { textStyle: { color: 'white', fontWeight: 'bold', fontSize: 20 } };

export default WhiteText;
