
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
    update,
    query,
    orderByChild,
    equalTo,
} from 'firebase/database';
import { selectUser, updateCorrespondant, updateUser } from '../store';

const CHAT = require('../assets/chat.jpg');

const Home = ({ navigation }) => {
    const dispatch = useDispatch();
    const database = getDatabase();
    const userstate = useSelector(selectUser);

    const [friendUsername, setFriendUsername] = useState("");
    const [users, setUsers] = useState([]);
    const [myData, setMyData] = useState(userstate);
    const [showInput, setShowInput] = useState(false);

    useEffect(() => {
        // set friends list change listener
        console.log("User id ", userstate._id);
        const myUserRef = ref(database, `users/${userstate?._id}`);
        onValue(myUserRef, snapshot => {
            const data = snapshot.val();

            if (data) {
                dispatch(updateUser({ ...data }));
                setUsers(data.friends);
                setMyData(prevData => (prevData ? {
                    ...prevData,
                    friends: data.friends,
                } : {
                    ...data
                }
                ));

                // setMyData(userstate)
            }
        });

        return () => {
            //remove user listener
            off(myUserRef);
        };
    }, [userstate?._id]);


    const onAddFriend = async () => {

        try {
            // find user and add it to my friends and also add me to his friends

            const user = await findUserByName(friendUsername);

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

                const newChatroomRef = push(ref(database, `chatrooms`), {
                    firstUser: myData.username,
                    secondUser: user.username,
                    messages: [],
                });


                // Get the unique key of the chatroom
                const newChatroomId = newChatroomRef.key;

                const userFriends = user.friends || [];
                //join myself to this user friend list
                update(ref(database, `users/${user?._id}`), {
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
                    friends: [newFriend, ...myFriends]
                }));
                //add this user to my friend list
                update(ref(database, `users/${myData?._id}`), {
                    friends: [...myFriends, newFriend],
                });
                setFriendUsername("");
                setShowInput(false);
            }

        } catch (error) {
            Alert.alert(error.message);
            console.error(error);
        }
    };

    const findUserByName = async (name) => {
        const mySnapshot = await get(query(
            ref(database, "users"),
            orderByChild('username'),
            equalTo(name),
        ));
        return Object.entries(mySnapshot.val())[0][1];
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
                            >Welcome {userstate?.username}</Text>
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
                    horizontal={false}
                    data={users}
                    renderItem={({ item }) => renderUser(item, navigation, dispatch)}
                    keyExtractor={item => `${item._id}`}
                />

            </View>

        </SafeAreaView>
    );
}

export default Home;


const renderUser = (item, navigation, dispatch) => {

    const handleChat = () => {
        dispatch(updateCorrespondant(item))
        navigation.navigate("Chat");
    }
    return (
        <Pressable onPress={() => handleChat()} style={styles.row}>
            <Image style={styles.avatar} source={{ uri: item.avatar }} />
            <Text style={{ fontSize: 16, fontWeight: "400" }} >{item.username}</Text>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    avatar: {
        width: 50,
        height: 50,
        marginRight: 15,
        borderRadius: 100

    },
    row: {
        flex: 1,
        flexDirection: 'row',
        padding: 10,
        alignItems: 'center',
        borderBottomColor: '#cacaca',
        borderBottomWidth: 1,
        marginLeft: 15
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