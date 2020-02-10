import React, { useContext, useState, useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Text, FlatList, TouchableOpacity, Dimensions, AppState } from 'react-native';
import { Button, Input } from 'react-native-elements';
import { SafeAreaView, NavigationEvents } from 'react-navigation';

import Spacer from '../components/Spacer';
import LoadingIndicator from '../components/LoadingIndicator';
import CreateChannelForm from '../components/CreateChannelForm';
import CreatePrivateChannelForm from '../components/CreatePrivateChannelForm';
import EditUserForm from '../components/EditUserForm';
import EditChannelForm from '../components/EditChannelForm';
import EditPrivateChannelForm from '../components/EditPrivateChannelForm';

const FormHandler = ({ formState, setFormState, setIsLoading }) => {
	switch (formState.show) {
		case 'create_public':
			return <CreateChannelForm showForm={setFormState} setIsLoading={setIsLoading} />;
		case 'create_private':
			return <CreatePrivateChannelForm showForm={setFormState} setIsLoading={setIsLoading} />;
		case 'edit_user':
			return <EditUserForm showForm={setFormState} setIsLoading={setIsLoading} />;
		case 'edit_public':
			return (
				<EditChannelForm
					showForm={setFormState}
					setIsLoading={setIsLoading}
					thisName={formState.roomName}
					thisAvatar={formState.avatar}
				/>
			);
		case 'edit_private':
			return (
				<EditPrivateChannelForm
					showForm={setFormState}
					setIsLoading={setIsLoading}
					thisName={formState.roomName}
					thisAvatar={formState.avatar}
				/>
			);
		default:
			return setFormState('');
	}
};

const styles = {};

export default FormHandler;
