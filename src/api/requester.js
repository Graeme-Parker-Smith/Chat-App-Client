import axios from 'axios';
import { AsyncStorage } from 'react-native';

// const instance = axios.create({
//   baseURL: "https://graeme-chat-app.herokuapp.com"
// });
const instance = axios.create({
	baseURL: 'http://a4a4e1ca0e07.ngrok.io',
});

// before making an authentication request, check to see if jwtoken is already present
instance.interceptors.request.use(
	async (config) => {
		const token = await AsyncStorage.getItem('token');
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(err) => {
		return Promise.reject(err);
	}
);

export default instance;
