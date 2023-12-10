import React from "react";
import { ImageBackground } from "react-native";

interface IProps {
  src: string;
}

export function CustomImageBackground(props: IProps) {
  return <ImageBackground {...props} source={{ uri: props.src }} />;
}
