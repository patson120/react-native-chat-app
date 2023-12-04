
import { Image, TouchableOpacity, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Icon from "react-native-feather";
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';

const CHAT = require('../assets/chat.jpg');


const Home = ({ navigation }) => {

    useEffect(() => {
        navigation.setOptions({
            headerLeft: () => (<Icon.Search stroke="#0c000e" strokeWidth={1} fill="#f6f7fb" height={25} width={25} />),
            headerRight: () => (
                <Image
                    source={CHAT}
                    style={{
                        height: 40,
                        width: 40,
                        marginRight: 15,
                        borderRadius: 100
                    }}
                />
            )

        });
    }, [navigation]);
    return (
        <SafeAreaView
            style={{ flex: 1 }}
        >
            <StatusBar hidden />
            <View
                style={{
                    flex: 1,
                    backgroundColor: '#fff',
                    justifyContent: 'space-between',
                    alignItems: 'space-between',
                }}
            >
                <View 
                    style={{ width: '100%', paddingLeft: 20, paddingRight: 15, paddingVertical: 10, flexDirection: 'row', justifyContent: "space-between", alignItems: 'center'}}
                >
                    <Icon.Search stroke="#0c000e" strokeWidth={1} fill="#f6f7fb" height={35} width={35} />
                    <Text
                        style={{ fontSize: 18, fontWeight: 'bold' }}
                    >Home</Text>
                    <Image
                        source={CHAT}
                        style={{
                            height: 40,
                            width: 40,
                            marginRight: 15,
                            borderRadius: 100
                        }}
                    />
                </View>
                <TouchableOpacity
                    onPress={() => { navigation.navigate("Chat") }}
                    style={{
                        marginRight: 20,
                        marginBottom: 15,
                        height: 50,
                        width: 50,
                        backgroundColor: '#fc7500',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 100
                    }}
                >
                    <Icon.Send stroke="#fff" strokeWidth={1} fill="#f6f7fb" height={25} width={25} />
                </TouchableOpacity>

            </View>

        </SafeAreaView>
    );
}

export default Home;