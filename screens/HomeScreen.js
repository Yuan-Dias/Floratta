import React, { useState, useEffect, useCallback } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { buscarPlantas, salvarPlantas } from '../services/storage';
import { obterStatusPlanta, getFrequenciaEmDias } from '../utils/cuidadosHelper';
import PlantaItem from '../components/PlantaItem';
import FiltrosStatus from '../components/FiltrosStatus';
import ModalNovaPlanta from '../components/ModalNovaPlanta';
import ModalDetalhesPlanta from '../components/ModalDetalhesPlanta';
import ModalFormCuidado from '../components/ModalFormCuidado';
import { useFocusEffect } from '@react-navigation/native';

export default function HomeScreen({ route, navigation }) {
    const { nomeUsuario } = route.params;

    const [plantas, setPlantas] = useState([]);
    const [filtroStatus, setFiltroStatus] = useState('todas');

    const [modalNovaPlantaVisivel, setModalNovaPlantaVisivel] = useState(false);
    const [modalDetalhesVisivel, setModalDetalhesVisivel] = useState(false);
    const [modalCuidadoVisivel, setModalCuidadoVisivel] = useState(false);
    const [plantaSelecionada, setPlantaSelecionada] = useState(null);
    const [cuidadoEditando, setCuidadoEditando] = useState(null);

    const [fraseDoDia, setFraseDoDia] = useState('');

    useEffect(() => {
        const frases = [
            'Organização é o primeiro passo para a produtividade.',
            'Pequenas ações diárias geram grandes resultados.',
            'Comece simples, mas comece.',
            'Cuidar das plantas é cuidar de si mesmo.',
            'A natureza não tem pressa, mas tudo realiza.',
        ];
        const fraseAleatoria = frases[Math.floor(Math.random() * frases.length)];
        setFraseDoDia(fraseAleatoria);
    }, []);

    useFocusEffect(
        useCallback(() => {
            carregar();
        }, [])
    );

    async function carregar() {
        const dados = await buscarPlantas();
        setPlantas(dados);
    }

    // Filtragem de plantas por status
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

    // ---------- CRUD PLANTAS ----------
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

    // NOVA FUNÇÃO: editar planta
    async function editarPlanta({ id, nome, quantidade, observacoes }) {
        const novasPlantas = plantas.map(p =>
            p.id === id ? { ...p, nome, quantidade, observacoes } : p
        );
        setPlantas(novasPlantas);
        await salvarPlantas(novasPlantas);
        const atualizada = novasPlantas.find(p => p.id === id);
        setPlantaSelecionada(atualizada);
    }

    // ---------- CRUD CUIDADOS ----------
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

    const salvarCuidado = (dados) => {
        if (dados.id) {
            editarCuidado(dados);
        } else {
            adicionarCuidado(dados);
        }
    };

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

    // ---------- RENDER ----------
    return (
        <View style={styles.container}>
            <Text style={styles.logo}>Floratta</Text>
            <Text style={styles.frase}>cuidar e fazer florescer</Text>

            <Text style={styles.boasVindas}>Olá, {nomeUsuario}</Text>
            <Text style={styles.subtexto}>
                acompanhe os cuidados e mantenha suas plantas saudáveis
            </Text>

            <View style={styles.fraseDiaContainer}>
                <Text style={styles.fraseDiaIcon}>🌱</Text>
                <Text style={styles.fraseDiaTexto}>
                    “{fraseDoDia}”
                </Text>
            </View>

            <View style={styles.abas}>
                <TouchableOpacity style={[styles.aba, styles.abaAtiva]}>
                    <Text>Plantas</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.aba} onPress={() => navigation.navigate('Tarefas')}>
                    <Text>Tarefas do dia</Text>
                </TouchableOpacity>
            </View>

            <FiltrosStatus selecionado={filtroStatus} aoSelecionar={setFiltroStatus} />

            <Text style={styles.secao}>Minhas plantas</Text>

            <FlatList
                data={plantasFiltradas}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <PlantaItem
                        item={{ ...item, status: obterStatusPlanta(item) }}
                        aoAbrir={() => {
                            setPlantaSelecionada(item);
                            setModalDetalhesVisivel(true);
                        }}
                    />
                )}
            />

            <TouchableOpacity style={styles.botaoNova} onPress={() => setModalNovaPlantaVisivel(true)}>
                <Text style={styles.textoBotao}>+ Nova planta</Text>
            </TouchableOpacity>

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
                aoVerTarefas={() => {
                    setModalDetalhesVisivel(false);
                    navigation.navigate('Tarefas');
                }}
                aoEditarPlanta={editarPlanta}   // NOVA PROP
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
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f3faf3',
        padding: 20,
    },
    logo: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#2e7d32',
        textAlign: 'center',
    },
    frase: {
        textAlign: 'center',
        color: '#666',
        marginBottom: 25,
    },
    boasVindas: {
        fontSize: 22,
        fontWeight: 'bold',
    },
    subtexto: {
        color: '#666',
        marginBottom: 20,
    },
    abas: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    aba: {
        flex: 1,
        padding: 12,
        backgroundColor: '#ddd',
        alignItems: 'center',
        borderRadius: 10,
        marginHorizontal: 5,
    },
    abaAtiva: {
        backgroundColor: '#a5d6a7',
    },
    secao: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    botaoNova: {
        backgroundColor: '#4CAF50',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 10,
    },
    textoBotao: {
        color: '#fff',
        fontWeight: 'bold',
    },

    fraseDiaContainer: {
        backgroundColor: '#e8f5e9',
        padding: 12,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    fraseDiaIcon: {
        fontSize: 20,
        marginRight: 10,
    },
    fraseDiaTexto: {
        flex: 1,
        fontStyle: 'italic',
        color: '#2e7d32',
        fontSize: 14,
    },
});