import React, { useState, useCallback, useEffect } from 'react';
import {
    FlatList, StyleSheet, Text, TouchableOpacity, View, Platform, Image, ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import {buscarNomeUsuario, buscarPlantas, salvarPlantas} from '../services/storage';
import { obterStatusPlanta, getFrequenciaEmDias } from '../utils/cuidadosHelper';
import ModalNovaPlanta from '../components/ModalNovaPlanta';
import ModalDetalhesPlanta from '../components/ModalDetalhesPlanta';
import ModalFormCuidado from '../components/ModalFormCuidado';
import CustomTabBar from '../components/CustomTabBar';

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
    amanhaBg: '#FEF0D4',
    amanhaText: '#D49232',
    border: '#E8E8E8',
};

const FiltrosStatusInline = ({ selecionado, aoSelecionar }) => {
    const filtros = [
        { id: 'todas', label: 'Todas', color: null },
        { id: 'pendentes', label: 'Pendentes', color: CORES.amanhaText },
        { id: 'atrasadas', label: 'Atrasadas', color: CORES.atrasadaText },
        { id: 'amanha', label: 'Amanhã', color: CORES.emDiaText },
        { id: 'concluidas', label: 'Concluídas', color: CORES.emDiaText },
    ];

    return (
        <View style={estilos.filtrosContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={estilos.filtrosScroll}>
                {filtros.map(f => (
                    <TouchableOpacity
                        key={f.id}
                        onPress={() => aoSelecionar(f.id)}
                        style={[estilos.filtroTag, selecionado === f.id && estilos.filtroTagAtivo]}
                    >
                        {f.color && selecionado !== f.id && <View style={[estilos.filtroPonto, { backgroundColor: f.color }]} />}
                        <Text style={[estilos.filtroTexto, selecionado === f.id && estilos.filtroTextoAtivo]}>
                            {f.label}
                        </Text>
                        {f.color && selecionado === f.id && <View style={[estilos.filtroPonto, { backgroundColor: f.color, marginLeft: 6, marginRight: 0 }]} />}
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

const PlantaItemInline = ({ item, aoAbrir }) => {
    const getStatusStyle = (status) => {
        switch (status?.toLowerCase()) {
            case 'em dia': return { bg: CORES.emDiaBg, text: CORES.emDiaText };
            case 'amanhã': return { bg: CORES.amanhaBg, text: CORES.amanhaText };
            case 'atrasada': return { bg: CORES.atrasadaBg, text: CORES.atrasadaText };
            default: return { bg: CORES.pendenteBg, text: CORES.pendenteText };
        }
    };

    const statusStyle = getStatusStyle(item.status);

    return (
        <TouchableOpacity style={estilos.plantaCard} onPress={aoAbrir} activeOpacity={0.8}>
            <View style={estilos.plantaCardImgBox}>
                <Image source={{ uri: item.foto || 'https://cdn-icons-png.flaticon.com/512/628/628324.png' }} style={estilos.plantaCardImg} />
            </View>
            <View style={estilos.plantaCardInfo}>
                <Text style={estilos.plantaCardTitle}>{item.nome}</Text>
                <Text style={estilos.plantaCardQtd}>{item.quantidade} unidade(s)</Text>
                <View style={estilos.plantaCardNextBox}>
                    <Feather name="droplet" size={12} color={CORES.pendenteText} />
                    <Text style={estilos.plantaCardNextText}>Ver cuidados</Text>
                </View>
            </View>
            <View style={estilos.plantaCardRight}>
                <View style={[estilos.cardStatusTag, { backgroundColor: statusStyle.bg }]}>
                    <Text style={[estilos.cardStatusText, { color: statusStyle.text }]}>{item.status || 'Pendente'}</Text>
                </View>
                <Text style={estilos.cardProximoLabel}>Próximo cuidado</Text>
                <Text style={estilos.cardProximoDate}>Ver lista</Text>
            </View>
            <Feather name="chevron-right" size={20} color={CORES.textSecondary} style={{ marginLeft: 10 }} />
        </TouchableOpacity>
    );
};

export default function HomeScreen({ navigation }) {
    const [plantas, setPlantas] = useState([]);
    const [filtroStatus, setFiltroStatus] = useState('todas');

    const [modalNovaPlantaVisivel, setModalNovaPlantaVisivel] = useState(false);
    const [modalDetalhesVisivel, setModalDetalhesVisivel] = useState(false);
    const [modalCuidadoVisivel, setModalCuidadoVisivel] = useState(false);
    const [plantaSelecionada, setPlantaSelecionada] = useState(null);
    const [cuidadoEditando, setCuidadoEditando] = useState(null);
    const [fraseDoDia, setFraseDoDia] = useState('');
    const [nomeUsuario, setNomeUsuario] = useState('');

    useEffect(() => {
        const frases = [
            'Organização é o primeiro passo para a produtividade.',
            'Pequenas ações diárias geram grandes resultados.',
            'Comece simples, mas comece.',
            'Cuidar das plantas é cuidar de si mesmo.',
            'A natureza não tem pressa, mas tudo realiza.',
        ];
        setFraseDoDia(frases[Math.floor(Math.random() * frases.length)]);
    }, []);

    useEffect(() => {
        (async () => {
            const nome = await buscarNomeUsuario();
            setNomeUsuario(nome);
        })();
    }, []);

    useFocusEffect(
        useCallback(() => {
            carregar();
        }, [])
    );

    async function carregar() {
        const dados = await buscarPlantas();
        setPlantas(dados || []);
    }

    const plantasFiltradas = plantas.filter(planta => {
        if (filtroStatus === 'todas') return true;
        const status = obterStatusPlanta(planta).toLowerCase();
        if (filtroStatus === 'pendentes') return status === 'pendente';
        if (filtroStatus === 'atrasadas') return status === 'atrasada';
        if (filtroStatus === 'concluidas') return status === 'em dia';
        if (filtroStatus === 'amanha') {
            const amanha = new Date();
            amanha.setDate(amanha.getDate() + 1);
            const amanhaStr = amanha.toDateString();
            return planta.cuidados.some(c => {
                const dataProx = new Date(c.ultimaConclusao || c.criadoEm);
                dataProx.setDate(dataProx.getDate() + getFrequenciaEmDias(c));
                return dataProx.toDateString() === amanhaStr;
            });
        }
        return true;
    });

    async function adicionarPlanta({ nome, quantidade, observacoes }) {
        const nova = {
            id: Date.now().toString(),
            nome,
            quantidade,
            observacoes,
            foto: 'https://cdn-icons-png.flaticon.com/512/628/628324.png',
            cuidados: [],
        };
        const lista = [...plantas, nova];
        setPlantas(lista);
        await salvarPlantas(lista);
        setModalNovaPlantaVisivel(false);
    }

    async function editarPlanta({ id, nome, quantidade, observacoes }) {
        const novasPlantas = plantas.map(p =>
            p.id === id ? { ...p, nome, quantidade, observacoes } : p
        );
        setPlantas(novasPlantas);
        await salvarPlantas(novasPlantas);
        const atualizada = novasPlantas.find(p => p.id === id);
        setPlantaSelecionada(atualizada);
    }

    async function adicionarCuidado({ nome, frequencia }) {
        const novoCuidado = {
            id: Date.now().toString(),
            nome,
            frequencia,
            ultimaConclusao: null,
            criadoEm: new Date().toISOString(),
        };
        const plantaAtualizada = {
            ...plantaSelecionada,
            cuidados: [...plantaSelecionada.cuidados, novoCuidado],
        };
        const novasPlantas = plantas.map(p =>
            p.id === plantaSelecionada.id ? plantaAtualizada : p
        );
        setPlantas(novasPlantas);
        await salvarPlantas(novasPlantas);
        setPlantaSelecionada(plantaAtualizada);
        setModalCuidadoVisivel(false);
    }

    async function editarCuidado(dados) {
        const { id, nome, frequencia } = dados;
        const novasPlantas = plantas.map(p => {
            if (p.id === plantaSelecionada.id) {
                const cuidadosAtualizados = p.cuidados.map(c =>
                    c.id === id ? { ...c, nome, frequencia } : c
                );
                return { ...p, cuidados: cuidadosAtualizados };
            }
            return p;
        });
        setPlantas(novasPlantas);
        await salvarPlantas(novasPlantas);
        const plantaAtualizada = novasPlantas.find(p => p.id === plantaSelecionada.id);
        setPlantaSelecionada(plantaAtualizada);
        setModalCuidadoVisivel(false);
        setCuidadoEditando(null);
    }

    async function excluirCuidado(id) {
        const novasPlantas = plantas.map(p => {
            if (p.id === plantaSelecionada.id) {
                const cuidadosFiltrados = p.cuidados.filter(c => c.id !== id);
                return { ...p, cuidados: cuidadosFiltrados };
            }
            return p;
        });
        setPlantas(novasPlantas);
        await salvarPlantas(novasPlantas);
        const plantaAtualizada = novasPlantas.find(p => p.id === plantaSelecionada.id);
        setPlantaSelecionada(plantaAtualizada);
    }

    async function concluirCuidado(id) {
        const novasPlantas = plantas.map(p => {
            if (p.id === plantaSelecionada.id) {
                const cuidadosAtualizados = p.cuidados.map(c =>
                    c.id === id ? { ...c, ultimaConclusao: new Date().toISOString() } : c
                );
                return { ...p, cuidados: cuidadosAtualizados };
            }
            return p;
        });
        setPlantas(novasPlantas);
        await salvarPlantas(novasPlantas);
        const plantaAtualizada = novasPlantas.find(p => p.id === plantaSelecionada.id);
        setPlantaSelecionada(plantaAtualizada);
    }

    async function desmarcarCuidado(id) {
        const novasPlantas = plantas.map(p => {
            if (p.id === plantaSelecionada.id) {
                const cuidadosAtualizados = p.cuidados.map(c => {
                    if (c.id === id) {
                        const diasFreq = getFrequenciaEmDias(c);
                        const dataUltimaConclusao = new Date();
                        dataUltimaConclusao.setDate(dataUltimaConclusao.getDate() - diasFreq);
                        return { ...c, ultimaConclusao: dataUltimaConclusao.toISOString() };
                    }
                    return c;
                });
                return { ...p, cuidados: cuidadosAtualizados };
            }
            return p;
        });
        setPlantas(novasPlantas);
        await salvarPlantas(novasPlantas);
        const plantaAtualizada = novasPlantas.find(p => p.id === plantaSelecionada.id);
        setPlantaSelecionada(plantaAtualizada);
    }

    const salvarCuidado = (dados) => {
        if (dados.id) editarCuidado(dados);
        else adicionarCuidado(dados);
    };

    return (
        <SafeAreaView style={estilos.container}>
            <View style={estilos.curvedHeader}>
                <View style={estilos.headerTop}>
                    <View style={estilos.logoCenter}>
                        <MaterialCommunityIcons name="flower-tulip" size={32} color="#FCA5A5" />
                        <Text style={estilos.logoTitle}>Floratta</Text>
                        <Text style={estilos.logoSubtitle}>CUIDAR É FAZER FLORESCER</Text>
                    </View>
                </View>
            </View>

            <View style={estilos.mainContent}>
                <View style={estilos.welcomeRow}>
                    <View>
                        <Text style={estilos.welcomeTitle}>Olá, {nomeUsuario}!</Text>
                        <Text style={estilos.welcomeSubtitle}>Gerencie suas plantas e{"\n"}acompanhe os cuidados.</Text>
                    </View>
                    <TouchableOpacity style={estilos.btnTarefasHeader} onPress={() => navigation.replace('Tarefas')}>
                        <Feather name="calendar" size={18} color={CORES.textPrimary} style={{ marginRight: 8 }} />
                        <Text style={estilos.btnTarefasText}>Tarefas do dia</Text>
                        <Feather name="chevron-right" size={18} color={CORES.textPrimary} />
                    </TouchableOpacity>
                </View>

                <View style={estilos.fraseDiaCard}>
                    <MaterialCommunityIcons name="flower-tulip" size={20} color={CORES.deepGreen} style={{ marginRight: 10 }} />
                    <Text style={estilos.fraseDiaTexto}>{fraseDoDia}</Text>
                </View>

                <View style={estilos.sectionHeaderRow}>
                    <Text style={estilos.sectionTitle}>Minhas plantas</Text>
                    <TouchableOpacity style={estilos.btnNovaPlanta} onPress={() => setModalNovaPlantaVisivel(true)}>
                        <Feather name="plus" size={18} color={CORES.white} />
                        <Text style={estilos.btnNovaPlantaText}>Nova planta</Text>
                    </TouchableOpacity>
                </View>

                <FiltrosStatusInline selecionado={filtroStatus} aoSelecionar={setFiltroStatus} />

                <FlatList
                    data={plantasFiltradas}
                    keyExtractor={item => item.id}
                    contentContainerStyle={estilos.listContainer}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <PlantaItemInline
                            item={{ ...item, status: obterStatusPlanta(item) }}
                            aoAbrir={() => {
                                setPlantaSelecionada(item);
                                setModalDetalhesVisivel(true);
                            }}
                        />
                    )}
                />
            </View>

            <CustomTabBar activeTab="Home" navigation={navigation} />

            <ModalNovaPlanta
                visivel={modalNovaPlantaVisivel}
                aoFechar={() => setModalNovaPlantaVisivel(false)}
                aoSalvar={adicionarPlanta}
            />

            <ModalDetalhesPlanta
                visivel={modalDetalhesVisivel}
                planta={plantaSelecionada}
                aoFechar={() => setModalDetalhesVisivel(false)}
                aoAdicionarCuidado={() => {
                    setCuidadoEditando(null);
                    setModalCuidadoVisivel(true);
                }}
                aoEditarCuidado={(cuidado) => {
                    setCuidadoEditando(cuidado);
                    setModalCuidadoVisivel(true);
                }}
                aoExcluirCuidado={excluirCuidado}
                aoConcluirCuidado={concluirCuidado}
                aoDesmarcarCuidado={desmarcarCuidado}
                aoEditarPlanta={editarPlanta}
            />

            <ModalFormCuidado
                visivel={modalCuidadoVisivel}
                aoFechar={() => {
                    setModalCuidadoVisivel(false);
                    setCuidadoEditando(null);
                }}
                aoSalvar={salvarCuidado}
                cuidadoInicial={cuidadoEditando}
            />
        </SafeAreaView>
    );
}

const estilos = StyleSheet.create({
    container: { flex: 1, backgroundColor: CORES.lightPink },
    curvedHeader: { backgroundColor: CORES.deepGreen, borderBottomLeftRadius: 40, borderBottomRightRadius: 40, paddingTop: Platform.OS === 'android' ? 50 : 20, paddingBottom: 35, paddingHorizontal: 25 },
    headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    logoCenter: { alignItems: 'center' },
    logoTitle: { fontSize: 34, fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif', color: CORES.white, marginTop: 5 },
    logoSubtitle: { fontSize: 10, color: CORES.white, letterSpacing: 1.5, marginTop: 2, opacity: 0.8 },
    mainContent: { flex: 1, paddingHorizontal: 20, paddingTop: 25 },
    welcomeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
    welcomeTitle: { fontSize: 26, fontWeight: 'bold', color: CORES.textPrimary, marginBottom: 6 },
    welcomeSubtitle: { fontSize: 15, color: CORES.textSecondary, lineHeight: 22 },
    btnTarefasHeader: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3DCDC', paddingHorizontal: 14, paddingVertical: 12, borderRadius: 12 },
    btnTarefasText: { fontSize: 13, fontWeight: '700', color: CORES.textPrimary, marginHorizontal: 6 },
    fraseDiaCard: {
        backgroundColor: '#FFF0F0',
        padding: 12,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    fraseDiaTexto: {
        flex: 1,
        fontStyle: 'italic',
        color: CORES.deepGreen,
        fontSize: 13,
    },
    sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    sectionTitle: { fontSize: 22, fontWeight: 'bold', color: CORES.textPrimary },
    btnNovaPlanta: { flexDirection: 'row', alignItems: 'center', backgroundColor: CORES.deepGreen, paddingHorizontal: 16, paddingVertical: 12, borderRadius: 14 },
    btnNovaPlantaText: { color: CORES.white, fontWeight: '700', fontSize: 15, marginLeft: 8 },
    filtrosContainer: { marginBottom: 20 },
    filtrosScroll: { paddingRight: 20 },
    filtroTag: { flexDirection: 'row', alignItems: 'center', backgroundColor: CORES.white, paddingHorizontal: 18, paddingVertical: 10, borderRadius: 25, marginRight: 12, borderWidth: 1, borderColor: CORES.border },
    filtroTagAtivo: { backgroundColor: CORES.deepGreen, borderColor: CORES.deepGreen },
    filtroTexto: { fontSize: 14, color: CORES.textSecondary, fontWeight: '600' },
    filtroTextoAtivo: { color: CORES.white },
    filtroPonto: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
    listContainer: { paddingBottom: 110 },
    plantaCard: { backgroundColor: CORES.white, borderRadius: 20, padding: 15, flexDirection: 'row', alignItems: 'center', marginBottom: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
    plantaCardImgBox: { width: 75, height: 75, backgroundColor: CORES.lightPink, borderRadius: 15, padding: 8, marginRight: 16 },
    plantaCardImg: { width: '100%', height: '100%', resizeMode: 'contain' },
    plantaCardInfo: { flex: 1, justifyContent: 'center' },
    plantaCardTitle: { fontSize: 20, fontWeight: '700', color: CORES.textPrimary, marginBottom: 4 },
    plantaCardQtd: { fontSize: 14, color: CORES.textSecondary, marginBottom: 8 },
    plantaCardNextBox: { flexDirection: 'row', alignItems: 'center' },
    plantaCardNextText: { fontSize: 13, color: CORES.textSecondary, marginLeft: 6 },
    plantaCardRight: { alignItems: 'flex-end', justifyContent: 'center' },
    cardStatusTag: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 14, marginBottom: 12 },
    cardStatusText: { fontSize: 12, fontWeight: '700' },
    cardProximoLabel: { fontSize: 11, color: CORES.textSecondary, marginBottom: 4 },
    cardProximoDate: { fontSize: 14, fontWeight: 'bold', color: CORES.textPrimary },
});