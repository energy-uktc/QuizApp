import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";

const formatNumber = (number) => `0${number}`.slice(-2);
const getRemaining = (time) => {
  console.log(time);
  const mins = Math.floor(time / 60);
  const secs = time - mins * 60;
  return { mins: formatNumber(mins), secs: formatNumber(secs) };
};

const Timer = (props) => {
  const [remainingSecs, setRemainingSecs] = useState(props.timeInSeconds);
  const { mins, secs } = getRemaining(remainingSecs);

  useEffect(() => {
    const interval = setInterval(() => {
      const seconds = Math.floor((Date.now() - props.startingTime) / 1000);
      let secondsLeft = props.timeInSeconds - seconds;
      if (secondsLeft <= 0) {
        props.onTimeout();
        clearInterval(interval);
      } else {
        setRemainingSecs(secondsLeft);
      }
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [remainingSecs]);

  return (
    <View>
      <Text>{`${mins}:${secs}`}</Text>
    </View>
  );
};

const styles = StyleSheet.create({});

export default Timer;
