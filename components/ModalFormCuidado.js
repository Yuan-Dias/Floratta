import React, { useState, useEffect } from 'react';
import {
    Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert
} from 'react-native';
import { Feather } from '@expo/vector-icons';

const TIPOS_FREQUENCIA = [
    { tipo: 'diario', label: 'Todo dia', icon: 'sun' },
    { tipo: 'dias', label: 'A cada X dias', icon: 'calendar' },
    { tipo: 'semanal', label: 'X vezes por semana', icon: 'repeat' },
];

export default function ModalFormCuidado({
                                             visivel, aoFechar, aoSalvar, cuidadoInicial = null,
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
                    <View style={styles.cardHeader}>
                        <Feather name={cuidadoInicial ? 'edit' : 'plus-circle'} size={24} color="#D46363" />
                        <Text style={styles.titulo}>
                            {cuidadoInicial ? 'Editar cuidado' : 'Novo cuidado'}
                        </Text>
                    </View>

                    <Text style={styles.label}>Nome do cuidado</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Ex: Regar"
                        placeholderTextColor="#B39D9D"
                        value={nome}
                        onChangeText={setNome}
                    />

                    <Text style={styles.label}>Frequência</Text>
                    <View style={styles.opcoesContainer}>
                        {TIPOS_FREQUENCIA.map(op => (
                            <TouchableOpacity
                                key={op.tipo}
                                style={[
                                    styles.opcao,
                                    tipoFrequencia === op.tipo && styles.opcaoAtiva,
                                ]}
                                onPress={() => setTipoFrequencia(op.tipo)}
                            >
                                <Feather name={op.icon} size={18} color={tipoFrequencia === op.tipo ? '#1A3C28' : '#8A8A8A'} />
                                <Text style={[styles.opcaoLabel, tipoFrequencia === op.tipo && styles.opcaoLabelAtiva]}>
                                    {op.label}
                                </Text>
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

                    <TouchableOpacity style={styles.botaoSalvar} onPress={handleSalvar}>
                        <Feather name="check" size={20} color="#FFF" style={{ marginRight: 8 }} />
                        <Text style={styles.textoBotao}>{cuidadoInicial ? 'Atualizar' : 'Salvar'}</Text>
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
    fundo: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)', padding: 20 },
    card: { backgroundColor: '#FFF', borderRadius: 20, padding: 24, elevation: 5 },
    cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
    titulo: { fontSize: 22, fontWeight: 'bold', color: '#1A3C28', marginLeft: 10 },
    label: { fontSize: 14, fontWeight: '600', color: '#1A3C28', marginBottom: 6, marginTop: 12 },
    input: { borderWidth: 1, borderColor: '#E8E8E8', borderRadius: 10, padding: 12, fontSize: 15, color: '#1A3C28', backgroundColor: '#FFF8F8' },
    opcoesContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
    opcao: {
        flex: 1, alignItems: 'center', paddingVertical: 12, marginHorizontal: 4,
        borderRadius: 12, backgroundColor: '#FFF8F8', borderWidth: 1, borderColor: '#E8E8E8',
    },
    opcaoAtiva: { backgroundColor: '#F3DCDC', borderColor: '#D46363' },
    opcaoLabel: { fontSize: 11, color: '#8A8A8A', marginTop: 4 },
    opcaoLabelAtiva: { color: '#1A3C28', fontWeight: 'bold' },
    intervaloContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 15 },
    intervaloLabel: { fontSize: 15, color: '#1A3C28', marginHorizontal: 6 },
    intervaloInput: {
        borderWidth: 1, borderColor: '#E8E8E8', borderRadius: 8, padding: 8,
        fontSize: 16, width: 50, textAlign: 'center', color: '#1A3C28',
    },
    botaoSalvar: {
        backgroundColor: '#1A3C28', flexDirection: 'row', justifyContent: 'center',
        alignItems: 'center', padding: 15, borderRadius: 12, marginTop: 20,
    },
    textoBotao: { color: '#FFF', fontWeight: '700', fontSize: 16 },
    botaoCancelar: { alignItems: 'center', marginTop: 15 },
    textoCancelar: { color: '#8A8A8A', fontSize: 15 },
});