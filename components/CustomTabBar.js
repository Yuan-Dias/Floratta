import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

const CORES = {
    deepGreen: '#1A3C28',
    white: '#FFFFFF',
    textPrimary: '#1A3C28',
};

export default function CustomTabBar({ activeTab, navigation }) {
    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={[styles.tabItem, activeTab === 'Home' && styles.tabItemActive]}
                onPress={() => navigation.replace('Home')}
            >
                <MaterialCommunityIcons
                    name="leaf"
                    size={22}
                    color={activeTab === 'Home' ? CORES.textPrimary : CORES.white}
                />
                {activeTab === 'Home' ? (
                    <Text style={styles.tabTextActive}>Plantas</Text>
                ) : (
                    <Text style={styles.tabText}>Plantas</Text>
                )}
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.tabItem, activeTab === 'Tarefas' && styles.tabItemActive]}
                onPress={() => navigation.replace('Tarefas')}
            >
                <Feather
                    name="calendar"
                    size={22}
                    color={activeTab === 'Tarefas' ? CORES.textPrimary : CORES.white}
                />
                {activeTab === 'Tarefas' ? (
                    <Text style={styles.tabTextActive}>Tarefas do dia</Text>
                ) : (
                    <Text style={styles.tabText}>Tarefas do dia</Text>
                )}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: CORES.deepGreen,
        height: 90,
        borderTopLeftRadius: 35,
        borderTopRightRadius: 35,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingHorizontal: 30,
        paddingBottom: Platform.OS === 'ios' ? 25 : 15,
    },
    tabItem: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    tabItemActive: {
        backgroundColor: '#FDF0F0',
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 25,
    },
    tabTextActive: {
        color: CORES.textPrimary,
        fontWeight: 'bold',
        fontSize: 15,
        marginLeft: 10,
    },
    tabText: {
        color: CORES.white,
        fontSize: 12,
        marginTop: 6,
        fontWeight: '500',
    },
});