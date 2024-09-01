import { StackNavigationProp } from "@react-navigation/stack";
import React, { useState } from "react";
import { SafeAreaView, StyleSheet, ScrollView, Text } from "react-native";
import { Appbar, TextInput, Snackbar, Button } from "react-native-paper";
import { AuthStackParamList } from "./AuthStackScreen";
import firebase from "firebase";
import SignUpScreen from "./SignUpScreen";

interface Props {
  navigation: StackNavigationProp<AuthStackParamList, "SignInScreen">;
}

export default function SignInScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [errMessage, setErr] = useState("");
  /* Screen Requirements:
      - AppBar
      - Email & Password Text Input
      - Submit Button
      - Sign Up Button (goes to Sign Up screen)
      - Reset Password Button
      - Snackbar for Error Messages
  
    All UI components on this screen can be found in:
      https://callstack.github.io/react-native-paper/

    All authentication logic can be found at:
      https://firebase.google.com/docs/auth/web/starts
  */

  const snackBarError = (message : String) => {
  
    const onToggleSnackBar = () => setVisible(!visible);
  
    const onDismissSnackBar = () => setVisible(false);
  
    return (
        <Snackbar
          visible={visible}
          onDismiss={onDismissSnackBar}
          action={{
            label: 'Close',
            onPress: () => { {setVisible(false)};
            },
          }}>
          {message}
        </Snackbar>
    );
  };

  const errorDeal = (message: any) => {
    setVisible(true);
    setErr(message);
  }


  const signIn = () => {
  firebase.auth().signInWithEmailAndPassword(email, password).then((userCredential) => {
  }).catch(error => errorDeal(error.message));
  }

  const resetPassword = () => {
    firebase.auth().sendPasswordResetEmail(email).then(function() {
    setErr("A password reset email has been sent to you")
    setVisible(true);
    }).catch(error => errorDeal(error.message));
  }

  return (
    <>
      <SafeAreaView style={styles.container}>
        <Appbar.Header>
          <Appbar.Content title = "Sign in" />
        </Appbar.Header>
        <TextInput
        label = "Email"
        value = {email}
        onChangeText = {text => setEmail(text)}
        />
        <TextInput
        secureTextEntry = {true}
        label = "Password"
        value = {password}
        onChangeText = {text => setPassword(text)}
        />
        <Button onPress = {() => signIn()}> Sign In</Button>
        <Button onPress = {() => navigation.navigate("SignUpScreen")}> Create an Account</Button>
        <Button onPress = {() => resetPassword()}> Reset Password </Button>
        {snackBarError(errMessage)}
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    backgroundColor: "#ffffff",
  },
});
