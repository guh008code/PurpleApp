import { View, Text, StyleSheet, Alert, Image } from "react-native"
import { useState } from "react"
import { router } from "expo-router"

import { Button } from "../components/button"
import { Input } from "../components/input"

import { styles } from "./styles";

export default function Index(){
    const[name, setName] = useState("")

    function novaMensagem(){      
        setName(name)
        console.log("alertando")
        Alert.alert(`Bem vindo, ${name}`)
        router.navigate("/home")
  
    }

    return(
        <View style={styles.container}>
        <Image style={styles.logo} source={require('../assets/logos/logo.png')} />
            <Text style={styles.title}>Login { name }</Text>
            <Input onChangeText={setName} />
            <Text style={styles.title}>Senha { name }</Text>
            <Input onChangeText={setName} />
            <Button title="Entrar" onPress={novaMensagem} />
        </View>
    )
}



