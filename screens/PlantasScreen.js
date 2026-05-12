import React, { useState, useEffect } from 'react';

import {
    View,
    Text,
    FlatList,
    TextInput,
    TouchableOpacity,
    Modal,
    StyleSheet,
    ScrollView
} from 'react-native';

import PlantaItem from '../components/PlantaItem';

import {
    buscarPlantas,
    salvarPlantas
} from '../services/storage';

export default function PlantasScreen({ route, navigation }) {

    const { nomeUsuario } = route.params;

    const [plantas, setPlantas] = useState([]);
    const [nome, setNome] = useState('');
    const [quantidade, setQuantidade] = useState('');
    const [observacoes, setObservacoes] = useState('');

    const [modalVisible, setModalVisible] = useState(false);
    const [modalDetalhes, setModalDetalhes] = useState(false);

    const [plantaSelecionada, setPlantaSelecionada] = useState(null);
    const [filtro, setFiltro] = useState('');
    const [abaSelecionada, setAbaSelecionada] = useState('plantas');

    useEffect(() => {
        carregar();
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

    const plantasFiltradas = plantas.filter(item =>
        item.nome.toLowerCase().includes(filtro.toLowerCase())
    );

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
                    onPress={() => navigation.navigate('P')}
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
                <Text style={styles.textoBotao}>
                    + Nova planta
                </Text>
            </TouchableOpacity>


            {/* Modal nova planta */}

            <Modal visible={modalVisible} animationType="slide">

                <View style={styles.modal}>

                    <Text style={styles.modalTitulo}>
                        Nova planta
                    </Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Nome"
                        value={nome}
                        onChangeText={setNome}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Quantidade"
                        value={quantidade}
                        onChangeText={setQuantidade}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Observações"
                        value={observacoes}
                        onChangeText={setObservacoes}
                    />

                    <TouchableOpacity
                        style={styles.botao}
                        onPress={adicionarPlanta}
                    >
                        <Text style={styles.textoBotao}>Salvar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.cancelar}
                        onPress={() => setModalVisible(false)}
                    >
                        <Text>Cancelar</Text>
                    </TouchableOpacity>

                </View>
            </Modal>


            {/* Modal detalhes */}

            <Modal visible={modalDetalhes} animationType="slide">

                <ScrollView style={styles.modal}>

                    {plantaSelecionada && (
                        <>
                            <Text style={styles.modalTitulo}>
                                {plantaSelecionada.nome}
                            </Text>

                            {plantaSelecionada.cuidados.map(c => (
                                <Text key={c.id} style={styles.cuidado}>
                                    {c.nome}
                                </Text>
                            ))}

                            <TouchableOpacity
                                style={styles.cancelar}
                                onPress={() => setModalDetalhes(false)}
                            >
                                <Text>Fechar</Text>
                            </TouchableOpacity>
                        </>
                    )}

                </ScrollView>
            </Modal>

        </View>
    );
}

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
    }

});