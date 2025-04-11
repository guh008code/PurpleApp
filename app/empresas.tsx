import {TouchableOpacity, View, Text, StyleSheet, Image} from "react-native"
import { router } from "expo-router"

import { Button } from "../components/button"
import { Input } from "../components/input"

import { styles } from "./styles";

export default function Empresas(){
return(
    <View style={styles.containerMenu}>

    <Text style={styles.title}>Purple Manager </Text>

    <Text style={styles.title}>Cadastrar Empresas</Text>
            <Text >CNPJ</Text>
            <Input />
            <Text >Nome Fantasia</Text>
            <Input />
            <Text >Equipamento</Text>
            <Input />
            <Button title="Cadastrar"/>
      
        <Button title="Voltar" onPress={() => router.back()} />
    </View>
)
    
}