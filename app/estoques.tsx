import {TouchableOpacity, View, Text, StyleSheet, Image} from "react-native"
import { router } from "expo-router"

import { Button } from "../components/button"
import { Input } from "../components/input"

import { styles } from "./styles";

export default function Estoque(){
return(
    <View style={styles.containerMenu}>

    <Text style={styles.title}>Purple Manager - Cadastrar</Text>

    <Text style={styles.title}>CNPJ</Text>
            <Input />
            <Text >Nome Fantasia</Text>
            <Input />
            <Text >Equipamento</Text>
            <Input />
            <Text >Empresa</Text>
            <Input />
            <Button title="Cadastrar"/>
      
        <Button title="Voltar" onPress={() => router.back()} />
    </View>
)
    
}