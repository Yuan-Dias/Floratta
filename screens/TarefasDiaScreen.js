import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { buscarPlantas, salvarPlantas } from '../services/storage';

export default function TarefasDiaScreen() {
    const [tarefas, setTarefas] = useState([]);
    const navigation = useNavigation();

    // Recarrega sempre que a tela ganhar foco (volta do DetalhesScreen por exemplo)
    useFocusEffect(
        useCallback(() => {
            carregar();
        }, [])
    );

    async function carregar() {
        const plantas = await buscarPlantas();
        const lista = [];
        plantas.forEach(planta => {
            planta.cuidados.forEach(c => {
                lista.push({
                    ...c,
                    planta: planta.nome,
                    plantaId: planta.id, // necessário para atualizar depois
                });
            });
        });
        setTarefas(lista);
    }

    const concluidas = tarefas.filter(t => t.concluido).length;

    // Função que será passada para o DetalhesScreen alternar o status
    const handleAlternar = async (id) => {
        const plantas = await buscarPlantas();
        let atualizado = false;

        const novasPlantas = plantas.map(planta => {
            const cuidadosAtualizados = planta.cuidados.map(c => {
                if (c.id === id) {
                    atualizado = true;
                    return { ...c, concluido: !c.concluido };
                }
                return c;
            });
            return { ...planta, cuidados: cuidadosAtualizados };
        });

        if (atualizado) {
            await salvarPlantas(novasPlantas);
            // Recarregar as tarefas para refletir a mudança
            carregar();
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Tarefas do dia</Text>
            <Text style={styles.progresso}>
                {concluidas}/{tarefas.length}
            </Text>
            <Text style={styles.barra}>
                {'█'.repeat(concluidas)}{'░'.repeat(tarefas.length - concluidas)}
            </Text>

            <FlatList
                data={tarefas}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.item}
                        onPress={() =>
                            navigation.navigate('DetalhesTarefa', {
                                id: item.id,
                                planta: item.planta,
                                cuidado: item.nome,
                                frequencia: item.frequencia || 'Não definida',
                                concluida: item.concluido,
                            })
                        }
                    >
                        <Text style={styles.itemTexto}>
                            {item.concluido ? '✅' : '⬜'} {item.nome} - {item.planta}
                        </Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f3faf3'
    },
    titulo: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2e7d32'
    },
    progresso: {
        fontSize: 22,
        marginTop: 15
    },
    barra: {
        fontSize: 18,
        marginBottom: 20,
        color: '#4CAF50'
    },
    item: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
    },
    itemTexto: {
        fontSize: 16
    },
});