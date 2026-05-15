import React, { useState } from 'react';
import {
    Modal, ScrollView, View, Text, Image, TouchableOpacity, StyleSheet, Alert, TextInput
} from 'react-native';
import { Feather } from '@expo/vector-icons';
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
                                                aoDesmarcarCuidado,
                                                aoVerTarefas,
                                                aoEditarPlanta,
                                            }) {
    const [editandoPlanta, setEditandoPlanta] = useState(false);
    const [nomeEdit, setNomeEdit] = useState(planta?.nome || '');
    const [quantidadeEdit, setQuantidadeEdit] = useState(planta?.quantidade || '');
    const [obsEdit, setObsEdit] = useState(planta?.observacoes || '');

    if (!planta) return null;

    const salvarPlanta = () => {
        if (!nomeEdit.trim()) {
            Alert.alert('Atenção', 'O nome da planta é obrigatório.');
            return;
        }
        aoEditarPlanta({
            id: planta.id,
            nome: nomeEdit.trim(),
            quantidade: quantidadeEdit,
            observacoes: obsEdit,
        });
        setEditandoPlanta(false);
    };

    return (
        <Modal visible={visivel} animationType="slide" transparent>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <View style={styles.dragHandle} />
                    <TouchableOpacity style={styles.closeBtn} onPress={aoFechar}>
                        <Feather name="x" size={20} color="#1A3C28" />
                    </TouchableOpacity>

                    <ScrollView contentContainerStyle={styles.modalScrollContent}>
                        <View style={styles.modalHeaderRow}>
                            <View style={styles.modalImgBoxHeader}>
                                <Image source={{ uri: planta.foto }} style={styles.modalImgLarge} />
                            </View>
                            <View style={styles.modalTitleArea}>
                                {editandoPlanta ? (
                                    <>
                                        <TextInput style={styles.modalTitleInput} value={nomeEdit} onChangeText={setNomeEdit} />
                                        <View style={styles.editRow}>
                                            <TextInput style={styles.inputPequeno} value={String(quantidadeEdit)} onChangeText={setQuantidadeEdit} keyboardType="numeric" placeholder="Qtd" />
                                            <TextInput style={styles.inputPequeno} value={obsEdit} onChangeText={setObsEdit} placeholder="Obs" />
                                        </View>
                                        <TouchableOpacity style={styles.btnSalvar} onPress={salvarPlanta}>
                                            <Text style={styles.btnSalvarText}>Salvar</Text>
                                        </TouchableOpacity>
                                    </>
                                ) : (
                                    <>
                                        <Text style={styles.modalTitleText}>{planta.nome}</Text>
                                        <Text style={styles.modalQtdText}>{planta.quantidade} unidades</Text>
                                        {planta.observacoes ? <Text style={styles.modalObs}>{planta.observacoes}</Text> : null}
                                        <TouchableOpacity onPress={() => setEditandoPlanta(true)} style={styles.btnEditar}>
                                            <Feather name="edit-2" size={14} color="#D46363" />
                                        </TouchableOpacity>
                                    </>
                                )}
                            </View>
                        </View>

                        <Text style={styles.sectionTitle}>Cuidados programados</Text>
                        <View style={styles.tableContainer}>
                            <View style={styles.tableHeader}>
                                <Text style={[styles.thText, { flex: 2 }]}>CUIDADO</Text>
                                <Text style={[styles.thText, { flex: 2 }]}>FREQUÊNCIA</Text>
                                <Text style={[styles.thText, { flex: 1.5 }]}>STATUS</Text>
                                <Text style={[styles.thText, { flex: 1.5, textAlign: 'center' }]}>AÇÃO</Text>
                            </View>
                            {planta.cuidados.length === 0 ? (
                                <Text style={{ textAlign: 'center', color: '#999', marginVertical: 20 }}>Nenhum cuidado cadastrado.</Text>
                            ) : (
                                planta.cuidados.map(c => {
                                    const status = obterStatusCuidado(c);
                                    let iconeNome = 'clock';
                                    let corIcone = '#D49232';
                                    let textoStatus = 'Pendente';
                                    if (status === 'concluido') {
                                        iconeNome = 'check-circle';
                                        corIcone = '#3B8250';
                                        textoStatus = 'Concluído';
                                    } else if (status === 'atrasado') {
                                        iconeNome = 'alert-circle';
                                        corIcone = '#D46363';
                                        textoStatus = 'Atrasado';
                                    }

                                    return (
                                        <View key={c.id} style={styles.trRow}>
                                            <View style={[styles.tdCol, { flex: 2, flexDirection: 'row', alignItems: 'center' }]}>
                                                <Feather name={iconeNome} size={14} color={corIcone} style={{ marginRight: 6 }} />
                                                <Text style={styles.tdTextNome}>{c.nome}</Text>
                                            </View>
                                            <Text style={[styles.tdText, { flex: 2 }]}>{formatarFrequencia(c.frequencia)}</Text>
                                            <View style={[styles.tdCol, { flex: 1.5 }]}>
                                                <View style={[styles.miniStatus, { backgroundColor: status === 'concluido' ? '#E6F4EA' : status === 'atrasado' ? '#FDE4E4' : '#FDE4E4' }]}>
                                                    <Text style={[styles.miniStatusText, { color: corIcone }]}>{textoStatus}</Text>
                                                </View>
                                            </View>
                                            <View style={[styles.tdCol, { flex: 1.5, flexDirection: 'row', justifyContent: 'center' }]}>
                                                <TouchableOpacity onPress={() => {
                                                    if (status === 'concluido') aoDesmarcarCuidado(c.id);
                                                    else aoConcluirCuidado(c.id);
                                                }}>
                                                    {status === 'concluido' ? (
                                                        <View style={styles.checkFilled}>
                                                            <Feather name="check" size={14} color="#fff" />
                                                        </View>
                                                    ) : (
                                                        <Feather name="square" size={20} color="#1A3C28" />
                                                    )}
                                                </TouchableOpacity>
                                                <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => aoEditarCuidado(c)}>
                                                    <Feather name="edit-2" size={16} color="#1A3C28" />
                                                </TouchableOpacity>
                                                <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => {
                                                    Alert.alert('Excluir', `Deseja excluir "${c.nome}"?`, [
                                                        { text: 'Cancelar' },
                                                        { text: 'Excluir', onPress: () => aoExcluirCuidado(c.id), style: 'destructive' }
                                                    ]);
                                                }}>
                                                    <Feather name="trash-2" size={16} color="#D46363" />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    );
                                })
                            )}
                        </View>

                        <TouchableOpacity style={styles.btnAddCuidado} onPress={aoAdicionarCuidado}>
                            <Feather name="plus-circle" size={18} color="#D46363" />
                            <Text style={styles.btnAddCuidadoText}>Adicionar cuidado</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modalContainer: { height: '88%', backgroundColor: '#fff', borderTopLeftRadius: 35, borderTopRightRadius: 35, paddingTop: 12 },
    dragHandle: { width: 45, height: 5, backgroundColor: '#E0E0E0', borderRadius: 3, alignSelf: 'center', marginBottom: 20 },
    closeBtn: { position: 'absolute', top: 20, right: 25, zIndex: 10 },
    modalScrollContent: { paddingHorizontal: 25, paddingBottom: 40 },
    modalHeaderRow: { flexDirection: 'row', marginBottom: 35, marginTop: 10 },
    modalImgBoxHeader: { width: 100, height: 100, backgroundColor: '#FFF5F5', borderRadius: 20, padding: 12, marginRight: 20 },
    modalImgLarge: { width: '100%', height: '100%', resizeMode: 'contain' },
    modalTitleArea: { flex: 1, justifyContent: 'center' },
    modalTitleText: { fontSize: 28, fontWeight: 'bold', color: '#1A3C28' },
    modalQtdText: { fontSize: 15, color: '#8A8A8A', marginBottom: 6 },
    modalObs: { fontSize: 13, color: '#8A8A8A', fontStyle: 'italic' },
    btnEditar: { position: 'absolute', right: 0, top: 5 },
    editRow: { flexDirection: 'row', marginTop: 8 },
    inputPequeno: { flex: 1, borderBottomWidth: 1, borderColor: '#E8E8E8', marginRight: 8, paddingVertical: 4 },
    btnSalvar: { backgroundColor: '#1A3C28', padding: 10, borderRadius: 8, alignItems: 'center', marginTop: 10 },
    btnSalvarText: { color: '#fff', fontWeight: '700' },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A3C28', marginBottom: 15 },
    tableContainer: { backgroundColor: '#FFF8F8', borderRadius: 16, padding: 12, marginBottom: 15 },
    tableHeader: { flexDirection: 'row', paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: '#F2E8E8', marginBottom: 5 },
    thText: { fontSize: 9, fontWeight: '800', color: '#B39D9D' },
    trRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F2E8E8' },
    tdCol: { justifyContent: 'center' },
    tdTextNome: { fontSize: 11, color: '#1A3C28', marginLeft: 6, fontWeight: '600' },
    tdText: { fontSize: 10, color: '#8A8A8A' },
    miniStatus: { alignSelf: 'flex-start', paddingHorizontal: 6, paddingVertical: 3, borderRadius: 6 },
    miniStatusText: { fontSize: 9, fontWeight: '700' },
    checkFilled: { width: 18, height: 18, backgroundColor: '#E6F4EA', borderRadius: 4, alignItems: 'center', justifyContent: 'center' },
    btnAddCuidado: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderWidth: 1.5, borderColor: '#F2D5D5', borderStyle: 'dashed', borderRadius: 12, marginTop: 15 },
    btnAddCuidadoText: { fontSize: 14, fontWeight: '700', color: '#D46363', marginLeft: 10 },
});