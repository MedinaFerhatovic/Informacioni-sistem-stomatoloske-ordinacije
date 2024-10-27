import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f8f9fa', 
    },
    listContainer: {
        paddingBottom: 20, 
    },
    reservationContainer: {
        backgroundColor: '#ffffff', 
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2, 
    },
    ordinationName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333', 
    },
    appointmentTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginTop: 8,
    },
    reservationTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginTop: 12,
        marginBottom: 4,
    },
    detailContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    appointmentDate: {
        fontSize: 14,
        color: '#666', 
        marginLeft: 8,
    },
    appointmentTime: {
        fontSize: 14,
        color: '#666', 
        marginLeft: 8,
    },
    reservationDate: {
        fontSize: 14,
        marginTop: 4,
        marginLeft: 8,
    },
    status: {
        fontSize: 14,
        marginTop: 4,
        marginLeft: 8,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    description: {
        fontSize: 14,
        marginTop: 4,
        marginLeft: 8,
    },
    phone: {
        fontSize: 14,
        marginTop: 4,
        marginLeft: 8,
    },
    age: {
        fontSize: 14,
        marginTop: 4,
        marginLeft: 8,
    },
    cancelButton: {
        backgroundColor: '#FF6F61', 
        paddingVertical: 12,
        paddingHorizontal: 20, 
        borderRadius: 25, 
        marginTop: 15,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000', 
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
        width: 170,
        marginLeft: 'auto', 
        marginRight: 'auto', 
    },
    cancelButtonText: {
        color: 'white', 
        fontSize: 16,
        fontWeight: 'bold', 
    },
    noReservationsText: {
        textAlign: 'center',
        marginTop: '80%', 
        fontSize: 18, 
        color: '#6c757d', 
    }
    
});

export default styles;
