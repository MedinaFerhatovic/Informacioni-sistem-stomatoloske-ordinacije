import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f0f0f5',
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#333',
        marginBottom: 25,
        letterSpacing: 0.5,
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f5',
    },
    item: {
        backgroundColor: '#fff',
        padding: 20,
        marginVertical: 12,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        borderColor: '#e5e5e5',
        borderWidth: 1,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: 'black',
        marginBottom: 6,
    },
    customButton: {
        backgroundColor: '#004aad',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 25,
        marginTop: 15,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#1E90FF',
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
    },
    customButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    noResults: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    noResultsText: {
        textAlign: 'center', 
        marginTop: '80%', 
        fontSize: 18, 
        color: '#6c757d',
    },
});

export default styles;