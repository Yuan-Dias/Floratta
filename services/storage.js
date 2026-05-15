import AsyncStorage from '@react-native-async-storage/async-storage';

const CHAVE_PLANTAS = '@floratta_plantas';
const CHAVE_NOME = '@floratta_nome';

export async function salvarPlantas(lista) {
    try {
        await AsyncStorage.setItem(CHAVE_PLANTAS, JSON.stringify(lista));
    } catch (e) {
        console.log(e);
    }
}

export async function buscarPlantas() {
    try {
        const dados = await AsyncStorage.getItem(CHAVE_PLANTAS);
        return dados ? JSON.parse(dados) : [];
    } catch (e) {
        console.log(e);
        return [];
    }
}

export async function salvarNomeUsuario(nome) {
    try {
        await AsyncStorage.setItem(CHAVE_NOME, nome);
    } catch (e) {
        console.log(e);
    }
}

export async function buscarNomeUsuario() {
    try {
        const nome = await AsyncStorage.getItem(CHAVE_NOME);
        return nome || '';
    } catch (e) {
        console.log(e);
        return '';
    }
}