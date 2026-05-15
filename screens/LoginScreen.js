import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Feather, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import {salvarNomeUsuario} from "../services/storage";
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen({ navigation }) {
    const [nome, setNome] = useState('');

    const entrar = async () => {
        if (!nome.trim()) return;
        await salvarNomeUsuario(nome.trim());
        navigation.replace('Home');
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.container}
            >
                <View style={styles.shapeTopLeft} />
                <View style={styles.shapeBottomRight} />

                <MaterialCommunityIcons name="flower-tulip-outline" size={60} color="#2B4E38" style={styles.flowerIcon} />

                <View style={styles.titleRow}>
                    <Text style={styles.logo}>Floratta</Text>
                    <AntDesign name="heart" size={12} color="#F4A6B8" style={styles.heartSmall} />
                </View>

                <View style={styles.dividerContainer}>
                    <View style={styles.line} />
                    <AntDesign name="heart" size={16} color="#F4A6B8" style={{ marginHorizontal: 10 }} />
                    <View style={styles.line} />
                </View>

                <Text style={styles.frase}>
                    Organize os cuidados{'\n'}das suas plantas
                </Text>

                <View style={styles.inputWrapper}>
                    <Feather name="user" size={22} color="#2B4E38" style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Digite seu nome"
                        placeholderTextColor="#8a9c90"
                        value={nome}
                        onChangeText={setNome}
                    />
                </View>

                <TouchableOpacity style={styles.botao} onPress={entrar}>
                    <Text style={styles.textoBotao}>Entrar</Text>
                </TouchableOpacity>

            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FDF0F4',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30,
    },
    shapeTopLeft: {
        position: 'absolute',
        top: -30,
        left: -30,
        width: 180,
        height: 180,
        borderRadius: 180 / 2,
        backgroundColor: '#2B4E38',
        opacity: 0.15,
    },
    shapeBottomRight: {
        position: 'absolute',
        bottom: -30,
        right: -30,
        width: 250,
        height: 250,
        borderRadius: 250 / 2,
        backgroundColor: '#2B4E38',
        opacity: 0.1,
    },
    flowerIcon: {
        marginBottom: 10,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    logo: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#2B4E38',
        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
        letterSpacing: 1,
    },
    heartSmall: {
        position: 'absolute',
        right: -15,
        bottom: 15,
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '60%',
        marginVertical: 15,
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: '#F4A6B8',
    },
    frase: {
        color: '#2B4E38',
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 40,
        lineHeight: 24,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#C0A9AD',
        borderRadius: 12,
        width: '100%',
        marginBottom: 15,
        height: 55,
        paddingHorizontal: 15,
    },
    icon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#2B4E38',
    },
    botao: {
        backgroundColor: '#2B4E38',
        height: 55,
        borderRadius: 12,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    textoBotao: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 18,
    },
});

// Cod da tela de login