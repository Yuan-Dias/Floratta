import React, { useState } from 'react';
import {
    Modal, ScrollView, View, Text, Image, TouchableOpacity, StyleSheet, Alert, TextInput
} from 'react-native';
import { obterStatusCuidado } from '../utils/cuidadosHelper';
import { formatarFrequencia } from '../utils/formatacao';

export default function ModalDetalhesPlanta({
                                                visivel,
                                                planta,
                                                aoFechar,
                                                aoAdicionarCuidado,
                                                aoEditarCuidado,
                                                aoExcluirCuidado,
                                                aoConcluirCuidado,
                                                aoDesmarcarCuidado,      // necessário para alternar via checkbox
                                                aoVerTarefas,
                                                aoEditarPlanta,
                                            }) {
    const [editandoPlanta, setEditandoPlanta] = useState(false);
    const [nomeEdit, setNomeEdit] = useState('');
    const [quantidadeEdit, setQuantidadeEdit] = useState('');
    const [obsEdit, setObsEdit] = useState('');

    const iniciarEdicaoPlanta = () => {
        if (!planta) return;
        setNomeEdit(planta.nome);
        setQuantidadeEdit(planta.quantidade);
        setObsEdit(planta.observacoes || '');
        setEditandoPlanta(true);
    };

    const salvarPlanta = () => {
        if (!nomeEdit.trim()) {
            Alert.alert('Atenção', 'O nome da planta é obrigatório.');
            return;
        }
        if (aoEditarPlanta) {
            aoEditarPlanta({
                id: planta.id,
                nome: nomeEdit.trim(),
                quantidade: quantidadeEdit,
                observacoes: obsEdit,
            });
        }
        setEditandoPlanta(false);
    };

    const cancelarEdicao = () => {
        setEditandoPlanta(false);
    };

    const handleExcluir = (cuidado) => {
        Alert.alert(
            'Excluir cuidado',
            `Tem certeza que deseja excluir "${cuidado.nome}"?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Excluir', onPress: () => aoExcluirCuidado(cuidado.id), style: 'destructive' },
            ]
        );
    };

    if (!planta) return null;

    return (
        <Modal visible={visivel} animationType="slide">
            <ScrollView style={styles.container}>
                <TouchableOpacity style={styles.botaoFechar} onPress={aoFechar}>
                    <Text style={styles.iconeFechar}>✕</Text>
                </TouchableOpacity>

                <Image source={{ uri: planta.foto }} style={styles.foto} />

                {editandoPlanta ? (
                    <View style={styles.edicaoContainer}>
                        <Text style={styles.subtitulo}>Editando planta</Text>
                        <TextInput
                            style={styles.input}
                            value={nomeEdit}
                            onChangeText={setNomeEdit}
                            placeholder="Nome da planta"
                        />
                        <TextInput
                            style={styles.input}
                            value={quantidadeEdit}
                            onChangeText={setQuantidadeEdit}
                            placeholder="Quantidade"
                            keyboardType="numeric"
                        />
                        <TextInput
                            style={styles.input}
                            value={obsEdit}
                            onChangeText={setObsEdit}
                            placeholder="Observações"
                            multiline
                        />
                        <View style={styles.botoesEdicao}>
                            <TouchableOpacity style={styles.botaoSalvarPlanta} onPress={salvarPlanta}>
                                <Text style={styles.textoBotao}>Salvar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.botaoCancelar} onPress={cancelarEdicao}>
                                <Text style={styles.textoBotaoCancelar}>Cancelar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : (
                    <>
                        <Text style={styles.nomePlanta}>{planta.nome}</Text>

                        <View style={styles.infoBox}>
                            <Text style={styles.infoLabel}>Quantidade:</Text>
                            <Text style={styles.infoValue}>{planta.quantidade}</Text>
                        </View>

                        {planta.observacoes ? (
                            <View style={styles.infoBox}>
                                <Text style={styles.infoLabel}>Observações:</Text>
                                <Text style={styles.infoValue}>{planta.observacoes}</Text>
                            </View>
                        ) : null}

                        <TouchableOpacity style={styles.botaoEditarPlanta} onPress={iniciarEdicaoPlanta}>
                            <Text style={styles.textoEditarPlanta}>Editar informações</Text>
                        </TouchableOpacity>
                    </>
                )}

                <View style={styles.cabecalhoCuidados}>
                    <Text style={styles.tituloCuidados}>Cuidados</Text>
                    <TouchableOpacity style={styles.botaoNovoCuidado} onPress={aoAdicionarCuidado}>
                        <Text style={styles.textoNovoCuidado}>+ novo</Text>
                    </TouchableOpacity>
                </View>

                {planta.cuidados.length === 0 ? (
                    <Text style={styles.semCuidados}>Nenhum cuidado cadastrado.</Text>
                ) : (
                    planta.cuidados.map(c => {
                        const status = obterStatusCuidado(c);
                        const icone =
                            status === 'concluido' ? '✅' : status === 'atrasado' ? '🔴' : '🟡';
                        const textoStatus =
                            status === 'concluido'
                                ? 'Concluído hoje'
                                : status === 'atrasado'
                                    ? 'Atrasado'
                                    : 'Pendente';

                        return (
                            <View key={c.id} style={styles.itemCuidado}>
                                {/* Ícone de status (informativo) */}
                                <Text style={styles.iconeStatus}>{icone}</Text>

                                <View style={{ flex: 1 }}>
                                    <Text style={styles.nomeCuidado}>{c.nome}</Text>
                                    <Text style={styles.freqCuidado}>
                                        Frequência: {formatarFrequencia(c.frequencia)}
                                    </Text>
                                    <Text style={styles.statusCuidado}>Status: {textoStatus}</Text>
                                </View>

                                {/* Checkbox (toggle concluído/pendente) */}
                                <TouchableOpacity
                                    style={styles.checkboxContainer}
                                    onPress={() => {
                                        if (status === 'concluido') {
                                            aoDesmarcarCuidado?.(c.id);
                                        } else {
                                            aoConcluirCuidado?.(c.id);
                                        }
                                    }}
                                >
                                    <View style={[styles.checkbox, status === 'concluido' && styles.checkboxChecked]}>
                                        {status === 'concluido' && <Text style={styles.checkmark}>✓</Text>}
                                    </View>
                                </TouchableOpacity>

                                {/* Ações de editar e excluir */}
                                <View style={styles.acoesContainer}>
                                    <TouchableOpacity
                                        style={styles.botaoAcao}
                                        onPress={() => aoEditarCuidado(c)}
                                    >
                                        <Text style={styles.textoAcao}>✎</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.botaoAcao}
                                        onPress={() => handleExcluir(c)}
                                    >
                                        <Text style={[styles.textoAcao, { color: '#d32f2f' }]}>✕</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        );
                    })
                )}

                <TouchableOpacity style={styles.botaoVerTarefas} onPress={aoVerTarefas}>
                    <Text style={styles.textoVerTarefas}>Ver todas as tarefas</Text>
                </TouchableOpacity>
            </ScrollView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff' },
    botaoFechar: { alignSelf: 'flex-end', padding: 10 },
    iconeFechar: { fontSize: 20 },
    foto: {
        width: 120, height: 120, alignSelf: 'center',
        borderRadius: 20, marginBottom: 15,
    },
    nomePlanta: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    infoBox: {
        flexDirection: 'row', justifyContent: 'space-between',
        backgroundColor: '#f0f0f0', padding: 12, borderRadius: 8, marginBottom: 8,
    },
    infoLabel: { fontWeight: 'bold', color: '#555' },
    infoValue: { color: '#333' },
    botaoEditarPlanta: {
        backgroundColor: '#e0e0e0', padding: 10, borderRadius: 8,
        alignItems: 'center', marginBottom: 15,
    },
    textoEditarPlanta: { color: '#333', fontWeight: '600' },
    edicaoContainer: { marginBottom: 20 },
    subtitulo: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#2e7d32' },
    input: {
        backgroundColor: '#f9f9f9', padding: 12, borderRadius: 8,
        borderWidth: 1, borderColor: '#ddd', marginBottom: 10,
    },
    botoesEdicao: { flexDirection: 'row', justifyContent: 'space-between' },
    botaoSalvarPlanta: {
        flex: 1, backgroundColor: '#4CAF50', padding: 12,
        borderRadius: 8, alignItems: 'center', marginRight: 5,
    },
    botaoCancelar: {
        flex: 1, backgroundColor: '#e0e0e0', padding: 12,
        borderRadius: 8, alignItems: 'center', marginLeft: 5,
    },
    textoBotaoCancelar: { color: '#333', fontWeight: 'bold' },
    cabecalhoCuidados: {
        flexDirection: 'row', justifyContent: 'space-between',
        alignItems: 'center', marginTop: 20, marginBottom: 10,
    },
    tituloCuidados: { fontSize: 18, fontWeight: 'bold' },
    botaoNovoCuidado: {
        backgroundColor: '#a5d6a7', paddingHorizontal: 12,
        paddingVertical: 6, borderRadius: 15,
    },
    textoNovoCuidado: { color: '#1b5e20', fontWeight: 'bold' },
    semCuidados: { color: '#999', fontStyle: 'italic' },
    itemCuidado: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
        padding: 12, borderRadius: 10, marginBottom: 8,
        borderLeftWidth: 4, borderLeftColor: '#4CAF50',
    },
    iconeStatus: { fontSize: 22, marginRight: 12 },
    nomeCuidado: { fontWeight: 'bold', fontSize: 16 },
    freqCuidado: { color: '#666' },
    statusCuidado: { color: '#555', fontSize: 13, marginTop: 2 },
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
    checkmark: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    acoesContainer: { flexDirection: 'row', alignItems: 'center' },
    botaoAcao: { marginLeft: 8, padding: 4 },
    textoAcao: { fontSize: 18, color: '#555' },
    botaoVerTarefas: {
        backgroundColor: '#a5d6a7', padding: 14, borderRadius: 10,
        alignItems: 'center', marginTop: 20,
    },
    textoVerTarefas: { color: '#1b5e20', fontWeight: 'bold' },
});