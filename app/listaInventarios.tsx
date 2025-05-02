import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Alert, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from "expo-router"
import { useNavigation, useRoute } from '@react-navigation/native';

import { Button } from "../components/button"
import { Input } from "../components/input"
import { styles } from "./styles";
import Empresas from './empresas';

const urlApi = 'https://servicos.opurple.com.br/Api';

const ListaInventarios = () => {
  const navigation = useNavigation();

  const [dados, setDados] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [plaqueta, setPlaqueta] = useState("")
  const [empresa, setEmpresa] = useState("")
  const [cnpj, setCnpj] = useState("")

  useEffect(() => {
    carregarDados();
    setCarregando(false)
  }, []);

  let carregarDados = async () => {
    let sessao: string | null = await AsyncStorage.getItem(`session`)
    if (sessao == null) {
      alert(`Sua Sessão caiu...`)
      router.navigate("..")
    } else {
      try {
        const response = JSON.parse(sessao);
        const instalacao = response.instalacao
        const idEmpresa = response.idEmpresa
        const acessToken = response.acessToken

        let itemEmpresa: string | null = await AsyncStorage.getItem(`empresa`)
        if (itemEmpresa == null) {
          getEmpresa(idEmpresa, instalacao, acessToken)
        } else {
          const empresa = JSON.parse(itemEmpresa);
          const empresaLogado = empresa.epsNomFnt
          const empresaCnpj = formatarCNPJ(empresa.epsCnpj)
          setEmpresa(empresaLogado)
          setCnpj(empresaCnpj)
        }

        getInventarios(idEmpresa, instalacao, acessToken);

      } catch (erro) {
        console.error('Erro ao buscar dados da API:', erro);
      } finally {

      }
    }
  };

  const formatarCNPJ = (cnpj: string) => {
    return cnpj
      .replace(/\D/g, '') // Remove tudo que não for número
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .slice(0, 18); // Garante o tamanho máximo
  };

  let adicionarNovo = async () => {
    let sessao: string | null = await AsyncStorage.getItem(`session`)
    if (sessao == null) {
      alert(`Sua Sessão caiu...`)
      router.navigate("..")
    } else {

      const response = JSON.parse(sessao);
      const instalacao = response.instalacao
      const idEmpresa = response.idEmpresa
      const acessToken = response.acessToken

      const Inventario = {
        'avlItmId': 0,
        'avlItmEpsId': idEmpresa.toString(),
        'avlItmPlq': plaqueta.toString(),
        'avlItmPlqAnt': plaqueta.toString(),
        'avlItmIstId': instalacao.toString(),
      }

      navigation.navigate("inventarios", { item: Inventario })

    }
  }


  let getInventarios = async (idEmpresa: any, instalacao: any, acessToken: any) => {

    try {
      const resposta = await fetch(`${urlApi}/Inventario/ListarTodos/${idEmpresa}/${instalacao}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${acessToken}`,
          'Content-Type': `application/json`
        }
      })
      const json = await resposta.json();
      //console.log(`json chegou`)
      //console.log(json)
      setDados(json.dados); // limita a 20 registros
    } catch (erro) {
      console.error('Erro ao buscar dados da API:', erro);
    } finally {
      //setCarregando(false);
    }
  }

  let getEmpresa = (idEmpresa: any, instalacao: any, acessToken: any) => {
    fetch(`${urlApi}/Empresa/BuscarPorID/${idEmpresa}/${instalacao}`, {
      headers: { Authorization: `Bearer ${acessToken}` }
    })
      .then(res => {
        console.log(res.status);
        //console.log(res.headers)
        return res.json();
      })
      .then(async (result) => {
        console.log(result);

        if (result.status) {
          await AsyncStorage.setItem(`empresa`, JSON.stringify(result.dados))
          const empresaLogado = result.dados.epsNomFnt
          const empresaCnpj = formatarCNPJ(result.dados.epsCnpj)
          setEmpresa(result.dados.epsNomFnt)
          setCnpj(empresaCnpj)

        } else {
          alert(`${result.mensagem}`)
        }
      },
        (error) => {
          console.log(error);
        })
      .finally();
  }

  const buscarPlaqueta = async () => {
    let sessao: string | null = await AsyncStorage.getItem('session')
    if (sessao != null) {
      const response = JSON.parse(sessao);
      const instalacao = response.instalacao
      const idEmpresa = response.idEmpresa
      const acessToken = response.acessToken
      console.log(plaqueta)

      if (plaqueta == '') {
        getInventarios(idEmpresa, instalacao, acessToken);
        alert('Informe o número da plaqueta.')
      } else {
        getPlaqueta(plaqueta, idEmpresa, instalacao, acessToken)
        setPlaqueta(setFormatPlaqueta(plaqueta))
      }
    }

    setCarregando(false);
  }

  let getPlaqueta = async (plaqueta: any, idEmpresa: any, instalacao: any, acessToken: any) => {
    try {
      const resposta = await fetch(`${urlApi}/Inventario/BuscarPlaqueta/${plaqueta}/${idEmpresa}/${instalacao}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${acessToken}`,
          'Content-Type': `application/json`
        }
      })

      if(resposta.ok){
        const json = await resposta.json();
        const resultado = json.dados;

        //console.log(`json chegou`)
        setDados(resultado); // limita a 20 registros
  
        if(resultado.status){
          if (resultado.length == 1) {
            if (resultado[0].avlItmSit.toString() == 'I') {
              alert('Este Bem já foi inventariado!');
            }
            if (resultado[0].avlItmSit.toString() == 'N') {
              alert('Este Bem já foi inventariado!');
            }
            if (resultado[0].avlItmSit.toString() == 'S') {
              console.log(resultado[0])
              navigation.navigate("inventarios", { item: resultado[0] })
            }
          }
        }else{
          console.log('plaqueta resultado false')
          if(resultado == ''){
            Alert.alert(
              "",
              "Número de plaqueta disponível!\n deseja utilizar?",
              [
                {
                  text: "Não",
                  style: "cancel"
                },
                { text: "SIM", onPress: () => adicionarNovo() }
              ],
              { cancelable: false }
            );
          }
          console.log(resultado)
        }

      }else{
        alert(resposta.statusText)
      }
    } catch (erro) {
      console.error('Erro ao buscar dados da API:', erro);
    } finally {
      //setCarregando(false);
    }
  }


  let setFormatPlaqueta = (value: string) => {
    let sValue = value.replace(/[^0-9]/g, '');
    let valor = parseInt(sValue);
    if (valor < 10) {
      sValue = '00000' + valor.toString()
    }
    else if (valor < 100) {
      sValue = '0000' + valor.toString()
    }
    else if (valor < 1000) {
      sValue = '000' + valor.toString()
    }
    else if (valor < 10000) {
      sValue = '00' + valor.toString()
    }
    else if (valor < 100000) {
      sValue = '0' + valor.toString()
    }
    return sValue
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.row}
      onPress={() => navigation.navigate("inventarios", { item })}>
      <Text style={styles.cell}>{setFormatPlaqueta(item.avlItmPlq.toString())}</Text>
      <Text style={styles.cell}>{item.avlItmDes}</Text>
      <Text style={styles.cell}>{item.avlItmSit == 'N' ? `Novo` : item.avlItmSit == 'S' ? `Sobra contabil` : item.avlItmSit == 'I' ? 'Inventariado' : item.avlItmSit == 'C' ? 'Concluído' : ''}</Text>
    </TouchableOpacity>
  );

  function redirecionaInventario() {
    router.navigate("/inventarios")
  }

  function redirecionaMenu() {
    if (Platform.OS === 'ios') {
      router.navigate("/homeIOS")
    } else {
      router.navigate("/homeAndroid")
    }
  }

  return (
    <View style={styles.containerLista}>
      <Text style={styles.title}>Purple Manager</Text>
      <Text style={styles.title}>Inventários</Text>
      <Text >{empresa} - {cnpj}</Text>

      <View style={styles.containerGrid}>
        <View style={[styles.row, styles.header]}>
          <Text style={[styles.cell, styles.headerText]}>Plaqueta</Text>
          <Text style={[styles.cell, styles.headerText]}>Item</Text>
          <Text style={[styles.cell, styles.headerText]}>Situação</Text>
        </View>

        {carregando ? (
          <ActivityIndicator size="large" color="#6C3BAA" />
        ) : (
          <FlatList
            data={dados}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
            ListEmptyComponent={
              <Text style={{ textAlign: 'center', marginTop: 20, color: 'gray' }}>
                Nenhum registro encontrado.
              </Text>
            }
          />
        )}
      </View>
      <Text style={styles.textCadastro}>PLAQUETA</Text>
      <Input placeholder={'0000000'} keyboardType="numeric" value={plaqueta} maxLength={6} onChangeText={(value) => setPlaqueta(value)} />

      <Button title="Buscar" onPress={buscarPlaqueta} />
      <Button title="Adicionar" onPress={redirecionaInventario} />
      <Button title="Voltar" onPress={redirecionaMenu} />
    </View>
  );
};

export default ListaInventarios;