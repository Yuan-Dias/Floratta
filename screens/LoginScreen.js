import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export default function LoginScreen({ navigation }) {
    const [nome, setNome] = useState('');

    const entrar = () => {
        if (!nome.trim()) return;
        navigation.navigate('MainTabs', { nomeUsuario: nome.trim() });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.logo}>Floratta</Text>
            <Text style={styles.frase}>cuidar e fazer florescer</Text>

            <TextInput
                style={styles.input}
                placeholder="Digite seu nome"
                value={nome}
                onChangeText={setNome}
            />

            <TouchableOpacity style={styles.botao} onPress={entrar}>
                <Text style={styles.textoBotao}>Entrar</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f3faf3',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    logo: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#2e7d32',
        marginBottom: 5,
    },
    frase: {
        color: '#666',
        marginBottom: 40,
    },
    input: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        width: '100%',
        marginBottom: 20,
    },
    botao: {
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 10,
        width: '100%',
        alignItems: 'center',
    },
    textoBotao: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18,
    },
});