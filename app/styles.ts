import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container:{
        flex:1,
        padding:32,
        justifyContent:"center",
        gap:16
    },
    title:{
        color: "#6C3BAA",
        fontSize:24,
        fontWeight: "bold"
    },
    logo:{
        width:"100%",
        flex:1,
        justifyContent:"center",
        resizeMode: 'contain',
    }
})