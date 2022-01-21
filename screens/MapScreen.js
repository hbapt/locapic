import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { StyleSheet, View, Dimensions } from 'react-native';
import { Button, Overlay, Input } from 'react-native-elements';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';

export function MapScreen(props) {

    const [errorMsg, setErrorMsg] = useState(null);

    const [currentLatitude, setCurrentLatitude] = useState(0);
    const [currentLongitude, setCurrentLongitude] = useState(0);

    const [initialLatitude, setInitialLatitude] = useState(0);
    const [initialLongitude, setInitialLongitude] = useState(0);

    const [addPOI, setAddPOI] = useState(false);
    const [listPOI, setListPOI] = useState([])

    const [visible, setVisible] = useState(false);

    const [overlayTitle, setOverlayTitle] = useState('');
    const [overlayDesc, setOverlayDesc] = useState('');

    const [tempPOI, setTempPOI] = useState({});

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            // Affiche la position du user au lancement de l'app
            let location = await Location.getCurrentPositionAsync({});
            setInitialLatitude(location.coords.latitude)
            setInitialLongitude(location.coords.longitude)

            // Suivre la position du user
            await Location.watchPositionAsync({ distanceInterval: 2 }, (location) => {
                setCurrentLatitude(location.coords.latitude);
                setCurrentLongitude(location.coords.longitude)
            });
            props.addListPOI
        })();

        AsyncStorage.getItem('POI', function (error, data) {
            if (data) {
                var dataArr = JSON.parse(data)
                setListPOI(dataArr);
                props.addPOIList(dataArr)
            }
        });
    }, []);

    useEffect( () => {
        setListPOI(props.addListPOI)
    }, [props.addListPOI])

    let selectPOI = (e) => {
        if (addPOI) {
            setVisible(true)
            setAddPOI(false)
            setTempPOI({ latitude: e.nativeEvent.coordinate.latitude, longitude: e.nativeEvent.coordinate.longitude })
        }
    }

    function handleSubmit() {
        setListPOI([...listPOI, { latitude: tempPOI.latitude, longitude: tempPOI.longitude, title: overlayTitle, description: overlayDesc }])
        setVisible(false)
        setTempPOI()
        setOverlayDesc()
        setOverlayTitle()
        AsyncStorage.setItem('POI', JSON.stringify(
            [...listPOI, { latitude: tempPOI.latitude, longitude: tempPOI.longitude, title: overlayTitle, description: overlayDesc }]
        ));
        props.addPOIList([...listPOI, { latitude: tempPOI.latitude, longitude: tempPOI.longitude, title: overlayTitle, description: overlayDesc }])
    }

    let markerPOI = listPOI.map((POI, i) => {
        return (
            <Marker
                key={i}
                title={POI.title}
                description={POI.description}
                pinColor='blue'
                coordinate={{ latitude: POI.latitude, longitude: POI.longitude }}
            />
        )
    })

    const toggleOverlay = () => {
        setVisible(!visible);
    };

    var isDisabled = false;
    if (addPOI) {
        isDisabled = true;
    }

    return (
        <View style={styles.container}>
            <MapView
                region={{
                    latitude: initialLatitude,
                    longitude: initialLongitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
                style={styles.map}
                onPress={(e) => selectPOI(e)}
                loadingEnabled={true}
            >
                <Marker
                    pinColor='#eb4d4b'
                    coordinate={{ latitude: currentLatitude, longitude: currentLongitude }}
                    title={`Hello ${props.pseudo}`}
                    description='I am here'
                />
                {markerPOI}
            </MapView>

            <Button
                disabled={isDisabled}
                onPress={() => setAddPOI(true)}
                buttonStyle={styles.button}
                title='Add a Point Of Interest'
                icon={
                    <Ionicons
                        name="location-sharp"
                        size={21}
                        color="#fff"
                        style={{ marginRight: 5 }}
                    />
                }
            />

            <Overlay isVisible={visible} onBackdropPress={toggleOverlay}>
                <View style={{ width: 200 }}>
                    <Input placeholder='Title' onChangeText={setOverlayTitle} value={overlayTitle} />
                    <Input placeholder='Description' onChangeText={setOverlayDesc} value={overlayDesc} />
                    <Button title='Add POI' buttonStyle={styles.btnAddPOI} onPress={() => handleSubmit()} />
                </View>
            </Overlay>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        flex: 1,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height
    },
    button: {
        backgroundColor: '#eb4d4b',
        padding: 15,
    },
    btnAddPOI: {
        backgroundColor: '#eb4d4b',
        padding: 5,
        width: '70%',
        alignSelf: 'center',
        borderRadius: 50
    }
});

const mapStateToProps = (state) => ({
    pseudo: state.pseudo,
    addListPOI: state.addPOIList,
})

const mapDispatchToProps = (dispatch) => {
    return {
        addPOIList: (listPOI) => dispatch({ type: 'addPOIList', listPOI: listPOI }),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MapScreen);