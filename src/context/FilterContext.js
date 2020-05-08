import createDataContext from './createDataContext';
import chatApi from '../api/requester';
import uuid from 'uuid/v4';

const filterReducer = (state, action) => {
	switch (action.type) {
		case 'toggle_public':
			return { ...state, public: !state.public };
		case 'toggle_private':
			return { ...state, private: !state.private };
		case 'toggle_mature':
			return { ...state, mature: !state.mature };
		case 'set_channel_search':
			return { ...state, channelSearch: action.payload };
		case 'clear':
			return { public: true, private: true, mature: true, channelSearch: '', msgMin: 0, msgMax: null };
		default:
			return state;
	}
};

const clearFilter = (dispatch) => () => {
	dispatch({ type: 'clear' });
};

const togglePublic = (dispatch) => () => {
	dispatch({ type: 'toggle_public' });
};
const togglePrivate = (dispatch) => () => {
	dispatch({ type: 'toggle_private' });
};
const toggleMature = (dispatch) => () => {
	dispatch({ type: 'toggle_mature' });
};
const setChannelSearch = (dispatch) => (newText) => {
	dispatch({ type: 'set_channel_search', payload: newText });
};

export const { Provider, Context } = createDataContext(
	filterReducer,
	{
		clearFilter,
		togglePublic,
		togglePrivate,
		toggleMature,
		setChannelSearch,
	},
	{ public: true, private: true, mature: true, channelSearch: '', msgMin: 0, msgMax: null }
);
