import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';

const botoes = [
    { label: 'Todas', value: 'todas' },
    { label: 'Pendentes', value: 'pendentes' },
    { label: 'Atrasadas', value: 'atrasadas' },
    { label: 'Amanhã', value: 'amanha' },
    { label: 'Concluídas', value: 'concluidas' },
];

export default function FiltrosStatus({ selecionado, aoSelecionar }) {
    return (
        <ScrollView horizontal style={styles.container} showsHorizontalScrollIndicator={false}>
            {botoes.map(filtro => (
                <TouchableOpacity
                    key={filtro.value}
                    style={[styles.botao, selecionado === filtro.value && styles.botaoAtivo]}
                    onPress={() => aoSelecionar(filtro.value)}
                >
                    <Text style={[styles.texto, selecionado === filtro.value && styles.textoAtivo]}>
                        {filtro.label}
                    </Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    botao: {
        paddingVertical: 6,
        paddingHorizontal: 14,
        backgroundColor: '#e0e0e0',
        borderRadius: 20,
        marginRight: 8,
    },
    botaoAtivo: {
        backgroundColor: '#4CAF50',
    },
    texto: {
        color: '#333',
        fontSize: 13,
    },
    textoAtivo: {
        color: '#fff',
        fontWeight: 'bold',
    },
});