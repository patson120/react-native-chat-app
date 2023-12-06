import React, { useCallback, useLayoutEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';


import {
    get,
    getDatabase,
    off,
    onValue,
    ref,
    update
} from 'firebase/database';
import { useSelector } from 'react-redux';
const Chat = () => {

    const database = getDatabase();

    const state = useSelector( state => state.user);
    
    const [messages, setMessages] = useState([]);
    const [selectedUser, setSelectedUser] = useState(state.correspondant);
    const [myData, setMyData] = useState(state.user);


    useLayoutEffect
        (() => {
            //load old messages
            const loadData = async () => {
                const myChatroom = await fetchMessages();
                setMessages(renderMessages(myChatroom?.messages));
            };

            loadData();

            // set chatroom change listener
            const chatroomRef = ref(database, `chatrooms/${selectedUser?.chatroomId}`);
            onValue(chatroomRef, snapshot => {
                const data = snapshot.val();
                setMessages(renderMessages(data?.messages));
            });

            return () => {
                //remove chatroom listener
                off(chatroomRef);
            };
        }, [fetchMessages, renderMessages, selectedUser?.chatroomId]);


    const renderMessages = useCallback(
        msgs => {
            //structure for chat library:
            // msg = {
            //   _id: '',
            //   user: {
            //     avatar:'',
            //     name: '',
            //     _id: ''
            //   }
            // }

            return msgs
                ? msgs.reverse().map((msg, index) => ({
                    ...msg,
                    _id: index,
                    user: {
                        _id:
                            msg.sender === myData?.username
                                ? myData?.username
                                : selectedUser?.username,
                        avatar:
                            msg.sender === myData?.username
                                ? myData?.avatar
                                : selectedUser?.avatar,
                        name:
                            msg.sender === myData?.username
                                ? myData?.username
                                : selectedUser?.username,
                    },
                }))
                : [];
        },
        [
            myData?.avatar,
            myData?.username,
            selectedUser?.avatar,
            selectedUser?.username,
        ],
    );

    const fetchMessages = useCallback(async () => {
        const snapshot = await get(ref(database, `chatrooms/${selectedUser?.chatroomId}`));
        return snapshot.val();
    }, [selectedUser?.chatroomId]);


    const onSend = useCallback(
        async (msg = []) => {
            //send the msg[0] to the other user

            //fetch fresh messages from server
            const currentChatroom = await fetchMessages();

            let lastMessages = currentChatroom?.messages || [];

            update(ref(database, `chatrooms/${selectedUser?.chatroomId}`), {
                messages: [
                    ...lastMessages,
                    {
                        text: msg[0].text,
                        sender: myData?.username,
                        createdAt: new Date(),
                    },
                ],
            });

            setMessages(prevMessages => GiftedChat.append(prevMessages, msg));
        },
        [fetchMessages, myData?.username, selectedUser?.chatroomId],
    );

    return (
        <View style={{ flex: 1 }}>
            <Text style={{ marginTop: 18, height: 40, fontSize: 20, fontWeight: '600', textAlign: 'center', color: 'black', }}>{selectedUser?.username}</Text>
            <GiftedChat
                key={new Date().getTime()}
                messages={messages}
                onSend={messages => onSend(messages)}
                user={{
                    _id: myData.username,
                    avatar: selectedUser?.avatar
                }}
                messagesContainerStyle={{
                    backgroundColor: '#fff',
                }}

            />
        </View>
    );
}

export default Chat;