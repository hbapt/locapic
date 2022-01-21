import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { StyleSheet, View, ImageBackground } from 'react-native';

import AsyncStorage from "@react-native-async-storage/async-storage";

import { Button, Input, Text } from 'react-native-elements';
import { FontAwesome } from '@expo/vector-icons';

export function HomeScreen(props) {


    const [pseudo, setPseudo] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    useEffect(() => {
        AsyncStorage.getItem('pseudo', function (error, data) {
            if (data) {
                setPseudo(data)
                setIsSubmitted(true)
            }
        });
    }, [])

    var inputPseudo;

    !isSubmitted
        ?
        inputPseudo =
        <Input
            placeholder="John"
            leftIcon={{ type: 'font-awesome', name: 'user', color: '#eb4d4b' }}
            containerStyle={styles.input}
            onChangeText={(value) => setPseudo(value)}
        />
        :
        inputPseudo = <Text style={styles.inputPseudo}>Welcome back {pseudo} !</Text>

    return (
        <View style={styles.container}>
            <ImageBackground source={require('../assets/home.jpg')} style={styles.image}>
                {inputPseudo}
                <Button
                    buttonStyle={styles.button}
                    icon={
                        <FontAwesome
                            name="arrow-right"
                            size={20}
                            color="#eb4d4b"
                            style={{ marginRight: 5 }}
                        />
                    }
                    title='Go to Map'
                    onPress={() => { props.onSubmitPseudo(pseudo); props.navigation.navigate('TabNavigator', { screen: 'Map' }), AsyncStorage.setItem("pseudo", pseudo) }}
                />
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        flex: 1,
        justifyContent: 'center',
        height: '100%',
        width: '100%',
        resizeMode: 'cover'
    },
    button: {
        width: 140,
        alignSelf: 'center',
        borderRadius: 20,
    },
    input: {
        color: '#fff',
        width: '70%',
        alignSelf: 'center'
    },
    inputPseudo: {
        textAlign: 'center',
        marginBottom: 20,
        fontSize: 20,
        color: 'white'
    }
});

function mapDispatchToProps(dispatch) {
    return {
        onSubmitPseudo: function (pseudo) {
            dispatch({ type: 'savePseudo', pseudo: pseudo })
        }
    }
}

export default connect(null, mapDispatchToProps)(HomeScreen);
