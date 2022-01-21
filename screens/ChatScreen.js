import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { StyleSheet, View, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { ListItem, Input, Button } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SimpleLineIcons } from '@expo/vector-icons';

import socketIOClient from "socket.io-client"; // Import du module client
const ip = "http://192.168.1.102"
var socket = socketIOClient(`${ip}:3000`); // Initialisation d'un web socket

function ChatScreen(props) {

    const [currentMessage, setCurrentMessage] = useState('');
    const [listMessage, setListMessage] = useState([]);

    useEffect(() => {
        socket.on('sendMessageToAll', function (messageData) {
            setListMessage([...listMessage, messageData])
        })

        return () => socket.off("sendMessageToAll")

    }, [listMessage]);

    var listMessageItems = listMessage.map((item, i) => {

        var msg = item.message.replace(/:\)/g, '\u263a');
        msg = msg.replace(/:\(/g, '\u2639');
        msg = msg.replace(/:\p/g, '\uD83D\uDE1B');

        return (
            <ListItem key={i}>
                <ListItem.Content>
                    <ListItem.Title>{msg}</ListItem.Title>
                    <ListItem.Subtitle>{item.pseudo}</ListItem.Subtitle>
                </ListItem.Content>
            </ListItem>
        )
    });

    return (

        <View style={styles.safeAreaView}>

            <SafeAreaView style={styles.safeAreaView}>

                <ScrollView>

                    {listMessageItems}

                </ScrollView>

            </SafeAreaView>

            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>

                <Input
                    placeholder="Your message"
                    onChangeText={setCurrentMessage}
                    value={currentMessage}
                />

                <Button
                    onPress={() => {
                        socket.emit("sendMessage",
                            { message: currentMessage, pseudo: props.pseudo }); setCurrentMessage('');
                    }}
                    title='Send'
                    buttonStyle={styles.button}
                    icon={
                        <SimpleLineIcons
                            name="envelope"
                            size={20}
                            color="#fff"
                            style={{ marginRight: 5 }}
                        />
                    }

                />

            </KeyboardAvoidingView>

        </View>
    );
}

const styles = StyleSheet.create({
    safeAreaView: {
        flex: 1
    },
    button: {
        backgroundColor: '#eb4d4b',
        padding: 15,
    }
});

function mapStateToProps(state) {
    return {
        pseudo: state.pseudo
    }
}
export default connect(mapStateToProps, null)(ChatScreen)