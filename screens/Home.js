
import { Image, Pressable, Button, TextInput, Alert, TouchableOpacity, View, Text, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Icon from "react-native-feather";
import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { useDispatch, useSelector } from 'react-redux';

import {
    getDatabase,
    ref,
    onValue,
    off,
    get,
    push,
    update
} from 'firebase/database';
import { selectCorrespondant, selectUser, updateUser } from '../store';

const CHAT = require('../assets/chat.jpg');

const Home = ({ navigation }) => {
    const dispatch = useDispatch();

    const user = useSelector(selectUser);
    const correspondant = useSelector(selectCorrespondant);


    const [currentUser, setCurrentUser] = useState(user?.username);
    const [friendUsername, setFriendUsername] = useState("");
    const [users, setUsers] = useState([]);
    const [myData, setMyData] = useState(user);
    const [showInput, setShowInput] = useState(false);

    const database = getDatabase();

    console.log('====================================');
    console.log(user);
    console.log('====================================');

    // useEffect(() => {
    //     // set friends list change listener
    //     const myUserRef = ref(database, `users/${currentUser}`);
    //     onValue(myUserRef, snapshot => {
    //         const data = snapshot.val();
    //         console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
    //         console.log("It'is work!", data);
    //         console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
    //         dispatch(updateUser({ ...data }));
    //         setUsers(data.friends);
    //         setMyData(prevData => (prevData ? {
    //             ...prevData,
    //             friends: data.friends,
    //         } : {
    //             ...data
    //         }
    //         ));
    //     });

    //     return () => {
    //         //remove user listener
    //         off(myUserRef);
    //     };
    // }, [currentUser]);


    const onAddFriend = async () => {

        try {
            // find user and add it to my friends and also add me to his friends

            const user = await findUser(friendUsername);

            if (user) {
                if (user.username === myData.username) {
                    // don't let user add himself
                    Alert.alert("This user is you");
                    return;
                }

                if (
                    myData.friends &&
                    myData.friends.findIndex(f => f.username === user.username) > 0
                ) {
                    // don't let user add a user twice
                    Alert.alert("This user is already added to my friends list");
                    return;
                }

                // create a chatroom and store the chatroom id

                const newChatroomRef = push(ref(database, 'chatrooms'), {
                    firstUser: myData.username,
                    secondUser: user.username,
                    messages: [],
                });

                // Get the unique key of the chatroom
                const newChatroomId = newChatroomRef.key;

                const userFriends = user.friends || [];
                //join myself to this user friend list
                update(ref(database, `users/${user.username}`), {
                    friends: [
                        ...userFriends,
                        {
                            username: myData.username,
                            avatar: myData.avatar,
                            chatroomId: newChatroomId,
                        },
                    ],
                });

                const myFriends = myData.friends || [];
                const newFriend = {
                    username: user.username,
                    avatar: user.avatar,
                    chatroomId: newChatroomId,
                };
                dispatch(updateUser({
                    ...myData,
                    friends: [ newFriend, ...myFriends ]
                }));
                //add this user to my friend list
                update(ref(database, `users/${myData.username}`), {
                    friends: [...myFriends, newFriend],
                });
            }
            setFriendUsername("");
            setShowInput(false);
        } catch (error) {
            Alert.alert(error.message);
            console.error(error);
        }
    };

    const findUser = async (name) => {
        const mySnapshot = await get(ref(database, `users/${name}`));
        return mySnapshot.val();
    };

    return (
        <SafeAreaView
            style={{ flex: 1 }}
        >
            <StatusBar hidden />
            <View
                style={{
                    flex: 1,
                    backgroundColor: '#fff',
                    justifyContent: 'flex-start',
                    alignItems: 'flex-start',
                }}
            >
                {
                    showInput ?
                        <View style={styles.addUser}>
                            <TextInput
                                placeholder="Type friend's username"
                                style={styles.input}
                                onChangeText={setFriendUsername}
                                value={friendUsername}
                            />
                            <Button
                                title={' + '} onPress={() => onAddFriend()}
                            />
                        </View>
                        :
                        <View
                            style={{ width: '100%', paddingLeft: 20, paddingRight: 15, paddingVertical: 10, flexDirection: 'row', justifyContent: "space-between", alignItems: 'center' }}
                        >
                            <TouchableOpacity
                                onPress={() => setShowInput(true)}
                            >
                                <Icon.Search stroke="#0c000e" strokeWidth={1} fill="#f6f7fb" height={35} width={35} />
                            </TouchableOpacity>
                            <Text
                                style={{ fontSize: 18, fontWeight: 'bold' }}
                            >Welcome {currentUser}</Text>
                            <Image
                                source={CHAT}
                                style={{
                                    height: 40,
                                    width: 40,
                                    marginRight: 15,
                                    borderRadius: 100
                                }}
                            />
                        </View>}

                <FlatList
                    data={users}
                    renderItem={({ item }) => renderUser(item, navigation, myData)}
                    keyExtractor={item => `${item._id}`}
                />

            </View>

        </SafeAreaView>
    );
}

export default Home;


const renderUser = (item, navigation, myData) => {
    const data = {
        selectedUser: item,
        myData: myData
    }
    return (
        <Pressable onPress={() => navigation.navigate("Chat", data)} style={styles.row}>
            <Image style={styles.avatar} source={{ uri: item.avatar }} />
            <Text>{item.username}</Text>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    avatar: {
        width: 50,
        height: 50,
        marginRight: 10,
    },
    row: {
        flexDirection: 'row',
        padding: 10,
        alignItems: 'center',
        borderBottomColor: '#cacaca',
        borderBottomWidth: 1,
        width: '100%'
    },
    addUser: {
        flexDirection: 'row',
        padding: 10,
    },
    input: {
        backgroundColor: '#cacaca',
        flex: 1,
        marginRight: 10,
        padding: 10,
    },
});