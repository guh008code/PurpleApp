import {TouchableOpacity, View, Text, StyleSheet, Image, ScrollView, StatusBar} from "react-native"
import { router } from "expo-router"
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Button } from "../components/button"
import { Input } from "../components/input"
import { Dropdown } from 'react-native-element-dropdown';
import TabelaAPI from '../app/listaInventarios';
import { styles } from "./styles";

const Inventarios =  ({ route }) => {

      useEffect(() => {
            // Função que será executada assim que o componente carregar
            console.log('tela de inventario')
            console.log(route)
        
            // Se quiser rodar só uma vez, deixe o array de dependências vazio
          }, []);

return(
      <ScrollView>
      <View style={styles.containerCadastros}>
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
      </View>
      </ScrollView>
 
      )
};

export default Inventarios;
