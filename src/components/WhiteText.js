import React from 'react';
import { Text } from 'react-native';

const WhiteText = props => {
	return <Text h3 style={[styles.textStyle, { ...props.styles, fontSize: props.fontSize }]}>{props.children}</Text>;
};

const styles = { textStyle: { color: 'white' } };

export default WhiteText;
