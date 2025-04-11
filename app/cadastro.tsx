import {TouchableOpacity, View, Text, StyleSheet, Image, ScrollView, StatusBar} from "react-native"
import { router } from "expo-router"
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

import { Button } from "../components/button"
import { Input } from "../components/input"
import { Dropdown } from 'react-native-element-dropdown';

import { styles } from "./styles";

export default function Cadastros(){
return(

    <SafeAreaProvider>
    <SafeAreaView style={styles.containerCadastros} edges={['top']}>
      <ScrollView>

      <Text style={styles.title}>Purple Manager</Text>

      <Text style={styles.titlePequeno}>Solicitar Acesso</Text>
            <Text style={styles.textCadastro} >Seu nome</Text>
            <Input placeholder={'Nome'} />
            <Text style={styles.textCadastro}>Seu Telefone</Text>
            <Input placeholder={'(xx) xxxxx-xxxxx)'} />
            <Text style={styles.textCadastro}>Seu E-mail</Text>
            <Input placeholder={'xxxx@xxxx.com'}/>

            <Button title="SALVAR"/>
      
      <Button title="Voltar" onPress={() => router.back()} />
      </ScrollView>
    </SafeAreaView>
  </SafeAreaProvider>


    
)
    
}