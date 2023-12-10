import React from "react";
import { TouchableHighlight, TouchableOpacity } from "react-native";

interface IProps {
  effect?: "highlight" | "opacity" | "without";
}

export function CustomTouchableView(props: IProps) {
  const effect = props.effect;
  if (effect === "highlight") {
    return (
      <TouchableHighlight
        {...props}
        underlayColor="#ffffff"
        activeOpacity={0.8}
      />
    );
  }
  if (effect === "opacity") {
    return <TouchableOpacity {...props} activeOpacity={0.3} />;
  }
  return <TouchableOpacity {...props} activeOpacity={1} />;
}
