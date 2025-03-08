import React from "react";
import { Slot } from "expo-router";

export default () => {
  return (
    <Slot
      screenOptions={{
        headerShown: true,
        contentStyle: {
          backgroundColor: "#040405",
        },
      }}
    ></Slot>
  );
};
