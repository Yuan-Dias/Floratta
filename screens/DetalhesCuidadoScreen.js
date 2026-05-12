import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { formatarFrequencia } from '../utils/formatacao';

export default function DetalhesCuidadoScreen({ route, navigation }) {
    const { nome, planta, frequencia, status, id } = route.params;

    const iconeStatus = status === 'concluido' ? '✅' : status === 'atrasado' ? '🔴' : '🟡';
    const textoStatus = status === 'concluido' ? 'Concluído hoje' : status === 'atrasado' ? 'Atrasado' : 'Pendente';

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>🌱 Detalhes do Cuidado</Text>

            <View style={styles.card}>
                <Text style={styles.label}>Cuidado</Text>
                <Text style={styles.valor}>{nome}</Text>

                <Text style={styles.label}>Planta</Text>
                <Text style={styles.valor}>{planta}</Text>

                <Text style={styles.label}>Frequência</Text>
                <Text style={styles.valor}>{typeof frequencia === 'string' ? frequencia : formatarFrequencia(frequencia)}</Text>

                <Text style={styles.label}>Status</Text>
                <Text style={styles.valor}>{iconeStatus} {textoStatus}</Text>
            </View>

            <TouchableOpacity
                style={styles.botaoVoltar}
                onPress={() => navigation.goBack()}
            >
                <Text style={styles.textoBotao}>Voltar</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f3faf3',
        justifyContent: 'center',
        padding: 20,
    },
    titulo: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#4CAF50',
    },
    card: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 12,
        marginBottom: 20,
        elevation: 3,
    },
    label: {
        color: '#777',
        marginTop: 10,
    },
    valor: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    botaoVoltar: {
        backgroundColor: '#a5d6a7',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    textoBotao: {
        color: '#1b5e20',
        fontWeight: 'bold',
        fontSize: 16,
    },
});