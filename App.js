
import { createStackNavigator } from '@react-navigation/stack';
import React, { createContext, useContext, useEffect, useState } from 'react';
import Chat from './screens/Chat';
import { NavigationContainer } from '@react-navigation/native';
import Login from './screens/Login';
import SingUp from './screens/Signup';
import Home from './screens/Home';
import { View, ActivityIndicator, TouchableOpacity } from 'react-native';
import { auth, signOut } from './config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import * as Icon from "react-native-feather";
import {store, updateUser } from './store';

import { Provider, useDispatch } from 'react-redux';
import { getDatabase, get, ref, } from 'firebase/database';


const AuthenticatedUserContext = createContext({});

const AuthenticatedUserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  return (
    <AuthenticatedUserContext.Provider value={{ user, setUser }}>
      {children}
    </AuthenticatedUserContext.Provider>
  );

}


const Stack = createStackNavigator();

const ChatStack = () => {

  const onSignOut = () => {
    signOut(auth).catch(err => { console.log(err.message); });
  }
  return (
    <Stack.Navigator
      initialRouteName='Home'
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen name="Chat" component={Chat}
        options={{
          headerShown: true,
          headerRight: () => (<TouchableOpacity
            onPress={() => onSignOut()}
            style={{ marginRight: 10, marginTop: 15 }}
          >
            <Icon.LogOut stroke="#0c000e" strokeWidth={1} fill="#f6f7fb" height={30} width={30} />
          </TouchableOpacity>),
        }}
      />
      <Stack.Screen name="Home" component={Home} />
    </Stack.Navigator>
  );
}

const AuthStack = () => {
  return (
    <Stack.Navigator
      initialRouteName='Login'
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="SignUp" component={SingUp} />
    </Stack.Navigator>
  );
}

const RootNavigator = () => {
  const { user, setUser } = useContext(AuthenticatedUserContext);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch()
  const database = getDatabase();

  const findUser = async (userId) => {
    const mySnapshot = await get(ref(database, `users/${userId}`));
    return mySnapshot.val();
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth,
      async authenticatedUser => {
        authenticatedUser ? setUser(authenticatedUser) : setUser(null);
        const data = await findUser(authenticatedUser?.uid);
        dispatch(updateUser({
          ...data,
          friends: data?.friends !== undefined ? data?.friends : []
        })
        );
        setLoading(false);
      }
    )
    return () => unsubscribe();
  }, [user]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <ChatStack /> : <AuthStack />}
    </NavigationContainer>
  );
}


export default function App() {
  return (
    <Provider store={store}>
      <AuthenticatedUserProvider>
        <RootNavigator />
      </AuthenticatedUserProvider>
    </Provider>
  );
}

// build apk 
// eas build -p android --profile preview