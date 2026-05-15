import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { formatarFrequencia } from '../utils/formatacao';

export default function DetalhesCuidadoScreen({ route, navigation }) {
    const { nome, planta, frequencia, status } = route.params;

    const getIconeStatus = () => {
        if (status === 'concluido') return 'check-circle';
        if (status === 'atrasado') return 'alert-circle';
        return 'clock';
    };

    const getCorStatus = () => {
        if (status === 'concluido') return '#3B8250';
        if (status === 'atrasado') return '#D46363';
        return '#D49232';
    };

    const textoStatus = status === 'concluido' ? 'Concluído' : status === 'atrasado' ? 'Atrasado' : 'Pendente';

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <View style={styles.header}>
                    <Feather name="info" size={24} color="#1A3C28" />
                    <Text style={styles.titulo}>Detalhes do Cuidado</Text>
                </View>

                <View style={styles.row}>
                    <Feather name="heart" size={18} color="#D46363" style={{ marginRight: 10 }} />
                    <Text style={styles.label}>Cuidado</Text>
                    <Text style={styles.valor}>{nome}</Text>
                </View>

                <View style={styles.row}>
                    <Feather name="package" size={18} color="#D46363" style={{ marginRight: 10 }} />
                    <Text style={styles.label}>Planta</Text>
                    <Text style={styles.valor}>{planta}</Text>
                </View>

                <View style={styles.row}>
                    <Feather name="repeat" size={18} color="#D46363" style={{ marginRight: 10 }} />
                    <Text style={styles.label}>Frequência</Text>
                    <Text style={styles.valor}>
                        {typeof frequencia === 'string' ? frequencia : formatarFrequencia(frequencia)}
                    </Text>
                </View>

                <View style={styles.row}>
                    <Feather name={getIconeStatus()} size={18} color={getCorStatus()} style={{ marginRight: 10 }} />
                    <Text style={styles.label}>Status</Text>
                    <Text style={[styles.valor, { color: getCorStatus() }]}>{textoStatus}</Text>
                </View>
            </View>

            <TouchableOpacity style={styles.botaoVoltar} onPress={() => navigation.goBack()}>
                <Feather name="arrow-left" size={20} color="#1A3C28" style={{ marginRight: 8 }} />
                <Text style={styles.textoBotao}>Voltar</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFF5F5', justifyContent: 'center', padding: 20 },
    card: { backgroundColor: '#FFF', borderRadius: 20, padding: 24, elevation: 3 },
    header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
    titulo: { fontSize: 22, fontWeight: 'bold', color: '#1A3C28', marginLeft: 10 },
    row: { flexDirection: 'row', alignItems: 'center', marginBottom: 15, borderBottomWidth: 1, borderBottomColor: '#F2E8E8', paddingBottom: 10 },
    label: { fontSize: 14, color: '#8A8A8A', width: 100 },
    valor: { fontSize: 16, fontWeight: '600', color: '#1A3C28', flex: 1 },
    botaoVoltar: {
        flexDirection: 'row', backgroundColor: '#F3DCDC', padding: 15, borderRadius: 12,
        alignItems: 'center', justifyContent: 'center', marginTop: 20,
    },
    textoBotao: { color: '#1A3C28', fontWeight: '700', fontSize: 16 },
});