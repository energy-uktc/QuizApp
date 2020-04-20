import * as React from "react";
import { Platform, Alert } from "react-native";
import { useSelector } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../screens/quiz/Home";
import ResultsScreen from "../screens/user/Results";
import AuthScreen from "../screens/user/AuthScreen";
import StartupScreen from "../screens/StartupScreen";
import colors from "../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import LogoutButton from "../components/UI/LogoutButton";

//const defaultNavOptions = {};
const defaultNavOptions = {
  headerStyle: {
    backgroundColor: Platform.OS === "android" ? colors.primary : "white",
  },
  headerTitleStyle: {
    fontFamily: "open-sans-bold",
    textShadowColor: colors.activeColor,
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 1,
  },
  headerBackTitleStyle: {
    fontFamily: "open-sans",
  },

  headerTintColor:
    Platform.OS === "android" ? colors.inactiveColor : colors.primary,
};
const Tab = //createBottomTabNavigator();
  Platform.OS === "android"
    ? createMaterialBottomTabNavigator()
    : createBottomTabNavigator();
const Stack = createStackNavigator();

const QuizNavigator = (props) => {
  return (
    <Stack.Navigator initialRouteName="Home" screenOptions={defaultNavOptions}>
      <Stack.Screen
        options={{
          title: "Quiz Categories",
          headerRight: () => <LogoutButton />,
        }}
        name="Home"
        component={HomeScreen}
      />
    </Stack.Navigator>
  );
};

const ResultsNavigator = (props) => {
  return (
    <Stack.Navigator
      initialRouteName="History"
      screenOptions={{
        ...defaultNavOptions,
        headerStyle: {
          backgroundColor: Platform.OS === "android" ? colors.accent : "white",
        },
      }}
    >
      <Stack.Screen
        options={{
          title: "Your Results",
          headerRight: () => <LogoutButton />,
        }}
        name="History"
        component={ResultsScreen}
      />
    </Stack.Navigator>
  );
};

export default NavContainer = (props) => {
  let isLoading = useSelector((state) => state.loading.loading);
  let isAuth = useSelector((state) => !!state.auth.userId);
  if (isLoading) return <StartupScreen />;

  return (
    <NavigationContainer>
      {isAuth ? (
        <Tab.Navigator
          initialRouteName="Home"
          screenOptions={defaultNavOptions}
          shifting={true}
          activeColor={colors.activeColor}
          inactiveColor={colors.inactiveColor}
          barStyle={{ backgroundColor: "#694fad" }}
        >
          <Tab.Screen
            options={{
              title: "Home",
              tabBarColor: colors.primary,
              tabBarIcon: (tabInfo) => {
                return (
                  <Ionicons name="ios-home" size={25} color={tabInfo.color} />
                );
              },
            }}
            name="Home"
            component={QuizNavigator}
          />
          <Tab.Screen
            options={{
              title: "History",
              tabBarColor: colors.accent,
              tabBarIcon: (tabInfo) => {
                return (
                  <Ionicons name="ios-stats" size={25} color={tabInfo.color} />
                );
              },
            }}
            name="History"
            component={ResultsNavigator}
          />
        </Tab.Navigator>
      ) : (
        <Stack.Navigator
          initialRouteName="SignIn"
          screenOptions={defaultNavOptions}
        >
          <Stack.Screen
            options={{ title: "Sign In" }}
            name="SignIn"
            component={AuthScreen}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};
