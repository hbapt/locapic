import React from 'react';

import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Warning: ...']);

import { SafeAreaProvider } from 'react-native-safe-area-context';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Ionicons, FontAwesome } from '@expo/vector-icons';

import HomeScreen from './screens/HomeScreen';
import MapScreen from './screens/MapScreen';
import ChatScreen from './screens/ChatScreen';

import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import ListScreen from './screens/ListScreen';
import pseudo from './reducers/pseudo';
import addPOIList from './reducers/addPOIList';
const store = createStore(combineReducers({ pseudo, addPOIList }));

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={
                ({ route }) => ({
                    headerShown: false,
                    tabBarStyle: { backgroundColor: '#130f40' },
                    tabBarIcon: ({ color }) => {
                        let iconName;
                        if (route.name === 'Map') {
                            iconName = 'navigate'
                        } else if (route.name === 'Chat') {
                            iconName = 'chatbubbles'
                        } else if(route.name === 'List') {
                            iconName = 'map-marker'
                            return <FontAwesome name={iconName} size={24} color={color} />;
                        }
                        return <Ionicons name={iconName} size={24} color={color} />;
                    },
                    tabBarActiveTintColor: "#eb4d4b",
                    tabBarInactiveTintColor: "#fff",
                })
            }>
            <Tab.Screen name='Map' component={MapScreen} />
            <Tab.Screen name='Chat' component={ChatScreen} />
            <Tab.Screen name='List' component={ListScreen} />
        </Tab.Navigator>
    )
}



export default function App() {
    return (
        <Provider store={store}>
            <SafeAreaProvider>
                <NavigationContainer>
                    <Stack.Navigator screenOptions={{ headerShown: false }} >
                        <Stack.Screen name='Home' component={HomeScreen} />
                        <Stack.Screen name='TabNavigator' component={TabNavigator} />
                    </Stack.Navigator>
                </NavigationContainer>
            </SafeAreaProvider>
        </Provider>
    );
}
