import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

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
        <Modal visible={visivel} animationType="slide">
            <View style={styles.container}>
                <Text style={styles.titulo}>Nova planta</Text>
                <TextInput style={styles.input} placeholder="Nome" value={nome} onChangeText={setNome} />
                <TextInput style={styles.input} placeholder="Quantidade" value={quantidade} onChangeText={setQuantidade} />
                <TextInput style={styles.input} placeholder="Observações" value={observacoes} onChangeText={setObservacoes} />
                <TouchableOpacity style={styles.botao} onPress={handleSalvar}>
                    <Text style={styles.textoBotao}>Salvar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelar} onPress={aoFechar}>
                    <Text>Cancelar</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    titulo: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    botao: {
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    textoBotao: {
        color: '#fff',
        fontWeight: 'bold',
    },
    cancelar: {
        alignItems: 'center',
        marginTop: 20,
    },
});