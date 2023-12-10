import React from "react";
import { View } from "react-native";

interface IProps {}

export function CustomView(props: IProps) {
  return <View {...props} />;
}
