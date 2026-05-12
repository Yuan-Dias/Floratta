import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const frases = [
    'Organização é o primeiro passo para a produtividade.',
    'Pequenas ações diárias geram grandes resultados.',
    'Comece simples, mas comece.',
    'Cuidar das plantas é cuidar de si mesmo.',
    'A natureza não tem pressa, mas tudo realiza.',
];

export default function FraseDiaScreen() {
    const [frase, setFrase] = useState('');

    useEffect(() => {
        const fraseAleatoria = frases[Math.floor(Math.random() * frases.length)];
        setFrase(fraseAleatoria);
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>🌿 Frase do Dia</Text>
            <Text style={styles.frase}>{frase}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f3faf3',
        padding: 20,
    },
    titulo: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2e7d32',
        marginBottom: 20,
    },
    frase: {
        fontSize: 18,
        fontStyle: 'italic',
        textAlign: 'center',
        color: '#555',
    },
});