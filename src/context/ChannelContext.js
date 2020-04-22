import createDataContext from './createDataContext';
import chatApi from '../api/requester';
import imgUpload from '../helpers/imgUpload';

const channelReducer = (state, action) => {
	switch (action.type) {
		case 'fetch_channels':
			return action.payload;
		case 'add_friend':
			return {
				...state,
				currentUser: action.payload.currentUser,
			};
		case 'update_channel':
			return state;
		case 'update_user':
			return { ...state, currentUser: action.payload };
		case 'create_channel':
			return { ...state, channels: [...state.channels, action.payload] };
		case 'create_private_channel':
			return {
				...state,
				privateChannels: [...state.privateChannels, action.payload],
			};
		case 'delete_channel':
			return { ...state, channels: action.payload.channels, privateChannels: action.payload.privateChannels };
		case 'clear_state':
			return { currentUser: null, channels: [], privateChannels: [] };
		default:
			return state;
	}
};

const addFriend = (dispatch) => async ({ username, friendName, shouldRemove = false, shouldBlock = false }) => {
	try {
		const response = await chatApi.post('/addfriend', {
			username,
			friendName,
			shouldRemove,
			shouldBlock,
		});
		console.log(response.data);
		dispatch({ type: 'add_friend', payload: response.data });
	} catch (err) {
		console.log(err);
	}
};

const unblock = (dispatch) => async ({ username, friendName }) => {
	try {
		const response = await chatApi.post('/unblock', {
			username,
			friendName,
		});
		dispatch({ type: 'add_friend', payload: response.data });
	} catch (err) {
		console.log(err);
	}
};

const invite = (dispatch) => async ({ invitee, roomName }) => {
	const response = await chatApi.post('/invite', { invitee, roomName });
	dispatch({ type: 'update_channel', payload: response.data });
};

const kick = (dispatch) => async ({ removee, roomName }) => {
	const response = await chatApi.put('/kick', { removee, roomName });
	dispatch({ type: 'update_channel', payload: response.data });
};

const updateUser = (dispatch) => async ({ username, newUsername, newPassword, newAvatar }) => {
	try {
		const cloudUrl = await imgUpload(newAvatar);
		const response = await chatApi.post('/updateuser', {
			username,
			newUsername,
			newPassword,
			newAvatar: cloudUrl,
		});
		if (response.data.error) return response;
		dispatch({ type: 'update_user', payload: response.data.userData });
	} catch (err) {
		return err;
	}
};

const updateChannel = (dispatch) => async ({ username, prevName, newName, newAvatar, isPrivate = false }) => {
	const cloudUrl = await imgUpload(newAvatar);
	const response = await chatApi.post('/updatechannel', {
		username,
		prevName,
		newName,
		newAvatar: cloudUrl,
		isPrivate,
	});
	dispatch({ type: 'update_channel', payload: response.data });
};

const fetchChannels = (dispatch) => async () => {
	try {
		const response = await chatApi.get('/channels');
		// const nojson = JSON.parse(response.data);
		// console.log("response.data is: ", response.data);
		await dispatch({ type: 'fetch_channels', payload: response.data });
		return { error: null };
	} catch (err) {
		if (err.response.data.error === 'user could not be found') {
			return { error: err.response.data.error };
		}
	}
};

const createChannel = (dispatch) => async ({ name, creator, avatar, lifespan, msgLife }) => {
	try {
		const cloudUrl = await imgUpload(avatar);
		const response = await chatApi.post('/channels', { name, creator, avatar: cloudUrl, lifespan, msgLife });
		if (response.data.error) return response;
		dispatch({
			type: 'create_channel',
			payload: response.data,
		});
	} catch (err) {
		return err;
	}
};

const createPrivateChannel = (dispatch) => async ({ name, creator, avatar, lifespan, msgLife }) => {
	try {
		const cloudUrl = await imgUpload(avatar);
		const response = await chatApi.post('/privatechannels', { name, creator, avatar: cloudUrl, lifespan, msgLife });
		if (response.data.error) return response;
		dispatch({
			type: 'create_private_channel',
			payload: response.data,
		});
	} catch (err) {
		return err;
	}
};

const deleteChannel = (dispatch) => async ({ username, roomName, channel_id, isPrivate }) => {
	console.log('channel_id in context', channel_id);
	const response = await chatApi.delete('/channels', { params: { username, roomName, channel_id, isPrivate } });
	dispatch({
		type: 'delete_channel',
		payload: response.data,
	});
};

const clearState = (dispatch) => () => {
	dispatch({ type: 'clear_state' });
};

export const { Provider, Context } = createDataContext(
	channelReducer,
	{
		fetchChannels,
		createChannel,
		createPrivateChannel,
		updateUser,
		updateChannel,
		addFriend,
		unblock,
		invite,
		kick,
		deleteChannel,
		clearState,
	},
	{ currentUser: null, channels: [], privateChannels: [], PMs: [] }
);
