import {
  View,
  Text,
  SafeAreaView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { router, useNavigation } from "expo-router";
import CustomInput from "@/components/CustomInput";
import CustomButton from "@/components/CustomButton";
import useFetch from "@/services/useFetch";
import { fetchSignUp } from "@/services/api";
import Title from "@/components/Title";
import useGlobal from "@/core/global";
import utils from "@/core/utils";

const SignUp = () => {
  const navigation = useNavigation();

  // State to control input fields
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");

  // State to control error validate
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [password1Error, setPassword1Error] = useState("");
  const [password2Error, setPassword2Error] = useState("");

  // Sign Up request
  const { data, loading, error, reFetch } = useFetch(
    () =>
      fetchSignUp({
        username,
        email: email,
        firstName: firstName,
        lastName: lastName,
        password: password1,
      }),
    false
  );

  // Action
  const onSignUpPressed = () => {
    console.log("Sign Up pressed");

    // Check username
    const failUsername = !username || username.length < 5;
    if (failUsername) {
      setUsernameError("Username must be >= 5 characters!");
    }
    // Check firstName
    const failFirstName = !firstName;
    if (failFirstName) {
      setFirstNameError("First Name was not provided!");
    }
    // Check last Name
    const failLastName = !lastName;
    if (failLastName) {
      setLastNameError("Last Name was not provided!");
    }
    // Check password1
    const failPassword1 = !password1 || password1.length < 8;
    if (failPassword1) {
      setPassword1Error("Password is too short!");
    }
    // Check password2
    const failPassword2 = password1 !== password2;
    if (failPassword2) {
      setPassword2Error("Passwords don't match!");
    }
    // Break out of the fucntion if there were any issues
    if (
      failUsername ||
      failFirstName ||
      failLastName ||
      failPassword1 ||
      failPassword2
    ) {
      return;
    }

    // Call API Sign Up
    reFetch();
  };

  useEffect(() => {
    if (error) {
      console.log("Sign up failed", error.message);
    }
    if (data) {
      const parsedData =
        typeof data === "string" ? JSON.parse(data.trim()) : data;
      router.push({
        pathname: "/auth/Verify",
        params: { id: JSON.stringify(parsedData.id) },
      });
    }
  }, [data, error]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView behavior="height" className="flex-1">
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          {loading ? (
            <ActivityIndicator
              size="large"
              color="#000000"
              className="mt-10 self-center"
            />
          ) : (
            <ScrollView>
              <View className="flex-1 justify-center px-5">
                <Title text="Sign Up" color="#000000" />

                <CustomInput
                  placeholder="Username"
                  title="Username"
                  value={username}
                  error={usernameError}
                  setValue={setUsername}
                  setError={setUsernameError}
                />

                <CustomInput
                  placeholder="Email"
                  title="Email"
                  value={email}
                  error={emailError}
                  setValue={setEmail}
                  setError={setEmailError}
                />

                <CustomInput
                  placeholder="First Name"
                  title="First Name"
                  value={firstName}
                  error={firstNameError}
                  setValue={setFirstName}
                  setError={setFirstNameError}
                />

                <CustomInput
                  placeholder="Last Name"
                  title="Last Name"
                  value={lastName}
                  error={lastNameError}
                  setValue={setLastName}
                  setError={setLastNameError}
                />

                <CustomInput
                  placeholder="Password"
                  title="Password"
                  value={password1}
                  error={password1Error}
                  setValue={setPassword1}
                  setError={setPassword1Error}
                  secureTextEntry={true}
                />

                <CustomInput
                  placeholder="Retype Password"
                  title="Retype Password"
                  value={password2}
                  error={password2Error}
                  setValue={setPassword2}
                  setError={setPassword2Error}
                  secureTextEntry={true}
                />

                <CustomButton title="Sign Up" onPress={onSignUpPressed} />

                <Text className="text-center mt-4">
                  Already have an account?{" "}
                  <Text
                    className="text-blue-500 font-semibold"
                    onPress={() => navigation.goBack()}
                  >
                    Sign In
                  </Text>
                </Text>
              </View>
            </ScrollView>
          )}
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignUp;
