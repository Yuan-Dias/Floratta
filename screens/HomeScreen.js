import React, { useEffect, useState } from "react";
import { buscarPlantas, salvarPlantas } from "../services/storage";
import {
    FlatList, Modal, ScrollView, StyleSheet, Text,
    TextInput, TouchableOpacity, View, Image
} from "react-native";
import PlantaItem from "../components/PlantaItem";

export default function HomeScreen({ route, navigation }) {
    const { nomeUsuario } = route.params;

    const [plantas, setPlantas] = useState([]);
    const [nome, setNome] = useState('');
    const [quantidade, setQuantidade] = useState('');
    const [observacoes, setObservacoes] = useState('');
    const [filtro, setFiltro] = useState('');

    const [modalVisible, setModalVisible] = useState(false);
    const [modalDetalhes, setModalDetalhes] = useState(false);
    const [plantaSelecionada, setPlantaSelecionada] = useState(null);
    const [abaSelecionada, setAbaSelecionada] = useState('plantas');

    // Filtro dinâmico
    const plantasFiltradas = plantas.filter(p =>
        p?.nome?.toLowerCase().includes(filtro.toLowerCase())
    );

    useEffect(() => {
        async function init() {
            await AsyncStorage.removeItem('@floratta_plantas'); // limpa dados antigos
            carregar();
        }
        init();
    }, []);

    async function carregar() {
        const dados = await buscarPlantas();
        setPlantas(dados);
    }

    async function adicionarPlanta() {
        if (!nome.trim()) return;

        const nova = {
            id: Date.now().toString(),
            nome,
            quantidade,
            observacoes,
            foto: 'https://cdn-icons-png.flaticon.com/512/628/628324.png',
            status: 'Pendente',
            cuidados: []
        };

        const lista = [...plantas, nova];
        setPlantas(lista);
        await salvarPlantas(lista);

        setNome('');
        setQuantidade('');
        setObservacoes('');
        setModalVisible(false);
    }

    return (
        <View style={styles.container}>

            <Text style={styles.logo}>Floratta</Text>
            <Text style={styles.frase}>cuidar e fazer florescer</Text>

            <Text style={styles.boasVindas}>
                Olá, {nomeUsuario}
            </Text>

            <Text style={styles.subtexto}>
                acompanhe os cuidados e mantenha suas plantas saudáveis
            </Text>

            <View style={styles.abas}>
                <TouchableOpacity
                    style={[
                        styles.aba,
                        abaSelecionada === 'plantas' && styles.abaAtiva
                    ]}
                    onPress={() => setAbaSelecionada('plantas')}
                >
                    <Text>Plantas</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.aba,
                        abaSelecionada === 'tarefas' && styles.abaAtiva
                    ]}
                    onPress={() => {
                        // Navega para a aba de Tarefas dentro do Tab.Navigator
                        navigation.navigate('Tarefas');
                    }}
                >
                    <Text>Tarefas do dia</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.secao}>Minhas plantas</Text>

            <TextInput
                style={styles.input}
                placeholder="Filtrar planta..."
                value={filtro}
                onChangeText={setFiltro}
            />

            <FlatList
                data={plantasFiltradas}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <PlantaItem
                        item={item}
                        aoAbrir={() => {
                            setPlantaSelecionada(item);
                            setModalDetalhes(true);
                        }}
                    />
                )}
            />

            <TouchableOpacity
                style={styles.botaoNova}
                onPress={() => setModalVisible(true)}
            >
                <Text style={styles.textoBotao}>+ Nova planta</Text>
            </TouchableOpacity>

            {/* Modal nova planta (inalterado, seu código está ok) */}
            <Modal visible={modalVisible} animationType="slide">
                <View style={styles.modal}>
                    <Text style={styles.modalTitulo}>Nova planta</Text>
                    <TextInput style={styles.input} placeholder="Nome" value={nome} onChangeText={setNome} />
                    <TextInput style={styles.input} placeholder="Quantidade" value={quantidade} onChangeText={setQuantidade} />
                    <TextInput style={styles.input} placeholder="Observações" value={observacoes} onChangeText={setObservacoes} />
                    <TouchableOpacity style={styles.botao} onPress={adicionarPlanta}>
                        <Text style={styles.textoBotao}>Salvar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.cancelar} onPress={() => setModalVisible(false)}>
                        <Text>Cancelar</Text>
                    </TouchableOpacity>
                </View>
            </Modal>

            <Modal visible={modalDetalhes} animationType="slide">
                <ScrollView style={styles.modal}>
                    {plantaSelecionada && (
                        <>
                            <TouchableOpacity
                                style={styles.fecharModal}
                                onPress={() => setModalDetalhes(false)}
                            >
                                <Text style={{ fontSize: 20 }}>✕</Text>
                            </TouchableOpacity>

                            <Image
                                source={{ uri: plantaSelecionada.foto }}
                                style={styles.plantaFoto}
                            />
                            <Text style={styles.modalTitulo}>{plantaSelecionada.nome}</Text>

                            <View style={styles.infoBox}>
                                <Text style={styles.infoLabel}>Quantidade:</Text>
                                <Text style={styles.infoValue}>{plantaSelecionada.quantidade}</Text>
                            </View>

                            {plantaSelecionada.observacoes ? (
                                <View style={styles.infoBox}>
                                    <Text style={styles.infoLabel}>Observações:</Text>
                                    <Text style={styles.infoValue}>{plantaSelecionada.observacoes}</Text>
                                </View>
                            ) : null}

                            <Text style={styles.subTitulo}>Cuidados</Text>

                            {plantaSelecionada.cuidados.length === 0 ? (
                                <Text style={styles.semCuidados}>Nenhum cuidado cadastrado.</Text>
                            ) : (
                                plantaSelecionada.cuidados.map(c => (
                                    <View key={c.id} style={styles.cuidadoItem}>
                                        <Text style={styles.cuidadoIcon}>
                                            {c.concluido ? '✅' : '⬜'}
                                        </Text>
                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.cuidadoNome}>{c.nome}</Text>
                                            <Text style={styles.cuidadoFreq}>Frequência: {c.frequencia || 'Não definida'}</Text>
                                        </View>
                                    </View>
                                ))
                            )}

                            {/* Se quiser um botão para ir direto para as tarefas */}
                            <TouchableOpacity
                                style={styles.botaoSecundario}
                                onPress={() => {
                                    setModalDetalhes(false);
                                    navigation.navigate('Tarefas');
                                }}
                            >
                                <Text style={styles.textoBotaoSecundario}>Ver todas as tarefas</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </ScrollView>
            </Modal>

        </View>
    );
}

