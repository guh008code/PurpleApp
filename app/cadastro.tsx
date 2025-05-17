import { View, Text, TouchableOpacity, StyleSheet, Alert, Image, ActivityIndicator, Platform, ScrollView } from "react-native"
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Network from 'expo-network';
import * as ScreenOrientation from 'expo-screen-orientation';
import React, { useEffect, useState } from 'react';
import { router } from "expo-router"

import { Button } from "../components/button"
import { Input } from "../components/input"


import { styles } from "./styles";

export default function Cadastros(){

  const urlApi = `https://servicos.opurple.com.br/Api`

  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [telefone, setTelefone] = useState('')

  const verificarConexao = async () => {
    const estado = await Network.getNetworkStateAsync();
    if (!estado.isConnected || !estado.isInternetReachable) {
      alert('Sem conexão com a internet');
      console.log('Sem conexão com a internet');
      return false;
    } else {
      console.log('Conectado à internet');
      return true;
    }
  };

  function cadastrar(){
    verificarConexao();
    if(nome == ''){
        Alert.alert('Informe seu Nome.')
    }else if(email == ''){
        Alert.alert('Informe um e-mail válido.')
    }    
    else if(telefone == ''){
      Alert.alert('Informe um telefone.')
    }else{
      Alert.alert('Seu Cadastro foi enviado para aprovação!')
      router.back();
    }
}

return(

  <ScrollView>
  <View style={styles.containerMenu}>
  <Text style={styles.title}>Purple Manager </Text>
  <Text style={styles.title}>Cadastre-se</Text>
          <Text >Seu Nome</Text>
          <Input value={nome} onChangeText={(value) => setNome(value)} placeholder={'Seu Nome'} />
          <Text >Seu E-mail</Text>
          <Input maxLength={200} onChangeText={(value) => setEmail(value)} placeholder={'Seu E-mail'}  />
          
          <Text >Seu Telefone</Text>
          <Input maxLength={14} onChangeText={(value) => setTelefone(value)} placeholder={'(XX)xxxxx-xxxx'}  />
          <Button title="Enviar" onPress={cadastrar}/>
      <Button title="Voltar" onPress={() => router.back()} />
  </View>
  </ScrollView>


    
)
    
}