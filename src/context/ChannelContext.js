import createDataContext from './createDataContext';
import chatApi from '../api/requester';
import imgUpload from '../helpers/imgUpload';

const channelReducer = (state, action) => {
	switch (action.type) {
		case 'fetch_channels':
			return action.payload;
		case 'refresh':
			let updatedChannels = state.channels.map((chan) => {
				let newChan;
				if (action.payload[chan._id]) {
					newChan = { ...chan, userCount: action.payload[chan._id] };
				} else {
					newChan = { ...chan, userCount: 0 };
				}
				return newChan;
			});
			let updatedPrivates = state.privateChannels.map((chan) => {
				let newChan;
				if (action.payload[chan._id]) {
					newChan = { ...chan, userCount: action.payload[chan._id] };
				} else {
					newChan = { ...chan, userCount: 0 };
				}
				return newChan;
			});
			let updatedPMs = state.PMs.map((chan) => {
				let newChan;
				if (action.payload[chan._id]) {
					newChan = { ...chan, userCount: action.payload[chan._id] };
				} else {
					newChan = { ...chan, userCount: 0 };
				}
				return newChan;
			});
			return { ...state, channels: updatedChannels, privateChannels: updatedPrivates, PMs: updatedPMs };
		case 'add_friend':
			return {
				...state,
				currentUser: action.payload.currentUser,
			};
		case 'update_channel':
			return state;
		case 'sort_new':
			// console.log('sorting channels....');
			let newChannels = state.channels.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
			let newPrivates = state.privateChannels.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
			let newPMs = state.PMs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
			return { ...state, channels: newChannels, privateChannels: newPrivates, PMs: newPMs };
		case 'sort_old':
			// console.log('sorting channels....');
			newChannels = state.channels.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
			newPrivates = state.privateChannels.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
			newPMs = state.PMs.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
			return { ...state, channels: newChannels, privateChannels: newPrivates, PMs: newPMs };
		case 'sort_msg':
			// console.log('sorting channels....');
			newChannels = state.channels.sort((a, b) => b.msgCount - a.msgCount);
			newPrivates = state.privateChannels.sort((a, b) => b.msgCount - a.msgCount);
			newPMs = state.PMs.sort((a, b) => b.msgCount - a.msgCount);
			return { ...state, channels: newChannels, privateChannels: newPrivates, PMs: newPMs };
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

const addFriend = (dispatch) => async ({
	username,
	friendName,
	shouldRemove = false,
	shouldBlock = false,
	shouldReport = false,
}) => {
	try {
		const response = await chatApi.post('/addfriend', {
			username,
			friendName,
			shouldRemove,
			shouldBlock,
			shouldReport,
		});
		dispatch({ type: 'add_friend', payload: response.data });
	} catch (err) {
		console.log(err);
	}
};

const report = (dispatch) => async ({ username, reportedUser }) => {
	// console.log('REPORTED', reportedUser);
	try {
		const response = await chatApi.post('/addfriend', {
			username: username,
			friendName: reportedUser.username,
			shouldRemove: true,
			shouldBlock: true,
			shouldReport: true,
		});
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
		if (response && response.data.error) return response;
		dispatch({ type: 'update_user', payload: response.data.userData });
	} catch (err) {
		return err;
	}
};

const updateChannel = (dispatch) => async ({
	username,
	prevName,
	newName,
	newAvatar,
	isPrivate = false,
	newDescription,
	newMature = false,
}) => {
	try {
		const cloudUrl = await imgUpload(newAvatar);
		const response = await chatApi.post('/updatechannel', {
			username,
			prevName,
			newName,
			newAvatar: cloudUrl,
			newDescription,
			newMature,
			isPrivate,
		});
		if (response && response.data.error) return response;
		dispatch({ type: 'update_channel', payload: response.data });
	} catch (err) {
		return err;
	}
};

const reportChannel = (dispatch) => async ({ name, id, avatar, description, mature }) => {
	// console.log('reporting channel');
	try {
		const response = chatApi.post('reportchannel', {
			name,
			id,
			avatar,
			description,
			mature,
		});
		return;
	} catch (err) {
		console.log(err);
	}
};

const applyFilter = (dispatch) => (filterType) => {
	// console.log('applying filter.');
	switch (filterType) {
		case 'new':
			return dispatch({ type: 'sort_new', payload: null });
		case 'old':
			return dispatch({ type: 'sort_old', payload: null });
		case 'msg':
			return dispatch({ type: 'sort_msg', payload: null });
		case 'user':
			return dispatch({ type: 'sort_user', payload: null });
		case 'fav':
			return dispatch({ type: 'sort_fav', payload: null });
		default:
			return dispatch({ type: 'sort_new', payload: null });
	}
};

const fetchChannels = (dispatch) => async () => {
	// console.log('fetching');
	try {
		const response = await chatApi.get('/channels');
		// const nojson = JSON.parse(response.data);
		// console.log("response.data is: ", response.data);
		await dispatch({ type: 'fetch_channels', payload: response.data });
		return { success: true };
	} catch (err) {
		return { error: err };
		if (err.response.data.error === 'user could not be found') {
			return { error: err.response.data.error };
		}
	}
};

const updateState = (dispatch) => async (newData) => {
	dispatch({ type: 'fetch_channels', payload: newData });
};

const refreshChannelsData = (dispatch) => async ({ channelsData }) => {
	dispatch({ type: 'refresh', payload: channelsData });
};

const createChannel = (dispatch) => async ({
	name,
	creator,
	avatar,
	description,
	lifespan,
	msgLife,
	mature = false,
}) => {
	try {
		const cloudUrl = await imgUpload(avatar);
		const response = await chatApi.post('/channels', {
			name,
			creator,
			avatar: cloudUrl,
			description,
			lifespan,
			msgLife,
			mature,
		});
		if (response.data.error) return response;
		dispatch({
			type: 'create_channel',
			payload: response.data,
		});
	} catch (err) {
		return err;
	}
};

const createPrivateChannel = (dispatch) => async ({
	name,
	creator,
	avatar,
	description,
	lifespan,
	msgLife,
	mature = false,
}) => {
	try {
		const cloudUrl = await imgUpload(avatar);
		const response = await chatApi.post('/privatechannels', {
			name,
			creator,
			avatar: cloudUrl,
			description,
			lifespan,
			msgLife,
			mature,
		});
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
		updateState,
		createChannel,
		createPrivateChannel,
		updateUser,
		updateChannel,
		addFriend,
		unblock,
		report,
		reportChannel,
		applyFilter,
		invite,
		kick,
		deleteChannel,
		clearState,
		refreshChannelsData,
	},
	{ currentUser: null, channels: [], privateChannels: [], PMs: [] }
);
