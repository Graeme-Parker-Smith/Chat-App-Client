import React from 'react';
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
					thisName={formState.item.name}
					thisAvatar={formState.item.avatar}
					thisDescription={formState.item.description}
					thisMature={formState.item.mature}
				/>
			);
		case 'edit_private':
			return (
				<EditPrivateChannelForm
					showForm={setFormState}
					setIsLoading={setIsLoading}
					thisName={formState.item.name}
					thisAvatar={formState.item.avatar}
					thisDescription={formState.item.description}
					thisMature={formState.item.mature}

				/>
			);
		default: {
			setFormState('');
			return null;
		}
	}
};

export default FormHandler;
