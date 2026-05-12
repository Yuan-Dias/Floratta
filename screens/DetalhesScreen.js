import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { buscarPlantas, salvarPlantas } from '../services/storage';

export default function DetalhesScreen({ route, navigation }) {
    const {
        id,          // id do cuidado
        planta,
        cuidado,
        frequencia,
        concluida,
        // não recebe aoAlternar!
    } = route.params;

    const handleToggle = async () => {
        const plantas = await buscarPlantas();
        let atualizado = false;

        const novasPlantas = plantas.map(p => {
            const novosCuidados = p.cuidados.map(c => {
                if (c.id === id) {
                    atualizado = true;
                    return { ...c, concluido: !c.concluido };
                }
                return c;
            });
            return { ...p, cuidados: novosCuidados };
        });

        if (atualizado) {
            await salvarPlantas(novasPlantas);
        }
        navigation.goBack();  // voltar para Tarefas (que recarregará com useFocusEffect)
    };

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>🌱 Detalhes da Planta</Text>

            <View style={styles.card}>
                <Text style={styles.label}>Planta</Text>
                <Text style={styles.valor}>{planta}</Text>

                <Text style={styles.label}>Cuidado</Text>
                <Text style={styles.valor}>{cuidado}</Text>

                <Text style={styles.label}>Frequência</Text>
                <Text style={styles.valor}>{frequencia}</Text>

                <Text style={styles.label}>Status do dia</Text>
                <Text style={styles.valor}>
                    {concluida ? 'Concluído ✅' : 'Pendente 🟡'}
                </Text>
            </View>

            <TouchableOpacity
                style={[
                    styles.botaoAcao,
                    concluida ? styles.botaoDesfazer : styles.botaoConcluir,
                ]}
                onPress={handleToggle}
            >
                <Text style={styles.textoBotao}>
                    {concluida ? 'Desfazer Conclusão' : 'Marcar como Concluído'}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.voltar}
                onPress={() => navigation.goBack()}
            >
                <Text style={styles.textoVoltar}>Voltar</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
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
    botaoAcao: {
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 10,
    },
    botaoConcluir: {
        backgroundColor: '#4CAF50',
    },
    botaoDesfazer: {
        backgroundColor: '#FF9800',
    },
    textoBotao: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    voltar: {
        alignItems: 'center',
        marginTop: 10,
    },
    textoVoltar: {
        color: '#777',
        fontSize: 16,
    },
});