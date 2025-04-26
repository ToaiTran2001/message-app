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
import { useSearchParams } from "expo-router/build/hooks";
import LoadComponent from "@/components/LoadComponent";

const Verify = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const parseId = utils.parseParams(id);
  const [vefifyUpdate, setVerifyUpdate] = useState(false);

  // State to control input fields
  const [code, setCode] = useState("");

  // State to control error validate
  const [codeError, setCodeError] = useState("");

  // Verify request
  const { data, loading, error, reFetch } = useFetch(
    () =>
      fetchVerifyAccount({
        token: code,
        id: parseId,
      }),
    false
  );

  const onVerifyPressed = () => {
    console.log("Code: ", code);
    console.log("Verify pressed");
    setVerifyUpdate(true);
  };

  useEffect(() => {
    if (vefifyUpdate) {
      reFetch();
      if (!loading) {
        setVerifyUpdate(false);
      }
    }
  }, [vefifyUpdate]);

  useEffect(() => {
    if (error) {
      console.log("Verify failed", error.message);
    }
    if (data) {
      console.log("Verify successful", data);
      router.push({
        pathname: "/auth/SignIn",
      });
    }
  }, [data, error]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView behavior="height" className="flex-1">
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          {loading ? (
            <LoadComponent />
          ) : (
            <View className="flex-1 justify-center px-5">
              <Title text="InnoMess" color="#000000" />

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
                onPress={onVerifyPressed}
              ></CustomButton>
            </View>
          )}
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Verify;
