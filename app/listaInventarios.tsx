import {TouchableOpacity, View, Text, StyleSheet, Image, ScrollView, StatusBar} from "react-native"
import { router } from "expo-router"
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

import { Button } from "../components/button"
import { Input } from "../components/input"
import { Dropdown } from 'react-native-element-dropdown';

import { styles } from "./styles";

export default function listaInventarios(){
return(

    <SafeAreaProvider>
    <SafeAreaView style={styles.containerCadastros} edges={['top']}>
      <ScrollView>

      <Text style={styles.title}>Purple Manager</Text>

      <Text style={styles.titlePequeno}>Lista de Inventário(s)</Text>
            <Text style={styles.textCadastro} >PLAQUETA</Text>
            <Input placeholder={'0000000'} />

       <Button title="Adicionar"/>
      <Button title="Voltar" onPress={() => router.back()} />
      </ScrollView>
    </SafeAreaView>
  </SafeAreaProvider>


    
)
    
}