import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import TarefasDiaScreen from './screens/TarefasDiaScreen';
import DetalhesCuidadoScreen from './screens/DetalhesCuidadoScreen';

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <SafeAreaProvider>
            <NavigationContainer>
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="Login" component={LoginScreen} />
                    <Stack.Screen name="Home" component={HomeScreen} />
                    <Stack.Screen name="Tarefas" component={TarefasDiaScreen} />
                    <Stack.Screen
                        name="DetalhesCuidado"
                        component={DetalhesCuidadoScreen}
                        options={{ headerShown: true, title: 'Detalhes do Cuidado' }}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        </SafeAreaProvider>
    );
}