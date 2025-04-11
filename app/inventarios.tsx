import {TouchableOpacity, View, Text, StyleSheet, Image, ScrollView, StatusBar} from "react-native"
import { router } from "expo-router"
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

import { Button } from "../components/button"
import { Input } from "../components/input"
import { Dropdown } from 'react-native-element-dropdown';

import { styles } from "./styles";

export default function Inventarios(){
return(

    <SafeAreaProvider>
    <SafeAreaView style={styles.containerCadastros} edges={['top']}>
      <ScrollView>

      <Text style={styles.title}>Purple Manager</Text>

      <Text style={styles.titlePequeno}>Cadastrar Inventário</Text>
            <Text style={styles.textCadastro} >PLAQUETA</Text>
            <Input placeholder={'0000000'} />
            <Text style={styles.textCadastro}>EMPRESA</Text>
            <Input placeholder={'SELECIONE'} />
            <Text style={styles.textCadastro}>LOCAL</Text>
            <Input placeholder={'SELECIONE'}/>
            <Text style={styles.textCadastro}>CENTRO DE CUSTO</Text>
            <Input placeholder={'SELECIONE'}/>
            <Text style={styles.textCadastro}>SETOR</Text>
            <Input placeholder={'SELECIONE'}/>
            <Text style={styles.textCadastro}>ITEM</Text>
            <Input placeholder={'SELECIONE'}/>
            <Text style={styles.textCadastro}>DESCRIÇÃO</Text>
            <Input placeholder={'DIGITE'}/>
            <Text style={styles.textCadastro}>COMPLEMENTO</Text>
            <Input placeholder={'DIGITE'}/>
            <Text style={styles.textCadastro}>NÚMERO DE SÉRIE</Text>
            <Input placeholder={'DIGITE'}/>
            <Text style={styles.textCadastro}>NOTA DE CONSERVAÇÃO</Text>
            <Input placeholder={'SELECIONE'}/>
            <Text style={styles.textCadastro}>ANDAR</Text>
            <Input placeholder={'DIGITE'}/>
            <Text style={styles.textCadastro}>SITUAÇÃO</Text>
            <Input placeholder={'SELECIONE'}/>
            <Text style={styles.textCadastro}>VALOR DE AQUISIÇÃO</Text>
            <Input placeholder={'DIGITE'}/>
            <Text style={styles.textCadastro}>STATUS</Text>
            <Input placeholder={'SELECIONE'}/>

            <Button title="SALVAR"/>
      
      <Button title="Voltar" onPress={() => router.back()} />
      </ScrollView>
    </SafeAreaView>
  </SafeAreaProvider>


    
)
    
}