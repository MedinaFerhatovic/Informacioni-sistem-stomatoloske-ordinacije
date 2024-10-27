import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
        backgroundColor: '#fff',
    },
    logo: {
        width: 150,
        height: 200,
        alignSelf: 'center',
        marginBottom: 30,
    },
    input: {
        height: 50,
        borderColor: '#d1d1d1',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 10,
        paddingLeft: 10,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    rememberMeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rememberMeText: {
        marginLeft: 8,
        fontSize: 16,
        color: '#333',
    },
    forgotPasswordText: {
        fontSize: 16,
        color: '#004aad',
    },
    buttonContainer: {
        backgroundColor: '#004aad',
        borderRadius: 8,
        overflow: 'hidden',
        marginBottom: 20,
        marginTop: 20,
    },
    registerLink: {
        color: '#004aad',
        textAlign: 'center',
        marginTop: 30,
        fontSize: 16,
    },
});

export default styles;
