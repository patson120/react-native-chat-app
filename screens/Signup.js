

import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';
import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';

import { getDatabase, ref, set } from 'firebase/database';
import { updateUser } from '../store';
import { useDispatch } from 'react-redux';

const SingUp = ({ navigation }) => {

    const database = getDatabase();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const dispatch = useDispatch();

    const onHandleSignup = () => {

        if (email !== "" && password !== "") {
            createUserWithEmailAndPassword(auth, email.trim(), password.trim())
                .then((response) => {
                    createNewUser(response.user);
                    console.log("Succes", response.user.uid);
                })
                .catch((err) => Alert.alert("Login error", err.message))
        }
    }

    const createNewUser = async (user) => {
        // Create a new user with the given data
        const newUserObj = {
            _id: user.uid,
            username: username.trim(),
            email: user.email.trim(),
            avatar: 'https://i.pravatar.cc/150?u=' + user.uid,
            friends: []
        };
        set(ref(database, `users/${user.uid}`), newUserObj);
        dispatch(updateUser(newUserObj));
        setUsername("");
    }

    return (
        <View
            style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                paddingHorizontal: 20,
                backgroundColor: '#fff',
            }}>
            <Text
                style={{
                    fontSize: 30,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    color: "#fc7500"
                }}
            >Sign Up</Text>

            <TextInput
                placeholder='Enter your username'
                autoCapitalize='none'
                autoCorrect={false}
                textContentType='givenName'
                value={username}
                onChangeText={setUsername}

                style={{
                    backgroundColor: '#cececd',
                    fontSize: 18,
                    width: '80%',
                    marginHorizontal: '10%',
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    marginTop: 40,
                    borderRadius: 10
                }}
            />

            <TextInput
                placeholder='Enter your email adress'
                autoCapitalize='none'
                autoCorrect={false}
                textContentType='password'
                value={email}
                onChangeText={setEmail}

                style={{
                    backgroundColor: '#cececd',
                    fontSize: 18,
                    width: '80%',
                    marginHorizontal: '10%',
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    marginTop: 20,
                    borderRadius: 10
                }}
            />

            <TextInput

                placeholder='Enter your password'
                autoCapitalize='none'
                autoCorrect={false}
                secureTextEntry={true}
                textContentType='password'
                value={password}
                onChangeText={setPassword}

                style={{
                    backgroundColor: '#cececd',
                    fontSize: 18,
                    width: '80%',
                    marginHorizontal: '10%',
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    marginTop: 20,
                    borderRadius: 10
                }}
            />

            <TouchableOpacity
                onPress={() => onHandleSignup()}
                style={{
                    backgroundColor: '#fc7500',
                    width: '80%',
                    marginHorizontal: '10%',
                    marginTop: 40,
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 12,
                    borderRadius: 10
                }}
            >
                <Text
                    style={{
                        fontSize: 22,
                        fontWeight: 'bold',
                        color: '#fff'
                    }}
                >Sign up</Text>
            </TouchableOpacity>

            <View style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 30
            }}>
                <Text
                    style={{
                        fontSize: 16,
                    }}
                >Already have an account</Text>
                <TouchableOpacity
                    onPress={() => navigation.navigate("Login")}
                    style={{
                        marginLeft: 10
                    }}
                >
                    <Text
                        style={{
                            fontSize: 16,
                            color: '#fc7500',
                        }}
                    >Login</Text>
                </TouchableOpacity>

            </View>

        </View>
    );
}

export default SingUp;