import AsyncStorage from '@react-native-async-storage/async-storage';

const CHAVE_PLANTAS = '@floratta_plantas';

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