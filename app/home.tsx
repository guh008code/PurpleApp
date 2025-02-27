import {View, Text, StyleSheet} from "react-native"
import { router } from "expo-router"

import { Button } from "../components/button"

import { styles } from "./styles";

export default function Home(){
return(
    <View style={styles.container}>
        <Text style={styles.title}>Home</Text>



        
        <Button title="Voltar" onPress={() => router.back()} />
    </View>
)
    
}