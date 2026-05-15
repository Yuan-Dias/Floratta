import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function ModalNovaPlanta({ visivel, aoFechar, aoSalvar }) {
    const [nome, setNome] = useState('');
    const [quantidade, setQuantidade] = useState('');
    const [observacoes, setObservacoes] = useState('');

    const handleSalvar = () => {
        if (!nome.trim()) {
            Alert.alert('Atenção', 'Informe o nome da planta.');
            return;
        }
        aoSalvar({ nome: nome.trim(), quantidade, observacoes });
        setNome('');
        setQuantidade('');
        setObservacoes('');
    };

    return (
        <Modal visible={visivel} animationType="slide" transparent>
            <View style={styles.fundo}>
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Feather name="plus-circle" size={24} color="#D46363" />
                        <Text style={styles.titulo}>Nova planta</Text>
                    </View>

                    <Text style={styles.label}>Nome</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Nome da planta"
                        placeholderTextColor="#B39D9D"
                        value={nome}
                        onChangeText={setNome}
                    />

                    <Text style={styles.label}>Quantidade</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Quantidade"
                        placeholderTextColor="#B39D9D"
                        value={quantidade}
                        onChangeText={setQuantidade}
                        keyboardType="numeric"
                    />

                    <Text style={styles.label}>Observações</Text>
                    <TextInput
                        style={[styles.input, styles.obsInput]}
                        placeholder="Observações (opcional)"
                        placeholderTextColor="#B39D9D"
                        value={observacoes}
                        onChangeText={setObservacoes}
                        multiline
                    />

                    <TouchableOpacity style={styles.botaoSalvar} onPress={handleSalvar}>
                        <Feather name="check" size={20} color="#FFF" style={{ marginRight: 8 }} />
                        <Text style={styles.textoBotao}>Salvar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.botaoCancelar} onPress={aoFechar}>
                        <Text style={styles.textoCancelar}>Cancelar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    fundo: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 20,
    },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 24,
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    titulo: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1A3C28',
        marginLeft: 10,
        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1A3C28',
        marginBottom: 6,
        marginTop: 12,
    },
    input: {
        borderWidth: 1,
        borderColor: '#E8E8E8',
        borderRadius: 10,
        padding: 12,
        fontSize: 15,
        color: '#1A3C28',
        backgroundColor: '#FFF8F8',
    },
    obsInput: {
        height: 80,
        textAlignVertical: 'top',
    },
    botaoSalvar: {
        backgroundColor: '#1A3C28',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15,
        borderRadius: 12,
        marginTop: 20,
    },
    textoBotao: {
        color: '#FFF',
        fontWeight: '700',
        fontSize: 16,
    },
    botaoCancelar: {
        alignItems: 'center',
        marginTop: 15,
    },
    textoCancelar: {
        color: '#8A8A8A',
        fontSize: 15,
    },
});