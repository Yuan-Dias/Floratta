import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import LoginScreen from './screens/LoginScreen';   // <-- importe corretamente
import HomeScreen from './screens/HomeScreen';
import TarefasDiaScreen from './screens/TarefasDiaScreen';
import DetalhesCuidadoScreen from './screens/DetalhesCuidadoScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function Tabs({ route }) {
    const { nomeUsuario } = route.params;

    return (
        <Tab.Navigator screenOptions={{ headerShown: false }}>
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                initialParams={{ nomeUsuario }}
            />
            <Tab.Screen
                name="Tarefas"
                component={TarefasDiaScreen}
                initialParams={{ nomeUsuario }}
            />
        </Tab.Navigator>
    );
}

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="MainTabs" component={Tabs} />
                <Stack.Screen
                    name="DetalhesCuidado"
                    component={DetalhesCuidadoScreen}
                    options={{ headerShown: true, title: 'Detalhes do Cuidado' }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}