import React from 'react';
import { Image, TouchableOpacity, View, Dimensions } from 'react-native';
import shorthash from 'shorthash';
import * as FileSystem from 'expo-file-system';
import FullscreenImage from '../components/FullscreenImage';

export default class CacheImage extends React.Component {
	state = {
		source: null,
		active: false,
		modalVisible: false
	};

	componentDidMount = async () => {
		const { uri } = this.props;
		const name = shorthash.unique(uri);
		const path = `${FileSystem.cacheDirectory}${name}`;
		const image = await FileSystem.getInfoAsync(path);
		if (image.exists) {
			this.setState({
				source: {
					uri: image.uri,
				},
			});
			return;
		}

		const newImage = await FileSystem.downloadAsync(uri, path);
		this.setState({
			source: {
				uri: newImage.uri,
			},
		});
	};

	onPress = () => {
		console.log('PRESSED IMAGE!');
		if (this.state.modalVisible) {
			this.setState({ modalVisible: false });
		} else {
			this.setState({ modalVisible: true });
		}
	};

	render() {
		return (
			<>
				{this.state.modalVisible ? (
					<FullscreenImage
						modalVisible={this.state.modalVisible}
						setModalVisible={this.onPress}
						source={this.state.source}
					/>
				) : null}
				<TouchableOpacity onPress={this.onPress}>
					<Image style={this.props.style} source={this.state.source} />
				</TouchableOpacity>
			</>
		);
	}
}

const styles = {
	fullSize: {
		height: Dimensions.get('window').height * 0.8,
		width: Dimensions.get('window').width * 0.8,
		zIndex: 100,
		position: 'absolute',
	},
};
