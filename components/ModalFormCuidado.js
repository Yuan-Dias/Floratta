import React, { useState, useEffect } from 'react';
import {
    Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert
} from 'react-native';

const TIPOS_FREQUENCIA = [
    { tipo: 'diario', label: 'Todo dia', icon: '☀️' },
    { tipo: 'dias', label: 'A cada X dias', icon: '📆' },
    { tipo: 'semanal', label: 'X vezes por semana', icon: '📅' },
];

export default function ModalFormCuidado({
                                             visivel,
                                             aoFechar,
                                             aoSalvar,
                                             cuidadoInicial = null, // se fornecido, estamos editando
                                         }) {
    const [nome, setNome] = useState('');
    const [tipoFrequencia, setTipoFrequencia] = useState('diario');
    const [valorDias, setValorDias] = useState('2');
    const [vezesSemana, setVezesSemana] = useState('2');

    useEffect(() => {
        if (cuidadoInicial) {
            setNome(cuidadoInicial.nome);
            const freq = cuidadoInicial.frequencia;
            if (freq) {
                setTipoFrequencia(freq.tipo);
                if (freq.tipo === 'dias') setValorDias(String(freq.valor));
                else if (freq.tipo === 'semanal') setVezesSemana(String(freq.valor));
                else setValorDias('1');
            }
        } else {
            setNome('');
            setTipoFrequencia('diario');
            setValorDias('2');
            setVezesSemana('2');
        }
    }, [cuidadoInicial, visivel]);

    const handleSalvar = () => {
        if (!nome.trim()) {
            Alert.alert('Atenção', 'Informe o nome do cuidado.');
            return;
        }

        let frequencia;
        if (tipoFrequencia === 'diario') {
            frequencia = { tipo: 'diario', valor: 1 };
        } else if (tipoFrequencia === 'dias') {
            const dias = parseInt(valorDias) || 2;
            frequencia = { tipo: 'dias', valor: dias };
        } else if (tipoFrequencia === 'semanal') {
            const vezes = parseInt(vezesSemana) || 2;
            frequencia = { tipo: 'semanal', valor: vezes };
        }

        aoSalvar({
            ...(cuidadoInicial ? { id: cuidadoInicial.id } : {}),
            nome: nome.trim(),
            frequencia,
        });
    };

    return (
        <Modal visible={visivel} animationType="slide" transparent>
            <View style={styles.fundo}>
                <View style={styles.card}>
                    <Text style={styles.titulo}>
                        {cuidadoInicial ? 'Editar cuidado' : 'Novo cuidado'}
                    </Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Nome do cuidado (ex: Regar)"
                        value={nome}
                        onChangeText={setNome}
                    />

                    <Text style={styles.subtitulo}>Frequência</Text>
                    <View style={styles.opcoesContainer}>
                        {TIPOS_FREQUENCIA.map(op => (
                            <TouchableOpacity
                                key={op.tipo}
                                style={[
                                    styles.opcao,
                                    tipoFrequencia === op.tipo && styles.opcaoAtiva
                                ]}
                                onPress={() => setTipoFrequencia(op.tipo)}
                            >
                                <Text style={styles.opcaoIcon}>{op.icon}</Text>
                                <Text style={[
                                    styles.opcaoLabel,
                                    tipoFrequencia === op.tipo && styles.opcaoLabelAtiva
                                ]}>{op.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {tipoFrequencia === 'dias' && (
                        <View style={styles.intervaloContainer}>
                            <Text style={styles.intervaloLabel}>A cada</Text>
                            <TextInput
                                style={styles.intervaloInput}
                                value={valorDias}
                                onChangeText={setValorDias}
                                keyboardType="numeric"
                                maxLength={2}
                            />
                            <Text style={styles.intervaloLabel}>dias</Text>
                        </View>
                    )}

                    {tipoFrequencia === 'semanal' && (
                        <View style={styles.intervaloContainer}>
                            <TextInput
                                style={styles.intervaloInput}
                                value={vezesSemana}
                                onChangeText={setVezesSemana}
                                keyboardType="numeric"
                                maxLength={1}
                            />
                            <Text style={styles.intervaloLabel}>vezes por semana</Text>
                        </View>
                    )}

                    <TouchableOpacity style={styles.botao} onPress={handleSalvar}>
                        <Text style={styles.textoBotao}>
                            {cuidadoInicial ? 'Atualizar' : 'Salvar'}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.cancelar} onPress={aoFechar}>
                        <Text>Cancelar</Text>
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
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    card: {
        backgroundColor: '#fff',
        margin: 20,
        padding: 20,
        borderRadius: 16,
    },
    titulo: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#2e7d32',
    },
    subtitulo: {
        fontSize: 16,
        fontWeight: '600',
        marginTop: 10,
        marginBottom: 10,
        color: '#333',
    },
    input: {
        backgroundColor: '#f9f9f9',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    opcoesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    opcao: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 12,
        marginHorizontal: 4,
        borderRadius: 12,
        backgroundColor: '#f0f0f0',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    opcaoAtiva: {
        backgroundColor: '#e8f5e9',
        borderColor: '#4CAF50',
    },
    opcaoIcon: {
        fontSize: 22,
    },
    opcaoLabel: {
        fontSize: 12,
        marginTop: 4,
        color: '#555',
    },
    opcaoLabelAtiva: {
        color: '#2e7d32',
        fontWeight: 'bold',
    },
    intervaloContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
    },
    intervaloLabel: {
        fontSize: 16,
        marginHorizontal: 6,
        color: '#333',
    },
    intervaloInput: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#4CAF50',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        fontSize: 16,
        width: 50,
        textAlign: 'center',
    },
    botao: {
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
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