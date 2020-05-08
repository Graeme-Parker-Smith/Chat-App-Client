import createDataContext from './createDataContext';
import chatApi from '../api/requester';
import uuid from 'uuid/v4';

const filterReducer = (state, action) => {
	switch (action.type) {
		case 'toggle_public':
			return { ...state, public: !state.public };
		case 'clear':
			return { public: true, private: true, mature: true, channelSearch: '', msgMin: 0, msgMax: null };
		default:
			return state;
	}
};

const clearFilter = (dispatch) => () => {
	dispatch({ type: 'clear' });
};

export const { Provider, Context } = createDataContext(
	filterReducer,
	{
		clearFilter,
	},
	{ public: true, private: true, mature: true, channelSearch: '', msgMin: 0, msgMax: null }
);
