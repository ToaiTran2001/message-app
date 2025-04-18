import {
  View,
  Text,
  SafeAreaView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { fetchVerifyAccount } from "@/services/api";
import Title from "@/components/Title";
import CustomInput from "@/components/CustomInput";
import CustomButton from "@/components/CustomButton";
import useFetch from "@/services/useFetch";
import useGlobal from "@/core/global";
import utils from "@/core/utils";

const Verify = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [code, setCode] = useState("");

  const [codeError, setCodeError] = useState("");

  // Make Sign In request
  const { data, loading, error, reFetch } = useFetch(
    () =>
      fetchVerifyAccount({
        token: code,
        id: utils.parseParams(id),
      }),
    false
  );

  const VerifyPressed = () => {
    console.log("Verify Pressed");

    reFetch();
  };

  useEffect(() => {
    if (error) {
      console.log("Verify failed", error.message);
    }
    if (data) {
      console.log("Sign up successful", data);
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
              <Title text="Message App" color="#000000" />

              <CustomInput
                placeholder="Code"
                title="Code"
                value={code}
                error={codeError}
                setValue={setCode}
                setError={setCodeError}
              />

              <CustomButton
                title="Verify"
                onPress={VerifyPressed}
              ></CustomButton>
            </View>
          )}
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Verify;
