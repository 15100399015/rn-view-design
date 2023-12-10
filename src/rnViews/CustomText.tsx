import React from "react";
import { Text } from "react-native";

interface IProps {}

export function CustomText(props: IProps) {
  return <Text {...props} />;
}
