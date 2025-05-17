import {TouchableOpacity, View, Text, StyleSheet, ScrollView, Image} from "react-native"
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState, useRef } from 'react';
import { router } from "expo-router"
import * as Network from 'expo-network';

import { Button } from "../components/button"
import { Input } from "../components/input"

import { styles } from "./styles";

export default function MeuPerfil(){

    const urlApi = `https://servicos.opurple.com.br/Api`

    const [nome, setNome] = useState('')
    const [email, setEmail] = useState('')
    const [empresa, setEmpresa] = useState('')
    const [cnpj, setCnpj] = useState('')
    const [senha, setSenha] = useState('')
    const [confSenha, setConfSenha] = useState('')


    useEffect(() => {
        // Função que será executada assim que o componente carregar
        validaSessao();
        carregarDados();


        // Se quiser rodar só uma vez, deixe o array de dependências vazio
  }, []);

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

  let validaSessao = async () => {
    let sessao: string | null = await AsyncStorage.getItem(`session`)
    if (sessao == null) {
          alert(`Sua Sessão caiu...`)
          router.navigate("..")
    }
}

  let carregarDados = async () => {
    let sessao: string | null = await AsyncStorage.getItem(`session`)
    if (sessao != null) {

          //console.log(response.instalacao);
          const response = JSON.parse(sessao);
          //console.log(response)
          const instalacao = response.instalacao
          const idEmpresa = response.idEmpresa
          const acessToken = response.acessToken

          setNome(response.nome.toString());
          setEmail(response.email.toString());

          let itemEmpresa: string | null = await AsyncStorage.getItem(`empresa`)
          if(itemEmpresa != null ){
              const empresa = JSON.parse(itemEmpresa);
              const empresaLogado = empresa.epsNomFnt
              const empresaCnpj = empresa.epsCnpj
              setEmpresa(empresaLogado);
              setCnpj(empresaCnpj);
          }

    }
  }

  const formatarCNPJ = (cnpj: string) => {
    return cnpj
      .replace(/\D/g, '') // Remove tudo que não for número
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .slice(0, 18); // Garante o tamanho máximo
  };

return(
    <ScrollView>
    <View style={styles.containerMenu}>
    <Text style={styles.title}>Purple Manager </Text>
    <Text style={styles.title}>Meu Perfil</Text>
            <Text >Meu Nome</Text>
            <Input value={nome} onChangeText={(value) => setNome(value)} editable={false} contextMenuHidden={true}/>
            <Text >Meu E-mail</Text>
            <Input editable={false} maxLength={200} onChangeText={(value) => setEmail(value)} placeholder={'Seu E-mail'}  />
            <Text >CNPJ - Empresa</Text>
            <Input editable={false} value={cnpj} maxLength={18} onChangeText={(value) => setCnpj(value)} placeholder={'000.000.000/0000-00'}  />
            <Text >Nova Senha</Text>
            <Input value={senha} maxLength={10} onChangeText={(value) => setSenha(value)} placeholder={'Senha nova'}  />
            <Text >Confirmar Senha</Text>
            <Input value={confSenha} maxLength={10} onChangeText={(value) => setConfSenha(value)} placeholder={'Confirmação de Senha nova'} />
            <Button title="Salvar"/>
        <Button title="Voltar" onPress={() => router.back()} />
    </View>
    </ScrollView>
)
    
}