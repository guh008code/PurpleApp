import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from "expo-router"
import { NavigationContainer } from '@react-navigation/native';

import { Button } from "../components/button"
import { Input } from "../components/input"
import { styles } from "./styles";

const API_URL = 'http://development.eba-bu5ryrmq.us-east-1.elasticbeanstalk.com/Api';

const TabelaAPI = ({ navigation }) => {
  const [dados, setDados] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [plaqueta, setPlaqueta] = useState("")

  useEffect(() => {
    const buscarDados = async () => {
      const sessao = await AsyncStorage.getItem(`session`)
      if(sessao == null){
          alert(`Sua Sessão caiu...`)
          router.navigate("..")
      }


      try {
        const response = JSON.parse(await AsyncStorage.getItem('session'));
        const instalacao = response.instalacao
        const idEmpresa = response.idEmpresa
        const acessToken = response.acessToken

        console.log('---lista iventarios---');
        console.log(`Bearer ${acessToken}`);
  
        console.log(`instalacao ${instalacao}`);
        console.log(`idEmpresa ${idEmpresa}`);

        const resposta = await fetch(`${API_URL}/Inventario/ListarTodos/${idEmpresa}/${instalacao}`,{
          headers: {Authorization: `Bearer ${acessToken}`}
      })
        const json = await resposta.json();
        console.log(`json chegou`)
        console.log(json)
        setDados(json.dados); // limita a 20 registros
      } catch (erro) {
        console.error('Erro ao buscar dados da API:', erro);
      } finally {
        setCarregando(false);
      }
    };

    buscarDados();
  }, []);

    let buscarPlaqueta = async () => {
      if(plaqueta == ''){
        alert('Informe o número da plaqueta.')
      }else{
        const response = JSON.parse(await AsyncStorage.getItem('session'));
        const instalacao = response.instalacao
        const idEmpresa = response.idEmpresa
        const acessToken = response.acessToken
      
        getPlaqueta(plaqueta, idEmpresa, instalacao, acessToken)
      }
    }

    let getPlaqueta = (plaqueta: any, idEmpresa: any, instalacao: any, acessToken: any) =>{
      fetch(`${API_URL}/Inventario/BuscarPlaqueta/${plaqueta}/${idEmpresa}/${instalacao}`,{
          headers: {Authorization: `Bearer ${acessToken}`}
      })
      .then(res => {
          console.log(res.status);
          //console.log(res.headers);
          return res.json();
      })
      .then(async (result) =>{
          console.log(result);
          console.log(result.status);
          console.log(result.mensagem);
          if(result.status){
            alert(result.mensagem)
              //const empresaLogado = result.dados.epsNomFnt
              //const empresaCnpj = result.dados.epsCnpj

          }else{
              alert(`${result.mensagem}`)
          }
      },
      (error) => {
          console.log(error);
      })
      .finally();
  }

  const renderItem = ({ item }) => (

    <TouchableOpacity
      style={styles.row}
      onPress={() => router.navigate('/inventarios', { Inventarios: item })}>
      <Text style={styles.cell}>{item.avlItmPlq > 6 ? item.avlItmPlq : `0000${item.avlItmPlq}`}</Text>
      <Text style={styles.cell}>{item.avlItmDes}</Text>
      <Text style={styles.cell}>{item.avlItmSts == 1 ? `Novo` : `Inventariado` }</Text>
    </TouchableOpacity>

  );

  function redirecionaInventario(){      
    router.navigate("/inventarios")
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Purple Manager</Text>
      <Text style={styles.title}>Tabela de Inventários</Text>

      <View style={[styles.row, styles.header]}>
        <Text style={[styles.cell, styles.headerText]}>Plaqueta</Text>
        <Text style={[styles.cell, styles.headerText]}>Item</Text>
        <Text style={[styles.cell, styles.headerText]}>Situação</Text>
      </View>

      {carregando ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={dados}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
        />
      )}

        <Text style={styles.textCadastro} >PLAQUETA</Text>
        <Input placeholder={'0000000'} value={plaqueta} onChangeText={(value) => setPlaqueta(value)}/>

        <Button title="Buscar" onPress={buscarPlaqueta}/>
        <Button title="Adicionar" onPress={redirecionaInventario}/>
        <Button title="Voltar" onPress={() => router.back()} /> 
    </View>
  );
};

export default TabelaAPI;