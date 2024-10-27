import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

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
    searchInput: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 30,
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderColor: '#e0e0e0',
        borderWidth: 1,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    searchIcon: {
        position: 'absolute',
        left: 15,
        color: '#a0a0a0',
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
        color: '#004aad',
        marginBottom: 6,
    },
    infoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    icon: {
        marginRight: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
    },

    locationButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#004aad',
        borderRadius: 30, 
        paddingVertical: 15, 
        marginBottom: 20, 
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 }, 
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 5,
    },
    locationButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 10, 
    },
    locationIcon: {
        marginRight: 8,
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
        width: 170,
        marginLeft: 130,
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
        fontSize: 18,
        color: '#FF6347',  
        textAlign: 'center',
    }
});

export default styles;
