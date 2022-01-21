import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { ListItem } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { connect } from 'react-redux';

function ListScreen(props) {

    var removeItem = async (key) => {
        try {
            await AsyncStorage.removeItem(key);
            console.log('data removed')
            return true;
        }
        catch (exception) {
            console.log('ERR')
            return false;
        }
    }


    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeAreaView}>
                <ScrollView>
                    {props.addListPOI.map((poi, i) => {
                        return (
                            <ListItem
                                key={i}
                                onPress={() => { props.deletePOI(poi), removeItem(poi.title) }}>
                                <ListItem.Content>
                                    <ListItem.Title>Point of interest: {poi.title}</ListItem.Title>
                                    <ListItem.Subtitle>Desc: {poi.description}</ListItem.Subtitle>
                                </ListItem.Content>
                            </ListItem>
                        )
                    })}
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});

function mapStateToProps(state) {
    return {
        addListPOI: state.addPOIList,
    }
}
function mapDispatchToProps(dispatch) {
    return {
        deletePOI: (poi) => dispatch({ type: 'deletePOI', poi })
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(ListScreen)