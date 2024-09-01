import { StackNavigationProp } from "@react-navigation/stack";
import React, { useState } from "react";
import { Text, SafeAreaView, StyleSheet, ScrollView } from "react-native";
import { Appbar, TextInput, Snackbar, Button } from "react-native-paper";
import { AuthStackParamList } from "./AuthStackScreen";
import firebase from "firebase";

interface Props {
  navigation: StackNavigationProp<AuthStackParamList, "SignUpScreen">;
}

export default function SignUpScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [errMessage, setErr] = useState("");
  /* Screen Requirements:
      - AppBar
      - Email & Password Text Input
      - Submit Button
      - Sign In Button (goes to Sign In Screen)
      - Snackbar for Error Messages
  
    All UI components on this screen can be found in:
      https://callstack.github.io/react-native-paper/

    All authentication logic can be found at:
      https://firebase.google.com/docs/auth/web/start
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


  const signUp = () => {
  firebase.auth().createUserWithEmailAndPassword(email, password)
  .then((userCredential) => {}).catch(error => errorDeal(error.message))
  }

    
    
      return (
        <>
          <SafeAreaView style={styles.container}>
            <Appbar.Header>
              <Appbar.Content title = "Create an Account" />
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
            <Button onPress = {() => signUp()}>  Create an Account</Button>
            <Button onPress = {() => navigation.navigate("SignInScreen")}> or Sign in Instead</Button>
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
