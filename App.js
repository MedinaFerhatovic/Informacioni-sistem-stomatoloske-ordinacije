import React, { useEffect, useState, useRef } from 'react';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { Animated, View, Image, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import MyProfileScreen from './screens/MyProfileScreen';
import LogoutScreen from './screens/LogoutScreen';
import AppointmentsScreen from './screens/AppointmentsScreen';
import MyReservations from './screens/MyReservationsScreen';
import DentalRecordsScreen from './screens/DentalRecordsScreen';
import DentalRecordDetailScreen from './screens/DentalRecordDetailScreen';
import RegistrationScreen from './screens/RegistrationScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();


function CustomDrawerContent(props) {
    return (
        <DrawerContentScrollView {...props}>
            <View style={{ alignItems: 'center', padding: 20 }}>
                <Image
                    source={require('./assets/logo.png')} 
                    style={{ width: 130, height: 160, marginBottom: 20 }}
                />
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#004aad' }}>Dobrodošli!</Text>
            </View>
            <DrawerItemList {...props} />
        </DrawerContentScrollView>
    );
}

function HomeDrawer() {
    return (
        <Drawer.Navigator
            drawerContent={props => <CustomDrawerContent {...props} />}
            screenOptions={{
                headerShown: true,
                drawerActiveTintColor: '#004aad',
                drawerInactiveTintColor: '#000',  
                drawerLabelStyle: { fontSize: 16 },
            }}
        >
            <Drawer.Screen 
                name="Početna stranica" 
                component={HomeScreen} 
                options={{
                    drawerIcon: ({ color, size }) => (
                        <Icon name="home" size={size} color={color} />
                    ),
                    headerShown: true,
                }} 
            />
            <Drawer.Screen 
                name="MyProfile" 
                component={MyProfileScreen} 
                options={{
                    title: 'Moj profil',
                    drawerLabel: 'Moj profil',
                    drawerIcon: ({ color, size }) => (
                        <Icon name="person" size={size} color={color} />
                    ),
                    headerShown: true,
                }}
            />
            <Drawer.Screen 
                name="MyReservations" 
                component={MyReservations} 
                options={{
                    title: 'Moje rezervacije',
                    drawerLabel: 'Moje rezervacije',
                    drawerIcon: ({ color, size }) => (
                        <Icon name="event" size={size} color={color} />
                    ),
                    headerShown: true,
                }}
            />
            <Drawer.Screen 
                name="DentalRecords" 
                component={DentalRecordsScreen} 
                options={{
                    title: 'Stomatološki karton',
                    drawerLabel: 'Stomatološki karton',
                    drawerIcon: ({ color, size }) => (
                        <Icon name="assignment" size={size} color={color} />
                    ),
                    headerShown: true,
                }}
            />
            <Drawer.Screen 
                name="Logout"
                component={LogoutScreen}
                options={{
                    drawerLabel: 'Odjava',
                    drawerIcon: ({ color, size }) => (
                        <Icon name="exit-to-app" size={size} color={color} />
                    ),
                    drawerItemStyle: { marginTop: 230 },  
                    headerShown: false,
                }}
            />
        </Drawer.Navigator>
    );
}

export default function App() {
    

    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen 
                    name="Login" 
                    component={LoginScreen} 
                    options={{ headerShown: false }}  
                />
                <Stack.Screen 
                    name="Register" 
                    component={RegistrationScreen} 
                    options={{ headerShown: false }}  
                />
                <Stack.Screen 
                    name="ForgotPassword" 
                    component={ForgotPasswordScreen}
                    options={{ headerShown: false }} />
                <Stack.Screen 
                    name="HomeDrawer" 
                    component={HomeDrawer} 
                    options={{ headerShown: false }}  
                />
                <Stack.Screen 
                    name="MyProfileScreen" 
                    component={MyProfileScreen} 
                    options={{ headerShown: false }}  
                />
                <Stack.Screen 
                    name="Appointments" 
                    component={AppointmentsScreen} 
                    options={{ headerShown: false, title: 'Termini'}}  
                />
                  <Stack.Screen name="DentalRecords" component={DentalRecordsScreen} options={{ title: 'Dental Records' }} />
                  <Stack.Screen name="DentalRecordDetailScreen" component={DentalRecordDetailScreen} options={{ title: 'Detalji stomatološkog kartona' }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
