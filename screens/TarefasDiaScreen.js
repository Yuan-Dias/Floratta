import React, { useState, useCallback } from 'react';
import {
    View, Text, FlatList, StyleSheet, TouchableOpacity, ScrollView, Platform
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { buscarPlantas, salvarPlantas } from '../services/storage';
import { obterStatusCuidadoNaData, getFrequenciaEmDias } from '../utils/cuidadosHelper';
import { formatarFrequencia } from '../utils/formatacao';
import CustomTabBar from '../components/CustomTabBar';
import {SafeAreaView} from "react-native-safe-area-context";

const CORES = {
    deepGreen: '#1A3C28',
    lightPink: '#FFF5F5',
    white: '#FFFFFF',
    textPrimary: '#1A3C28',
    textSecondary: '#8A8A8A',
    pendenteBg: '#FDE4E4',
    pendenteText: '#D46363',
    emDiaBg: '#E6F4EA',
    emDiaText: '#3B8250',
    atrasadaBg: '#FDE4E4',
    atrasadaText: '#D46363',
    border: '#E8E8E8',
};

const FILTROS = [
    { label: 'Todos', value: 'todos' },
    { label: 'Pendentes', value: 'pendentes' },
    { label: 'Concluídos', value: 'concluidos' },
];

export default function TarefasDiaScreen({ navigation }) {
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
                lista.push({ ...c, planta: planta.nome, plantaId: planta.id, status });
            });
        });
        setTarefas(lista);
    }

    const mudarData = (dias) => {
        const nova = new Date(dataSelecionada);
        nova.setDate(nova.getDate() + dias);
        setDataSelecionada(nova);
    };

    const irParaHoje = () => setDataSelecionada(new Date());

    async function concluirNaData(cuidadoId) {
        const plantas = await buscarPlantas();
        const dataConclusao = new Date(dataSelecionada);
        dataConclusao.setHours(0, 0, 0, 0);
        const novasPlantas = plantas.map(p => ({
            ...p,
            cuidados: p.cuidados.map(c =>
                c.id === cuidadoId ? { ...c, ultimaConclusao: dataConclusao.toISOString() } : c
            )
        }));
        await salvarPlantas(novasPlantas);
        carregar();
    }

    async function desmarcar(cuidadoId) {
        const plantas = await buscarPlantas();
        const novasPlantas = plantas.map(p => ({
            ...p,
            cuidados: p.cuidados.map(c => {
                if (c.id === cuidadoId) {
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

    const concluidasFiltrado = tarefasFiltradas.filter(t => t.status === 'concluido').length;

    const formatarData = (data) =>
        data.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' });

    const renderItem = ({ item }) => {
        let iconeNome = 'square';
        let corIcone = '#8A8A8A';
        if (item.status === 'concluido') { iconeNome = 'check-circle'; corIcone = '#3B8250'; }
        else if (item.status === 'atrasado') { iconeNome = 'alert-circle'; corIcone = '#D46363'; }
        else if (item.status === 'pendente') { iconeNome = 'clock'; corIcone = '#D49232'; }
        const mensagemForaPrazo = item.status === 'fora_prazo' ? ' (não é dia de realizar)' : '';

        return (
            <View style={styles.item}>
                <Feather name={iconeNome} size={22} color={corIcone} style={{ marginRight: 12 }} />
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
                <TouchableOpacity
                    style={styles.checkboxContainer}
                    onPress={() => item.status === 'concluido' ? desmarcar(item.id) : concluirNaData(item.id)}
                >
                    <View style={[styles.checkbox, item.status === 'concluido' && styles.checkboxChecked]}>
                        {item.status === 'concluido' && <Feather name="check" size={14} color={CORES.emDiaText} />}
                    </View>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.curvedHeader}>
                <View style={styles.headerTop}>
                    <Feather name="arrow-left" size={26} color={CORES.white} onPress={() => navigation.replace('Home')} />
                    <View style={styles.logoCenter}>
                        <MaterialCommunityIcons name="flower-tulip" size={32} color="#FCA5A5" />
                        <Text style={styles.logoTitle}>Floratta</Text>
                        <Text style={styles.logoSubtitle}>TAREFAS DO DIA</Text>
                    </View>
                    <View style={{ width: 26 }} />
                </View>
            </View>

            <View style={styles.mainContent}>
                <View style={styles.cabecalhoData}>
                    <TouchableOpacity onPress={() => mudarData(-1)} style={styles.seta}>
                        <Feather name="chevron-left" size={22} color={CORES.deepGreen} />
                    </TouchableOpacity>
                    <Text style={styles.dataTexto}>{formatarData(dataSelecionada)}</Text>
                    <TouchableOpacity onPress={() => mudarData(1)} style={styles.seta}>
                        <Feather name="chevron-right" size={22} color={CORES.deepGreen} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={irParaHoje} style={styles.botaoHoje}>
                        <Text style={styles.botaoHojeTexto}>Hoje</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView horizontal style={styles.filtrosContainer} showsHorizontalScrollIndicator={false}>
                    {FILTROS.map(filtro => (
                        <TouchableOpacity
                            key={filtro.value}
                            style={[styles.filtroBotao, filtroStatus === filtro.value && styles.filtroBotaoAtivo]}
                            onPress={() => setFiltroStatus(filtro.value)}
                        >
                            <Text style={[styles.filtroTexto, filtroStatus === filtro.value && styles.filtroTextoAtivo]}>
                                {filtro.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                <Text style={styles.progresso}>
                    {concluidasFiltrado}/{tarefasFiltradas.length} concluídos
                </Text>

                <FlatList
                    data={tarefasFiltradas}
                    keyExtractor={item => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingBottom: 100 }}
                    showsVerticalScrollIndicator={false}
                />
            </View>

            <CustomTabBar activeTab="Tarefas" navigation={navigation} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: CORES.lightPink },
    curvedHeader: {
        backgroundColor: CORES.deepGreen,
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
        paddingTop: Platform.OS === 'android' ? 50 : 20,
        paddingBottom: 35,
        paddingHorizontal: 25,
    },
    headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    logoCenter: { alignItems: 'center' },
    logoTitle: { fontSize: 34, fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif', color: CORES.white, marginTop: 5 },
    logoSubtitle: { fontSize: 10, color: CORES.white, letterSpacing: 1.5, marginTop: 2, opacity: 0.8 },
    mainContent: { flex: 1, paddingHorizontal: 20, paddingTop: 25 },
    cabecalhoData: {
        flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 15,
    },
    seta: { padding: 8 },
    dataTexto: {
        fontSize: 18, fontWeight: 'bold', color: CORES.deepGreen, marginHorizontal: 15, minWidth: 120, textAlign: 'center',
    },
    botaoHoje: {
        marginLeft: 10, backgroundColor: '#F3DCDC', paddingVertical: 4, paddingHorizontal: 12, borderRadius: 15,
    },
    botaoHojeTexto: { color: CORES.textPrimary, fontWeight: 'bold' },
    filtrosContainer: { flexDirection: 'row', marginBottom: 10 },
    filtroBotao: {
        paddingVertical: 6, paddingHorizontal: 14, backgroundColor: CORES.white,
        borderRadius: 20, marginRight: 8, borderWidth: 1, borderColor: CORES.border,
    },
    filtroBotaoAtivo: { backgroundColor: CORES.deepGreen, borderColor: CORES.deepGreen },
    filtroTexto: { fontSize: 13, color: CORES.textSecondary, fontWeight: '600' },
    filtroTextoAtivo: { color: CORES.white, fontWeight: 'bold' },
    progresso: { fontSize: 18, fontWeight: '600', marginBottom: 15, color: CORES.textPrimary },
    item: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: CORES.white,
        padding: 15, borderRadius: 12, marginBottom: 10,
        shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 3, elevation: 1,
    },
    nomeCuidado: { fontWeight: 'bold', fontSize: 16, color: CORES.textPrimary },
    info: { color: CORES.textSecondary, marginTop: 2 },
    checkboxContainer: { padding: 8 },
    checkbox: {
        width: 24, height: 24, borderWidth: 2, borderColor: CORES.deepGreen,
        borderRadius: 4, justifyContent: 'center', alignItems: 'center',
    },
    checkboxChecked: { backgroundColor: CORES.emDiaBg, borderColor: CORES.emDiaText },
});