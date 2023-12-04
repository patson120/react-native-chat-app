
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import Chat from './screens/Chat';
import { NavigationContainer } from '@react-navigation/native';
import Login from './screens/Login';


const Stack = createStackNavigator();

const ChatStack = () => {
  return (
    <Stack.Navigator >
      {/* <Stack.Screen name="Chat" component={Chat} /> */}
      <Stack.Screen name="Login" component={Login} />
    </Stack.Navigator>
  );
}

const RootNavigator = () => {
  return (
    <NavigationContainer>
      <ChatStack />
    </NavigationContainer>
  );
}


export default function App() {
  return (<RootNavigator />);
}

