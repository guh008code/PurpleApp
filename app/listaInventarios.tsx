import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Alert, FlatList, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from "expo-router"
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import * as Network from 'expo-network';

import { Button } from "../components/button"
import { Input } from "../components/input"

import { styles } from "./styles";
import Empresas from './empresas';
import { Picker } from '@react-native-picker/picker';

const urlApi = 'https://servicos.opurple.com.br/Api';

const ListaInventarios = () => {
  const navigation = useNavigation();

  const [dados, setDados] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [plaqueta, setPlaqueta] = useState("")
  const [empresa, setEmpresa] = useState("")
  const [totalReg, setTotalReg] = useState("")
  const [cnpj, setCnpj] = useState("")

  const [dadosLocal, setDadosLocal] = useState([]);
  const [dadosCentroDeCusto, setDadosCentroDeCusto] = useState([]);

  const [local, setLocal] = useState('')
  const [centroDeCusto, setCentroDeCusto] = useState('')

  //useEffect(() => {
    //carregarDados();
  //}, []);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        await verificarConexao();
        //setCarregando(true);
        await carregarDados();
        await buscarPlaqueta();
        //setCarregando(false);
      };
  
      fetchData();
    }, [])
  );

  const verificarConexao = async () => {
    const estado = await Network.getNetworkStateAsync();
    if (!estado.isConnected || !estado.isInternetReachable) {
      alert('Sem conexão com a internet');
      return false;
    } else {
      console.log('Conectado à internet');
      return true;
    }
  };

  let carregarDados = async () => {
    setCarregando(true);
    let sessao: string | null = await AsyncStorage.getItem(`session`)
    if (sessao == null) {
      alert(`Sua Sessão caiu...`)
      router.navigate("..")
      return;
    }
  
    try {
      const response = JSON.parse(sessao);
      const instalacao = response.instalacao;
      const idEmpresa = response.idEmpresa;
      const acessToken = response.acessToken;
  
      await getLocal(idEmpresa, instalacao, acessToken);
  
      let itemEmpresa: string | null = await AsyncStorage.getItem(`empresa`);
      if (itemEmpresa == null) {
        await getEmpresa(idEmpresa, instalacao, acessToken);
      } else {
        const empresa = JSON.parse(itemEmpresa);
        const empresaLogado = empresa.epsNomFnt;
        const empresaCnpj = formatarCNPJ(empresa.epsCnpj);
        setEmpresa(empresaLogado);
        setCnpj(empresaCnpj);
      }
      //await getInventarios(idEmpresa, instalacao, acessToken);
    } catch (erro) {
      console.error('Erro ao buscar dados da API:', erro);
    }finally {
      setCarregando(false);
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

      //criar uma sessao armazenar o filtro
      //add empresa externa
      //local selecionado externo
      //centro de custo se tiver sido selecionar
      //salvar na sessao


      const response = JSON.parse(sessao);
      const instalacao = response.instalacao
      const idEmpresa = response.idEmpresa
      const acessToken = response.acessToken

      const Inventario = {
        'avlItmId': 0,  
        'avlItmEpsId': idEmpresa.toString(),
        'avlItmLocId':local.toString(),
        'avlItmCecId':centroDeCusto.toString(),
        'avlItmPlq': plaqueta.toString(),
        'avlItmPlqAnt': plaqueta.toString(),
        'avlItmIstId': instalacao.toString(),
      }

      await AsyncStorage.setItem(`Filtro`, JSON.stringify(Inventario))

      navigation.navigate("inventarios", { item: Inventario });

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

      if(json.status){
        setDados(json.dados); // limita a 20 registros
        setTotalReg(json.dados.length);
      }else{
        setTotalReg("0");
        setDados([]); 
        console.log(json.mensagem)
      }
    } catch (erro) {
      console.error('Erro ao buscar dados da API:', erro);
      setDados([]); 
    } finally {
      //setCarregando(false);
    }
  }

  let getInventariosLocal = async (idEmpresa: any, idLocal: any, instalacao: any, acessToken: any) => {

    try {
      const resposta = await fetch(`${urlApi}/Inventario/ListarPorLocal/${idEmpresa}/${idLocal}/${instalacao}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${acessToken}`,
          'Content-Type': `application/json`
        }
      })
      const json = await resposta.json();
      //console.log(`json chegou`)
      //console.log(json)
      if(json.status){
        setDados(json.dados); // limita a 20 registros
        setTotalReg(json.dados.length);
      }else{
        setTotalReg("0");
        setDados([]);
        console.log(json.mensagem)
      }
    } catch (erro) {
      console.error('Erro ao buscar dados da API:', erro);
      setDados([]);
    } finally {
      //setCarregando(false);
    }
  }

  let getInventariosCentroDeCusto = async (idEmpresa: any, idLocal: any, idCentroDeCusto: any, instalacao: any, acessToken: any) => {

    try {
      const resposta = await fetch(`${urlApi}/Inventario/ListarPorCentroDeCusto/${idEmpresa}/${idLocal}/${idCentroDeCusto}/${instalacao}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${acessToken}`,
          'Content-Type': `application/json`
        }
      })
      const json = await resposta.json();
      //console.log(`json chegou`)
      //console.log(json)
      if(json.status){
        setDados(json.dados); // limita a 20 registros
        setTotalReg(json.dados.length);
      }else{
        setTotalReg("0");
        setDados([]);
        console.log(json.mensagem)
      }
    } catch (erro) {
      setDados([]);
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


  let getLocal = (idEmpresa: any, instalacao: any, acessToken: any) => {
    fetch(`${urlApi}/Local/ListarTodos/${idEmpresa}/${instalacao}`, {
      headers: { Authorization: `Bearer ${acessToken}` }
    })
      .then(res => {
        //console.log(res.status);
        //console.log(res.headers);
        return res.json();
      })
      .then(async (result) => {
        //console.log(`getLocal`)
        //console.log(result.status);
        if (result.status) {
          //console.log(result.dados)
          setDadosLocal(result.dados);
        } else {
          console.log(result);
          console.log(result.mensagem);
          setDadosLocal([]);
          //alert(`${result.mensagem}`)
        }
      },
        (error) => {
          console.log(error);
          setDadosLocal([]);
        })
      .finally();
  }

  let getCentroDeCusto = (idEmpresa: any, idLocal: any, instalacao: any, acessToken: any) => {
    fetch(`${urlApi}/CentroDeCusto/ListarTodos/${idEmpresa}/${idLocal}/${instalacao}`, {
      headers: { Authorization: `Bearer ${acessToken}` }
    })
      .then(res => {
        //console.log(res.status);
        //console.log(res.headers);
        return res.json();
      })
      .then(async (result) => {
        //console.log(`getCustos`)
        //console.log(result.status);
        if (result.status) {
          //const json = await result.json();
          //console.log(result.dados)
          setDadosCentroDeCusto(result.dados);
        } else {
          console.log(result.mensagem);

          setDadosCentroDeCusto([]);
          //alert(`${result.mensagem}`)
        }
      },
        (error) => {
          setDadosCentroDeCusto([]);
          console.log(error);
        })
      .finally();
  }

  const buscarPlaqueta = async () => {
    setCarregando(true)
    await verificarConexao();

    try {
      let sessao: string | null = await AsyncStorage.getItem('session')
      if (sessao != null) {
        const response = JSON.parse(sessao);
        const instalacao = response.instalacao
        const idEmpresa = response.idEmpresa
        const acessToken = response.acessToken
        console.log(`plaqueta: ${plaqueta}`)
        console.log(`CentroDeCusto: ${centroDeCusto}`)
        console.log(`local: ${local}`)
        console.log(`acess: ${acessToken}`)
        console.log(`empresa: ${idEmpresa}`)
        console.log(`instalacao: ${instalacao}`)

        if (plaqueta.toString() == '' || parseInt(plaqueta) == 0) {
          if (centroDeCusto != '' && centroDeCusto != '0') {
            await getInventariosCentroDeCusto(idEmpresa, local, centroDeCusto, instalacao, acessToken);
          }
          else if (local != '' && local != '0') {
            await getInventariosLocal(idEmpresa, local, instalacao, acessToken);
          } else {
            await getInventarios(idEmpresa, instalacao, acessToken);
          }
        }
        else {
          if (centroDeCusto != '' && centroDeCusto != '0') {
            await getPlaquetaPorCentroDeCusto(plaqueta, idEmpresa, local, centroDeCusto, instalacao, acessToken);
          }
          else if (local != '' && local != '0') {
            await getPlaquetaPorLocal(plaqueta, idEmpresa, local, instalacao, acessToken);
          } else {
            await getPlaqueta(plaqueta, idEmpresa, instalacao, acessToken)
          }

          setPlaqueta(setFormatPlaqueta(plaqueta))
        }
      }
    } catch (erro) {
      console.error('Erro ao buscar dados da API:', erro);
    } finally {
      setCarregando(false);
    }
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

      if (resposta.ok) {
        const json = await resposta.json();
        
        console.log(`json chegou`)
        console.log(json)

        if (json.status) {
          const resultado = json.dados;
          setDados(resultado); // limita a 20 registros
          setTotalReg(resultado.length)
          if (resultado.length == 1) {
            if (resultado[0].avlItmSit.toString() == 'I') {
              alert('Este Bem já foi inventariado!');
            }
            if (resultado[0].avlItmSit.toString() == 'N') {
              alert('Este Bem já foi inventariado!');
            }
            if (resultado[0].avlItmSit.toString() == 'S') {
              console.log(resultado[0])
              navigation.navigate("inventarios", { item: resultado[0] });
            }
          }
        } else {
          setTotalReg("0")
          setDados([]);
            adicionarNovo();

            //Alert.alert(
            //"",
            //"Número de plaqueta disponível!\n deseja utilizar?",
            //[
            //{
            //text: "Não",
            //style: "cancel"
            //},
            //{ text: "SIM", onPress: () => adicionarNovo() }
            //],
            //{ cancelable: false }
            //);
        }

      } else {
        alert(resposta.statusText)
      }
    } catch (erro) {
      setDados([]);
      console.error('Erro ao buscar dados da API:', erro);
    } 
  }

  let getPlaquetaPorLocal = async (plaqueta: any, idEmpresa: any, idLocal:any, instalacao: any, acessToken: any) => {
    try {
      const resposta = await fetch(`${urlApi}/Inventario/BuscarPlaquetaPorLocal/${plaqueta}/${idEmpresa}/${idLocal}/${instalacao}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${acessToken}`,
          'Content-Type': `application/json`
        }
      })

      if (resposta.ok) {
        const json = await resposta.json();

        if (json.status) {
          const resultado = json.dados;

          //console.log(`json chegou`)
          setDados(resultado); // limita a 20 registros
          setTotalReg(resultado.length)
          if (resultado.length == 1) {
            if (resultado[0].avlItmSit.toString() == 'I') {
              alert('Este Bem já foi inventariado!');
            }
            if (resultado[0].avlItmSit.toString() == 'N') {
              alert('Este Bem já foi inventariado!');
            }
            if (resultado[0].avlItmSit.toString() == 'S') {
              console.log(resultado[0])
              navigation.navigate("inventarios", { item: resultado[0] });
            }
          }
        } else {
          setTotalReg("0")
          setDados([]);
            adicionarNovo();

            //Alert.alert(
            //"",
            //"Número de plaqueta disponível!\n deseja utilizar?",
            //[
            //{
            //text: "Não",
            //style: "cancel"
            //},
            //{ text: "SIM", onPress: () => adicionarNovo() }
            //],
            //{ cancelable: false }
            //);
        }

      } else {
        alert(resposta.statusText)
      }
    } catch (erro) {
      setDados([]);
      console.error('Erro ao buscar dados da API:', erro);
    } finally {
      //setCarregando(false);
    }
  }

  let getPlaquetaPorCentroDeCusto = async (plaqueta: any, idEmpresa: any, idLocal:any, idCentroDeCusto:any, instalacao: any, acessToken: any) => {
    try {
      const resposta = await fetch(`${urlApi}/Inventario/BuscarPlaquetaPorCentroDeCusto/${plaqueta}/${idEmpresa}/${idLocal}/${idCentroDeCusto}/${instalacao}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${acessToken}`,
          'Content-Type': `application/json`
        }
      })

      if (resposta.ok) {
        const json = await resposta.json();

        if (json.status) {

          const resultado = json.dados;

          //console.log(`json chegou`)
          setDados(resultado); // limita a 20 registros
          setTotalReg(resultado.length)
          if (resultado.length == 1) {
            if (resultado[0].avlItmSit.toString() == 'I') {
              alert('Este Bem já foi inventariado!');
            }
            if (resultado[0].avlItmSit.toString() == 'N') {
              alert('Este Bem já foi inventariado!');
            }
            if (resultado[0].avlItmSit.toString() == 'S') {
              console.log(resultado[0])
              navigation.navigate("inventarios", { item: resultado[0] });
            }
          }
        } else {
          setTotalReg("0")
          setDados([]);
            adicionarNovo();

            //Alert.alert(
            //"",
            //"Número de plaqueta disponível!\n deseja utilizar?",
            //[
            //{
            //text: "Não",
            //style: "cancel"
            //},
            //{ text: "SIM", onPress: () => adicionarNovo() }
            //],
            //{ cancelable: false }
            //);

        }

      } else {
        alert(resposta.statusText)
      }
    } catch (erro) {
      setDados([]);
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

  function redirecionaInventario() {
    router.navigate("/inventarios")
  }

  function redirecionaMenu() {
    router.navigate("/home")
    //if (Platform.OS === 'ios') {
    //router.navigate("/homeIOS")
    //} else {
    // router.navigate("/homeAndroid")
    //}
  }

  let setDropDownLocal = async (value) => {
    setCarregando(true)
    await verificarConexao();
    let sessao: string | null = await AsyncStorage.getItem(`session`)
    if (sessao != null) {
      //console.log(response.instalacao);
      const response = JSON.parse(sessao);
      const instalacao = response.instalacao
      const idEmpresa = response.idEmpresa
      const acessToken = response.acessToken
      //carregar centro de custo
      //console.log('droplocal')
      //console.log(value)
      setLocal(value)
      if (value !== null && value !== undefined && value !== '' && value !== '0') {
        await getCentroDeCusto(idEmpresa.toString(), value.toString(), instalacao, acessToken);
        await getInventariosLocal(idEmpresa, value.toString(), instalacao, acessToken);
      }
      else {
        await getInventarios(idEmpresa, instalacao, acessToken);
        setDadosCentroDeCusto([]);
        setLocal('0')
        setCentroDeCusto('0')
      }
      setCarregando(false)
    }
  }

  let setDropDownCentroDeCusto = async (value) => {
    setCarregando(true)
    await verificarConexao();
    let sessao: string | null = await AsyncStorage.getItem(`session`)
    if (sessao != null) {
      //console.log(response.instalacao);
      const response = JSON.parse(sessao);
      const instalacao = response.instalacao
      const idEmpresa = response.idEmpresa
      const acessToken = response.acessToken

      //carregar centro de custo
      //console.log('droplocal')
      //console.log(value)
      setCentroDeCusto(value);
      if (value !== null && value !== undefined && value !== '' && value !== '0') {
        await getInventariosCentroDeCusto(idEmpresa, local, value.toString(), instalacao, acessToken);
      } else {
        setDadosCentroDeCusto([]);
        if (local != '0' && local != '') {
          await getInventariosLocal(idEmpresa, local, instalacao, acessToken);
        } else {
          setCentroDeCusto('0')
          await getInventarios(idEmpresa, instalacao, acessToken);
        }
      }
    }
    setCarregando(false)
  }

  return (
 <ScrollView>
    <View style={styles.containerLista}>
      <Text style={styles.titleMedioCenter}>Purple Collector - Inventários</Text>
      <Text style={styles.titleMenor}>{empresa} - {cnpj}</Text>


      <Text>Local</Text>
      <View style={styles.pickerContainer}>
        <Picker selectedValue={local} onValueChange={(value) => setDropDownLocal(value)}>
          <Picker.Item label="SELECIONE" value={'0'}></Picker.Item>
          {dadosLocal.map((item) => (
            <Picker.Item key={item.locId} label={item.locCod + `-` + item.locNom} value={item.locId.toString()} />
          ))}
        </Picker>
      </View>

      <Text >Centro de custo</Text>
      <View style={styles.pickerContainer}>
        <Picker selectedValue={centroDeCusto} onValueChange={(value) => setDropDownCentroDeCusto(value)}>
          <Picker.Item label="SELECIONE" value={'0'}></Picker.Item>
          {dadosCentroDeCusto.map((item) => (
            <Picker.Item key={item.cecId} label={item.cecCod + `-` + item.cecNom} value={item.cecId.toString()} />
          ))}
        </Picker>
      </View>

      <Text>PLAQUETA</Text>
      <Input placeholder={'0000000'} keyboardType="numeric" value={plaqueta} maxLength={6} onChangeText={(value) => setPlaqueta(value)} />

      {
        !carregando ? (
          <Button title="Buscar" onPress={buscarPlaqueta} />
          
        ):(
            <ActivityIndicator color={'#6C3BAA'} size={40}></ActivityIndicator>
          )
      }

    <Button title="Voltar" onPress={redirecionaMenu} />

      <Text style={styles.titleMenor}>Total de Registro(s): {totalReg}</Text>

      <View style={styles.containerGrid}>

        {carregando ? (
            <View style={styles.containerMenu}>
            <Text style={styles.title}>Carregando os dados...</Text>
            <ActivityIndicator size="large" color="#6C3BAA" />
            </View>
        ) : (
          <FlatList
            data={dados}
            keyExtractor={(item, index) => index.toString()}
            ListHeaderComponent={

            <View style={[styles.row, styles.header]}>
              <Text style={[styles.cell, styles.headerText]}>Plaqueta</Text>
              <Text style={[styles.cell, styles.headerText]}>Item</Text>
              <Text style={[styles.cell, styles.headerText]}>Situação</Text>
            </View>
            }
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.row}
                onPress={() => navigation.navigate("inventarios", { item })}>
                <Text style={styles.cell}>{setFormatPlaqueta(item.avlItmPlq.toString())}</Text>
                <Text style={styles.cell}>{item.avlItmDes}</Text>
                <Text style={styles.cell}>{item.avlItmSit == 'N' ? `Novo` : item.avlItmSit == 'S' ? `Sobra contabil` : item.avlItmSit == 'I' ? 'Inventariado' : item.avlItmSit == 'C' ? 'Concluído' : ''}</Text>
              </TouchableOpacity>
            )}

            scrollEnabled={false}
            
            ListFooterComponent={
              carregando && (
                  <ActivityIndicator size="large" color="#6C3BAA" />
                )
            }

            ListEmptyComponent={
              <Text style={{ textAlign: 'center', marginTop: 20, color: 'gray' }}>
                Nenhum registro encontrado.
              </Text>
            }
          />
        )}
      </View>


    </View>
    </ScrollView>
  );
};

export default ListaInventarios;