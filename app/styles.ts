import { StyleSheet, StatusBar} from "react-native";

export const styles = StyleSheet.create({
    container:{
        flex:1,
        padding:32,
        backgroundColor:"#FFFFFF",
        gap:16,
        paddingBottom: 110,
    },
    containerLista:{
        flex:1,
        padding:32,
        backgroundColor:"#FFFFFF",
        gap:16,
        paddingBottom: 110,
        height:'20%'
    },
    containerGrid:{
        height:'40%',
    },
    titleLogin:{
        color: "#6C3BAA",
        fontSize:24,
        fontWeight: "bold"
    },
    title:{
        color: "#6C3BAA",
        fontSize:24,
        fontWeight: "bold"
    },
    titlePequeno:{
        color: "#6C3BAA",
        fontSize:18,
        fontWeight: "bold",
        padding:10
    },
    textMenu:{
        padding:0
    },
    textCadastro:{
        padding:10
    },
    logo:{
        width:"100%",
        flex:1,
        justifyContent:"center",
        resizeMode: 'contain',
    },
    absoluteView: {
        flex: 1,
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        height:77
    },
    absoluteText: {
        flex: 0,
        backgroundColor: 'transparent',
        marginLeft:80,
        paddingBottom:85,
        width:"100%",
        fontSize:26,
        fontWeight : 'bold',
        color: '#6C3BAA'
    },
    containerMenu:{
        flex:1,
        padding:22,
        marginBottom:190,
        justifyContent:"center",
        backgroundColor:"#FFFFFF",
        gap:16
    },
    containerCadastros:{
        flex:1,
        //margin:30,
        padding:32,
        justifyContent:"center",
        backgroundColor:"#FFFFFF"
        
    },
    button:{
        width: "100%",
        height:52,
        backgroundColor: "#6C3BAA",
        borderRadius: 10,
        justifyContent: "center",
        alignItems:"center"
    },
    titleButton:{
        fontSize:16,
        fontWeight:"bold",
        color:"#FFF"
    },
    row: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#ccc',
        paddingVertical: 6,
      },
    header: {
        backgroundColor: '#eee',
        borderBottomWidth: 2,
    },
    cell: {
        flex: 1,
        paddingHorizontal: 6,
    },
    headerText: {
        fontWeight: 'bold',
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: "#6C3BAA",
        borderRadius: 8,
        overflow: 'hidden',
      },
})