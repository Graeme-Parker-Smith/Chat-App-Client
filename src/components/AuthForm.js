import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { Text, Button, Input } from "react-native-elements";
import Spacer from "./Spacer";

const AuthForm = ({ headerText, errorMessage, onSubmit, submitButtonText }) => {
  const [username, setusername] = useState("");
  const [password, setPassword] = useState("");
  const _next = () => {
    _passwordInput && _passwordInput.focus();
  };

  return (
    <>
      <Spacer>
        <Text h3>{headerText}</Text>
      </Spacer>
      <Input
        label="username"
        value={username}
        autoFocus={true}
        onChangeText={setusername}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="next"
        selectTextOnFocus={true}
        ref={ref => (_usernameInput = ref)}
        onSubmitEditing={_next}
        textContentType="none"
      />
      <Spacer />
      <Input
        label="Password"
        value={password}
        textContentType="none"
        onChangeText={setPassword}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="send"
        selectTextOnFocus={true}
        ref={ref => (_passwordInput = ref)}
        onSubmitEditing={() => onSubmit({ username, password })}
      />
      {errorMessage ? (
        <Text style={styles.errorMessage}>{errorMessage}</Text>
      ) : null}
      <Spacer>
        <Button
          title={submitButtonText}
          onPress={() => onSubmit({ username, password })}
        />
      </Spacer>
    </>
  );
};

const styles = StyleSheet.create({
  errorMessage: {
    fontSize: 16,
    color: "red",
    marginLeft: 15,
    marginTop: 15
  }
});

export default AuthForm;
