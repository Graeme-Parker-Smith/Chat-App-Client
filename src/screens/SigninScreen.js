import React, { useContext } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { NavigationEvents} from 'react-navigation';
import { Context as AuthContext } from "../context/AuthContext";
import AuthForm from "../components/AuthForm";
import NavLink from "../components/NavLink";


const SigninScreen = () => {
  const { state, signin, clearErrorMessage } = useContext(AuthContext);
  return (
    <View style={styles.container}>
      <NavigationEvents onWillBlur={clearErrorMessage} />
      <AuthForm
        headerText="Welcome Back! Sign In Here"
        errorMessage={state.errorMessage}
        submitButtonText="Sign In"
        onSubmit={signin}
      />
      <NavLink
        routeName="Signup"
        text="Don't have an account? Go back and sign up!"
      />
    </View>
  );
};

SigninScreen.navigationOptions = () => {
  return {
    header: null
  };
};

const styles = StyleSheet.create({
  container: {
		height: Dimensions.get('window').height,
		backgroundColor: '#000',
		color: 'white',
	},
	errorMessage: {
		fontSize: 16,
		color: 'red',
		marginLeft: 15,
		marginTop: 15,
	},
	input: {
		width: '75%',
		borderWidth: 1,
		borderRadius: 10,
		alignSelf: 'center',
	},
});

export default SigninScreen;
