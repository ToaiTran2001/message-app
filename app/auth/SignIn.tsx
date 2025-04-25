import {
  View,
  Text,
  SafeAreaView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import Title from "@/components/Title";
import { fetchSignIn } from "@/services/api";
import useFetch from "@/services/useFetch";
import useGlobal from "@/core/global";
import utils from "@/core/utils";

const SignIn = () => {
  const router = useRouter();

  // State to control input fields
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // State to control error validate
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const login = useGlobal((state) => state.login);

  // Sign In request
  const { data, loading, error, reFetch } = useFetch(
    () =>
      fetchSignIn({
        username,
        password,
      }),
    false
  );

  const onSignInPressed = () => {
    console.log("Sign In pressed");

    // Check username
    const failUsername = !username;
    if (failUsername) {
      setUsernameError("Username not provided");
    }
    // Check password
    const failPassword = !password;
    if (failPassword) {
      setPasswordError("Password not provided");
    }
    // Break out of this function if there were any issues
    if (failUsername || failPassword) {
      return;
    }

    reFetch();
  };

  useEffect(() => {
    if (error) {
      console.log("Sign in failed", error.message);
    }
    if (data) {
      const credentials = {
        username: username,
        password: password,
      };
      let parseData = utils.parseParams(data);
      login(credentials, parseData.user, parseData.token.jwt);
      router.push({
        pathname: "/(tabs)",
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
            <View className="flex-1 justify-center px-5">
              <Title text="InnoMess" color="#000000" />

              <CustomInput
                placeholder="Username"
                title="Username"
                value={username}
                error={usernameError}
                setValue={setUsername}
                setError={setUsernameError}
              />

              <CustomInput
                title="Password"
                placeholder="Password"
                value={password}
                error={passwordError}
                setValue={setPassword}
                setError={setPasswordError}
                secureTextEntry={true}
              />

              <CustomButton
                title="Sign In"
                onPress={onSignInPressed}
              ></CustomButton>

              <Text className="text-center mt-4">
                Don't have an account?{" "}
                <Text
                  className="text-blue-500 font-semibold"
                  onPress={() => router.navigate("/auth/SignUp")}
                >
                  Sign Up
                </Text>
              </Text>
            </View>
          )}
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignIn;
