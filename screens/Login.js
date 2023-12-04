
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';
import { useState } from 'react';
import { View, Text, Alert } from 'react-native';

const Login = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const onHandleLogin = () => {

        if (email !== "" && password !== "") {
            signInWithEmailAndPassword(auth, email, password)
                .then(() => { })
                .catch(() => Alert.alert("Login error", err.message))
        }
    }
    return (
        <View
            style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                paddingHorizontal: 20
            }}>
            <Text>Login screen</Text>
            
        </View>
    );
}

export default Login;