// Os estilos permanecem iguais aos que você já tinha.
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f3faf3',
        padding: 20
    },
    logo: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#2e7d32',
        textAlign: 'center'
    },
    frase: {
        textAlign: 'center',
        color: '#666',
        marginBottom: 25
    },
    boasVindas: {
        fontSize: 22,
        fontWeight: 'bold'
    },
    subtexto: {
        color: '#666',
        marginBottom: 20
    },
    abas: {
        flexDirection: 'row',
        marginBottom: 20
    },
    aba: {
        flex: 1,
        padding: 12,
        backgroundColor: '#ddd',
        alignItems: 'center',
        borderRadius: 10,
        marginHorizontal: 5
    },
    abaAtiva: {
        backgroundColor: '#a5d6a7'
    },
    secao: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10
    },
    input: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10
    },
    botaoNova: {
        backgroundColor: '#4CAF50',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 10
    },
    botao: {
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10
    },
    textoBotao: {
        color: '#fff',
        fontWeight: 'bold'
    },
    modal: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff'
    },
    modalTitulo: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20
    },
    cancelar: {
        alignItems: 'center',
        marginTop: 20
    },
    cuidado: {
        padding: 10,
        backgroundColor: '#eee',
        borderRadius: 10,
        marginBottom: 10
    },
    fecharModal: {
        alignSelf: 'flex-end',
        padding: 10,
    },
    plantaFoto: {
        width: 120,
        height: 120,
        alignSelf: 'center',
        borderRadius: 20,
        marginBottom: 15,
    },
    infoBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#f0f0f0',
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
    },
    infoLabel: {
        fontWeight: 'bold',
        color: '#555',
    },
    infoValue: {
        color: '#333',
    },
    subTitulo: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
    },
    semCuidados: {
        color: '#999',
        fontStyle: 'italic',
    },
    cuidadoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 10,
        marginBottom: 8,
        borderLeftWidth: 4,
        borderLeftColor: '#4CAF50',
    },
    cuidadoIcon: {
        fontSize: 22,
        marginRight: 12,
    },
    cuidadoNome: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    cuidadoFreq: {
        color: '#666',
    },
    botaoSecundario: {
        backgroundColor: '#a5d6a7',
        padding: 14,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    textoBotaoSecundario: {
        color: '#1b5e20',
        fontWeight: 'bold',
    },
});