import React from 'react';
import {
    TouchableOpacity,
    View,
    Text,
    Image,
    StyleSheet
} from 'react-native';

export default function PlantaItem({ item, aoAbrir }) {

    return (
        <TouchableOpacity
            style={styles.card}
            onPress={aoAbrir}
        >
            <Image
                source={{
                    uri: item.foto
                }}
                style={styles.foto}
            />

            <View style={{ flex: 1 }}>
                <Text style={styles.nome}>
                    {item.nome}
                </Text>

                <Text>
                    Quantidade: {item.quantidade}
                </Text>

                <Text>
                    {item.status}
                </Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 12,
        flexDirection: 'row',
        marginBottom: 10
    },
    foto: {
        width: 60,
        height: 60,
        marginRight: 15,
        borderRadius: 10
    },
    nome: {
        fontWeight: 'bold',
        fontSize: 16
    }
});