
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';
import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';

const Login = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const onHandleLogin = async () => {
        if (email !== "" && password !== "") {
            try {
                // const response = await signInWithEmailAndPassword(auth, "patrickkennenl@gmail.com", "patson120");
                const response = await signInWithEmailAndPassword(auth, email, password);
                console.log("Success", response?.user?.uid);
            } catch (error) {
                Alert.alert("Login error", error.message);
            }
        }
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
                    color: '#fc7500'
                }}
            >Login</Text>

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
                    marginTop: 40,
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
                onPress={() => onHandleLogin()}
                style={{
                    backgroundColor: '#fc7500',
                    width: '80%',
                    marginHorizontal: '10%',
                    marginTop: 50,
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
                >Log in</Text>
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
                >Don't have an account</Text>
                <TouchableOpacity
                    onPress={() => navigation.navigate("SignUp")}
                    style={{
                        marginLeft: 10
                    }}
                >
                    <Text
                        style={{
                            fontSize: 16,
                            color: '#fc7500',
                        }}
                    >Signup</Text>
                </TouchableOpacity>

            </View>

        </View>
    );
}

export default Login;