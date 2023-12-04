import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';

import {
    collection,
    addDoc,
    orderBy,
    query,
    onSnapshot
} from 'firebase/firestore';
import { auth, database } from '../config/firebase';

const Chat = () => {
    const [messages, setMessages] = useState([]);

    const onSend = useCallback((messages = []) => {
        setMessages(previousMessages =>
            GiftedChat.append(previousMessages, messages),
        );
        const { _id, text, createdAt, user } = messages[0];
        addDoc(collection(database, 'chats'), {
            _id,
            text,
            createdAt,
            user
        });
    }, []);

    useLayoutEffect(() => {
        const collectionRef = collection(database, 'chats');
        const q = query(collectionRef, orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(q, snapshot => {
            setMessages(
                snapshot.docs.map((doc) => ({
                    _id: doc._id,
                    text: doc.data().text,
                    createdAt: doc.data().createdAt.toDate(),
                    user: doc.data().user,
                }))
            )
        });

        return () => unsubscribe();
    }, []);

    return (
        <View style={{ flex: 1 }}>
            <GiftedChat
                messages={messages}
                onSend={messages => onSend(messages)}
                user={{
                    _id: auth?.currentUser?.email,
                    avatar: 'https://placeimg.com/140/140/any'
                }}
                messagesContainerStyle={{
                    backgroundColor: '#fff'
                }}
            />
        </View>
    );
}

export default Chat;