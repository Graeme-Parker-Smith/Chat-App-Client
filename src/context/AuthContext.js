import { AsyncStorage } from 'react-native';
import createDataContext from './createDataContext';
import chatApi from '../api/requester';
import { navigate } from '../navigationRef';
import imgUpload from '../helpers/imgUpload';

const authReducer = (state, action) => {
	switch (action.type) {
		case 'add_error':
			return { ...state, errorMessage: action.payload };
		case 'signin':
			return {
				errorMessage: '',
				token: action.payload.token,
			};
		case 'localsignin':
			return {
				errorMessage: '',
				token: action.payload.token,
			};
		case 'clear_error_message':
			return { ...state, errorMessage: '' };
		case 'signout':
			return { token: null, avatar: null, errorMessage: '' };
		default:
			return state;
	}
};

const tryLocalSignin = (dispatch) => async () => {
	const token = await AsyncStorage.getItem('token');
	if (token) {
		// const response = await chatApi.get("/userdata");
		dispatch({
			type: 'localsignin',
			payload: { token },
		});
		navigate('Account');
	} else {
		navigate('Signup');
	}
};

const clearErrorMessage = (dispatch) => () => {
	dispatch({ type: 'clear_error_message' });
};

const signup = (dispatch) => async ({ username, password, avatar }) => {
	try {
		let response;
		if (avatar) {
			// let localUri = avatar;
			// // ('file:///var/mobile/Containers/Data/Application/14E88F17-8860-46F6-BB0B-892C349136E9/Library/Caches/ExponentExperienceData/%2540graemesmith%252Fgraeme-chat-app/ImagePicker/B9A71996-353E-4638-8148-B1AB2C653138.jpg');
			// let filename = localUri.split('/').pop();
			// // "B9A71996-353E-4638-8148-B1AB2C653138.jpg"

			// // infer the type of the image
			// let match = /\.(\w+)$/.exec(filename);
			// // [".jpg", "jpg"]
			// let type = match ? `image/${match[1]}` : `image`;
			// // if match truthy, type = "image/jpg" else type = "image"
			// let formData = new FormData();
			// formData.append('username', username);
			// formData.append('password', password);
			// formData.append('photo', { uri: localUri, name: filename, type });
			// console.log('formData: ', formData);
			// response = await chatApi.post('/signup', formData, {
			// 	headers: { 'content-type': 'multipart/form-data' },
			// });

			const cloudUrl = await imgUpload(avatar);
			// console.log('cloudUrl', cloudUrl);
			response = await chatApi.post('/signup', {
				username,
				password,
				avatar: cloudUrl,
			});
		} else {
			response = await chatApi.post('/signup', {
				username,
				password,
			});
		}
		await AsyncStorage.setItem('token', response.data.token);
		dispatch({ type: 'signin', payload: response.data.token });
		navigate('Account');
	} catch (err) {
		// console.log('err message', err.message);

		if (err.message === 'Request failed with status code 422') {
			// console.log('got 422 error');
			dispatch({
				type: 'add_error',
				payload: 'This username is already taken.',
			});
		} else {
			dispatch({
				type: 'add_error',
				payload: 'Could not connect to server.',
			});
		}
	}
};

const createError = (dispatch) => (err) => {
	dispatch({ type: 'add_error', payload: err });
};

const signin = (dispatch) => async ({ username, password }) => {
	// navigate('Account');
	try {
		const response = await chatApi.post('/signin', { username, password });
		await AsyncStorage.setItem('token', response.data.token);
		// console.log("signin response.data", response.data);
		dispatch({ type: 'signin', payload: response.data });
		navigate('Account');
	} catch (err) {
		// console.log('err message', err.message);

		if (err.message === 'Request failed with status code 422') {
			// console.log('got 422 error');
			dispatch({
				type: 'add_error',
				payload: 'User not found.',
			});
		} else if (err.message === 'Request failed with status code 403') {
			// console.log('got 403 error');
			dispatch({
				type: 'add_error',
				payload: 'Wrong Password.',
			});
		} else {
			dispatch({
				type: 'add_error',
				payload: 'Could not connect to server.',
			});
		}
	}

	return 'error';
};

const deleteUser = (dispatch) => async ({ username, user_id }) => {
	await chatApi.delete('/user', { params: { username, user_id } });
	await AsyncStorage.removeItem('token');
	dispatch({ type: 'signout' });
	navigate('Signup');
};

const signout = (dispatch) => async (user) => {
	navigate('Signin');
	let pushToken = await AsyncStorage.getItem('pushtoken');
	if (pushToken && user) {
		await chatApi.post('/signout', { user_id: user.user_id, pushToken: pushToken });
	}
	await AsyncStorage.removeItem('token');
	dispatch({ type: 'signout' });
};

export const { Provider, Context } = createDataContext(
	authReducer,
	{ signup, signin, signout, clearErrorMessage, tryLocalSignin, deleteUser, createError },
	{ token: null, errorMessage: '' }
);
