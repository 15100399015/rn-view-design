import React from "react";
import { ImageBackground } from "react-native";

interface IProps {
  src?: string;
}

export function CustomImage(props: IProps) {
  return <ImageBackground {...props} source={{ uri: props.src }} />;
}
