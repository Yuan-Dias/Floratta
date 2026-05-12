import React, { useState, useCallback } from 'react';
import {
    View, Text, FlatList, StyleSheet, TouchableOpacity, ScrollView
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { buscarPlantas, salvarPlantas } from '../services/storage';
import { obterStatusCuidadoNaData, getFrequenciaEmDias } from '../utils/cuidadosHelper';
import { formatarFrequencia } from '../utils/formatacao';

const FILTROS = [
    { label: 'Todos', value: 'todos' },
    { label: 'Pendentes', value: 'pendentes' },
    { label: 'Concluídos', value: 'concluidos' },
];

export default function TarefasDiaScreen() {
    const [dataSelecionada, setDataSelecionada] = useState(new Date());
    const [tarefas, setTarefas] = useState([]);
    const [filtroStatus, setFiltroStatus] = useState('todos');

    useFocusEffect(
        useCallback(() => {
            carregar();
        }, [dataSelecionada])
    );

    async function carregar() {
        const plantas = await buscarPlantas();
        const inicioDia = new Date(dataSelecionada);
        inicioDia.setHours(0, 0, 0, 0);
        const lista = [];

        plantas.forEach(planta => {
            planta.cuidados.forEach(c => {
                const status = obterStatusCuidadoNaData(c, inicioDia);
                lista.push({
                    ...c,
                    planta: planta.nome,
                    plantaId: planta.id,
                    status,
                });
            });
        });

        setTarefas(lista);
    }

    const mudarData = (dias) => {
        const nova = new Date(dataSelecionada);
        nova.setDate(nova.getDate() + dias);
        setDataSelecionada(nova);
    };

    const irParaHoje = () => {
        setDataSelecionada(new Date());
    };

    // Concluir na data selecionada
    async function concluirNaData(cuidadoId) {
        const plantas = await buscarPlantas();
        const dataConclusao = new Date(dataSelecionada);
        dataConclusao.setHours(0, 0, 0, 0);

        const novasPlantas = plantas.map(p => ({
            ...p,
            cuidados: p.cuidados.map(c => {
                if (c.id === cuidadoId) {
                    return { ...c, ultimaConclusao: dataConclusao.toISOString() };
                }
                return c;
            })
        }));

        await salvarPlantas(novasPlantas);
        carregar();
    }

    // Desmarcar (ajusta para que fique pendente na data)
    async function desmarcar(cuidadoId) {
        const plantas = await buscarPlantas();
        const novasPlantas = plantas.map(p => ({
            ...p,
            cuidados: p.cuidados.map(c => {
                if (c.id === cuidadoId) {
                    // Força o próximo vencimento na data selecionada
                    const diasFreq = getFrequenciaEmDias(c);
                    const dataUltimaConclusao = new Date(dataSelecionada);
                    dataUltimaConclusao.setDate(dataUltimaConclusao.getDate() - diasFreq);
                    return { ...c, ultimaConclusao: dataUltimaConclusao.toISOString() };
                }
                return c;
            })
        }));
        await salvarPlantas(novasPlantas);
        carregar();
    }

    const tarefasFiltradas = tarefas.filter(item => {
        if (filtroStatus === 'todos') return true;
        if (filtroStatus === 'pendentes') return item.status === 'pendente' || item.status === 'atrasado';
        if (filtroStatus === 'concluidos') return item.status === 'concluido';
        return true;
    });

    const totalFiltrado = tarefasFiltradas.length;
    const concluidasFiltrado = tarefasFiltradas.filter(t => t.status === 'concluido').length;

    const formatarData = (data) => {
        return data.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' });
    };

    const renderItem = ({ item }) => {
        const icone =
            item.status === 'concluido' ? '✅' :
                item.status === 'atrasado' ? '🔴' :
                    item.status === 'pendente' ? '🟡' : '⬜';

        const mensagemForaPrazo = item.status === 'fora_prazo' ? ' (não é dia de realizar)' : '';

        return (
            <View style={styles.item}>
                <Text style={styles.iconeStatus}>{icone}</Text>
                <TouchableOpacity
                    style={{ flex: 1 }}
                    onPress={() => navigation.navigate('DetalhesCuidado', {
                        id: item.id,
                        nome: item.nome,
                        planta: item.planta,
                        frequencia: item.frequencia,
                        status: item.status,
                    })}
                >
                    <Text style={styles.nomeCuidado}>{item.nome}</Text>
                    <Text style={styles.info}>
                        {item.planta} · {formatarFrequencia(item.frequencia)}{mensagemForaPrazo}
                    </Text>
                </TouchableOpacity>
                {/* Checkbox SEMPRE ativo */}
                <TouchableOpacity
                    style={styles.checkboxContainer}
                    onPress={() => {
                        if (item.status === 'concluido') {
                            desmarcar(item.id);
                        } else {
                            concluirNaData(item.id);
                        }
                    }}
                >
                    <View style={[
                        styles.checkbox,
                        item.status === 'concluido' && styles.checkboxChecked,
                    ]}>
                        {item.status === 'concluido' && <Text style={styles.checkmark}>✓</Text>}
                    </View>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.cabecalhoData}>
                <TouchableOpacity onPress={() => mudarData(-1)} style={styles.seta}>
                    <Text style={styles.setaTexto}>←</Text>
                </TouchableOpacity>
                <Text style={styles.dataTexto}>{formatarData(dataSelecionada)}</Text>
                <TouchableOpacity onPress={() => mudarData(1)} style={styles.seta}>
                    <Text style={styles.setaTexto}>→</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={irParaHoje} style={styles.botaoHoje}>
                    <Text style={styles.botaoHojeTexto}>Hoje</Text>
                </TouchableOpacity>
            </View>

            <ScrollView horizontal style={styles.filtrosContainer} showsHorizontalScrollIndicator={false}>
                {FILTROS.map(filtro => (
                    <TouchableOpacity
                        key={filtro.value}
                        style={[
                            styles.filtroBotao,
                            filtroStatus === filtro.value && styles.filtroBotaoAtivo,
                        ]}
                        onPress={() => setFiltroStatus(filtro.value)}
                    >
                        <Text style={[
                            styles.filtroTexto,
                            filtroStatus === filtro.value && styles.filtroTextoAtivo,
                        ]}>{filtro.label}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <Text style={styles.progresso}>
                {concluidasFiltrado}/{totalFiltrado} concluídos
            </Text>

            <FlatList
                data={tarefasFiltradas}
                keyExtractor={item => item.id}
                renderItem={renderItem}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f3faf3',
        padding: 20,
    },
    cabecalhoData: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },
    seta: {
        padding: 8,
    },
    setaTexto: {
        fontSize: 22,
        color: '#2e7d32',
    },
    dataTexto: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2e7d32',
        marginHorizontal: 15,
        minWidth: 120,
        textAlign: 'center',
    },
    botaoHoje: {
        marginLeft: 10,
        backgroundColor: '#a5d6a7',
        paddingVertical: 4,
        paddingHorizontal: 12,
        borderRadius: 15,
    },
    botaoHojeTexto: {
        color: '#1b5e20',
        fontWeight: 'bold',
    },
    filtrosContainer: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    filtroBotao: {
        paddingVertical: 6,
        paddingHorizontal: 14,
        backgroundColor: '#e0e0e0',
        borderRadius: 20,
        marginRight: 8,
    },
    filtroBotaoAtivo: {
        backgroundColor: '#4CAF50',
    },
    filtroTexto: {
        color: '#333',
        fontSize: 13,
    },
    filtroTextoAtivo: {
        color: '#fff',
        fontWeight: 'bold',
    },
    progresso: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 15,
        color: '#333',
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        borderLeftWidth: 4,
        borderLeftColor: '#4CAF50',
    },
    iconeStatus: {
        fontSize: 22,
        marginRight: 12,
    },
    nomeCuidado: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    info: {
        color: '#666',
        marginTop: 2,
    },
    checkboxContainer: {
        padding: 8,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderWidth: 2,
        borderColor: '#4CAF50',
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxChecked: {
        backgroundColor: '#4CAF50',
    },
    checkboxDisabled: {
        borderColor: '#ccc',
        backgroundColor: '#f0f0f0',
    },
    checkmark: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});