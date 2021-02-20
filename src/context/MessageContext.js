import createDataContext from './createDataContext';
import chatApi from '../api/requester';
import uuid from 'uuid/v4';

const messageReducer = (state, action) => {
	switch (action.type) {
		case 'fetch_messages':
			return action.payload.messages;
		case 'add_message':
			return [...state, action.payload];
		case 'add_quick_message':
			return [...state, action.payload];
		case 'clear_messages':
			return [];
		default:
			return state;
	}
};

const clearMessages = (dispatch) => () => {
	dispatch({ type: 'clear_messages' });
};

const fetchEarlierMessages = (dispatch) => async (state, roomName, roomType, room_id) => {
	if (state.length > 18) {
		const response = await chatApi.get('/messages', {
			params: { stateLength: state.length, roomName, roomType, room_id },
		});
		dispatch({ type: 'fetch_messages', payload: response.data });
	}
};

const fetchMessages = (dispatch) => async (roomName, roomType, room_id) => {
	try {
		const response = await chatApi.get('/messages', {
			params: { roomName, roomType, room_id },
		});
		dispatch({ type: 'fetch_messages', payload: response.data });
	} catch (err) {
		console.log(err);
	}
};

const addMessage = (dispatch) => async ({ creator, avatar, content, roomName, isImage, isVideo }) => {
	const date = new Date();
	const time = date.toLocaleString();
	const message = {
		creator,
		avatar,
		content,
		roomName,
		time,
		isImage,
		isVideo,
		_id: uuid(),
	};
	const response = await chatApi.post('/messages', { ...message });
	dispatch({
		type: 'add_message',
		payload: response.data,
	});
};

const addQuickMessage = (dispatch) => ({ creator, avatar, content, time, roomName, isImage, isVideo }) => {
	const quickMessage = {
		creator,
		avatar,
		content,
		roomName,
		time,
		isImage,
		isVideo,
		_id: uuid(),
	};
	dispatch({
		type: 'add_quick_message',
		payload: quickMessage,
	});
};

const updateMessage = (dispatch) => async ({ currentContent, newContent, itemId }) => {
	await chatApi.put('/messages', { currentContent, newContent, itemId });
	dispatch({ type: null, payload: null });
};

const deleteMessage = (dispatch) => async ({ itemId }) => {
	await chatApi.delete('/messages', { params: { itemId } });
	dispatch({ type: null, payload: null });
};

const sendNotification = (dispatch) => async ({ sender, messageBody, receiver, room_id }) => {
	const response = await chatApi.post('/sendnotification', { sender, messageBody, receiver, room_id });
	// console.log(response);
	dispatch({ type: null, payload: null });
};

export const { Provider, Context } = createDataContext(
	messageReducer,
	{
		fetchMessages,
		addMessage,
		addQuickMessage,
		updateMessage,
		deleteMessage,
		fetchEarlierMessages,
		clearMessages,
		sendNotification,
	},
	[]
);
