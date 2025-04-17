import { Image } from "react-native";
import React from "react";
import utils from "../core/utils";

interface ThumbnailProps {
  url?: string;
  size: number;
}

const Thumbnail = ({ url, size }: ThumbnailProps) => {
  return (
    <Image
      source={utils.thumbnail(url ? url : "")}
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: "#e0e0e0",
      }}
    />
  );
};

export default Thumbnail;
