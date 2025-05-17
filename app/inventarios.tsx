import { TouchableOpacity, View, ActivityIndicator, Text, StyleSheet, Image, ScrollView, StatusBar } from "react-native"
import { router } from "expo-router"
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import { useRoute, useNavigation, createStaticNavigation, useFocusEffect } from '@react-navigation/native';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Network from 'expo-network';

import { Button } from "../components/button"
import { Input } from "../components/input"
import TabelaAPI from '../app/listaInventarios';
import { styles } from "./styles";

const urlApi = `https://servicos.opurple.com.br/Api`

const Inventarios = () => {

      const route = useRoute();
      const pickerRef = useRef();

      const [carregando, setCarregando] = useState(true);
      const [pickerEnabled, setPickerEnabled] = useState(true);
      const [btnInventariar, setBtnInventariar] = useState(false);

      const [tituloPage, setTituloPage] = useState('Novo Invetário')
      const [dadosEmpresa, setDadosEmpresa] = useState([]);
      const [dadosLocal, setDadosLocal] = useState([]);
      const [dadosCentroDeCusto, setDadosCentroDeCusto] = useState([]);
      const [dadosSetor, setDadosSetor] = useState([]);
      const [dadosItems, setDadosItems] = useState([]);

      const [empresa, setEmpresa] = useState('')
      const [local, setLocal] = useState('')
      const [centroDeCusto, setCentroDeCusto] = useState('')
      const [plaqueta, setPlaqueta] = useState('')
      const [plaquetaAnt, setPlaquetaAnt] = useState('')
      const [quantidade, setQuantidade] = useState('')
      const [setor, setSetor] = useState('')
      const [items, setItems] = useState('')
      const [descricao, setDescricao] = useState('')
      const [complemento, setComplemento] = useState('')
      const [numeroDeSerie, setNumeroDeSerie] = useState('')
      const [conservacao, setConservacao] = useState('')
      const [andar, setAndar] = useState('')
      const [situacao, setSituacao] = useState('')
      const [status, setStatus] = useState('')

      const [urlFuncao, seturlFuncao] = useState('')

      const [idInventario, setIdInventario] = useState('')

      useFocusEffect(
            useCallback(() => {
                  const fetchData = async () => {
                        await validaSessao();
                        await carregarDados(route.params?.item);
                  };

                  fetchData();
            }, [route.params?.item])
      );

      let carregarDados = async (item) => {
            setCarregando(true)
            await new Promise(resolve => setTimeout(resolve, 1000));
            let sessao: string | null = await AsyncStorage.getItem(`session`)
            if (sessao != null) {

                  //console.log(response.instalacao);
                  const response = JSON.parse(sessao);
                  //console.log(response)
                  const instalacao = response.instalacao
                  const idEmpresa = response.idEmpresa
                  const acessToken = response.acessToken
                  await getEmpresa(instalacao, acessToken)
                  await getLocal(idEmpresa, instalacao, acessToken)

                  if (item != null) {
                        if (item.avlItmId.toString() != '' && item.avlItmId.toString() != '0') {
                              //console.log(item)
                              //Edicao
                              setTituloPage('Editar Inventário')
                              console.log('Edicao')
                              setIdInventario(item.avlItmId.toString())
                              console.log('IdInventario: ' + item.avlItmId.toString())
                              setEmpresa(item.avlItmEpsId.toString())
                              console.log('empresa: ' + item.avlItmEpsId.toString())
                              //setDadosEmpresa(item.avlItmEpsId.toString())
                              setPickerEnabled(false)

                              setLocal(item.avlItmLocId.toString())
                              console.log('local: ' + item.avlItmLocId.toString())
                              //setDadosLocal(item.avlItmLocId.toString())
                              //console.log('id empresa')
                              //console.log(item.avlItmEpsId.toString())
                              await getCentroDeCusto(item.avlItmEpsId.toString(), item.avlItmLocId.toString(), instalacao, acessToken);
                              setCentroDeCusto(item.avlItmCecId.toString())
                              console.log('centro de custo: ' + item.avlItmCecId.toString())

                              await getSetor(item.avlItmEpsId.toString(), item.avlItmLocId.toString(), item.avlItmCecId.toString(), instalacao, acessToken)
                              setSetor(item.avlItmSetId.toString())
                              console.log('setor: ' + item.avlItmSetId.toString())
                              console.log('plaqueta sem formato: ' + item.avlItmPlq.toString())

                              console.log('plaquetaAnt sem formato: ' + item.avlItmPlqAnt)
                              setPlaqueta(setFormatPlaqueta(item.avlItmPlq.toString()))


                              if (item.avlItmPlqAnt != '') {
                                    setPlaquetaAnt(item.avlItmPlqAnt)
                              } else {
                                    setPlaquetaAnt(item.avlItmPlq.toString())
                              }
                              console.log('plaqueta: ' + item.avlItmPlq.toString())
                              console.log('plaqueta anterior: ' + item.avlItmPlqAnt)

                              await getItems(instalacao, acessToken)
                              setItems(item.avlItmDes.toString())
                              console.log('item: ' + item.avlItmDes.toString())

                              setDescricao(item.avlItmDes.toString())
                              console.log('descrcao: ' + item.avlItmDes.toString())
                              //setItems(item)
                              setComplemento(item.avlItmComp.toString())
                              console.log('complemento: ' + item.avlItmComp.toString())

                              setNumeroDeSerie(item.avlItmNumSer.toString())
                              console.log('numero de serie: ' + item.avlItmNumSer.toString())

                              setConservacao(item.avlItmCon.toString())
                              console.log('conservacao: ' + item.avlItmCon.toString())

                              //console.log(item.avlItmCon.toString())
                              setAndar(item.avlItmAnd.toString())
                              console.log('andar: ' + item.avlItmAnd.toString())

                              setSituacao(item.avlItmSit.toString())
                              if (item.avlItmSit.toString() == 'S') {
                                    setBtnInventariar(true)
                              }
                              console.log('situacao: ' + item.avlItmSit.toString())

                              //setValorAquisicao(item.avlItmVlrAqs.toString())
                              setStatus(item.avlItmSts.toString())
                              console.log('status: ' + item.avlItmSts.toString())

                        } else {
                              console.log('Novo registro')
                              //novo registro
                              setEmpresa(item.avlItmEpsId.toString())
                              //setDadosEmpresa(item.avlItmEpsId.toString())
                              setPickerEnabled(false)

                              setLocal(item.avlItmLocId.toString())
                              console.log('local: ' + item.avlItmLocId.toString())
                              //setDadosLocal(item.avlItmLocId.toString())
                              //console.log('id empresa')
                              //console.log(item.avlItmEpsId.toString())
                              await getCentroDeCusto(item.avlItmEpsId.toString(), item.avlItmLocId.toString(), instalacao, acessToken);
                              setCentroDeCusto(item.avlItmCecId.toString())
                              console.log('centro de custo: ' + item.avlItmCecId.toString())

                              //await getSetor(item.avlItmEpsId.toString(), item.avlItmLocId.toString(), item.avlItmCecId.toString(), instalacao, acessToken)
                              
                              //setSetor(item.avlItmSetId.toString())
                              //console.log('setor: ' + item.avlItmSetId.toString())

                              setPlaqueta(setFormatPlaqueta(item.avlItmPlq.toString()))
                              if (item.avlItmPlqAnt.toString() != '') {
                                    setPlaquetaAnt(item.avlItmPlqAnt.toString())
                              } else {
                                    setPlaquetaAnt(item.avlItmPlq.toString())
                              }
                              await getItems(instalacao, acessToken)

                              setSituacao('N')
                        }
                  }
            }
            setCarregando(false);
      }


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

      const isEmpty = (value) => {
            return (
              value === undefined ||
              value === null ||
              (typeof value === "string" && value.trim() === "") ||
              (Array.isArray(value) && value.length === 0) ||
              (typeof value === "object" && !Array.isArray(value) && Object.keys(value).length === 0)
            );
          };


      let validaSessao = async () => {
            let sessao: string | null = await AsyncStorage.getItem(`session`)
            if (sessao == null) {
                  alert(`Sua Sessão caiu...`)
                  router.navigate("..")
                  return;
            }
      }

      let getEmpresa = (instalacao: any, acessToken: any) => {
            fetch(`${urlApi}/Empresa/ListarTodos/${instalacao}`, {
                  headers: { Authorization: `Bearer ${acessToken}` }
            })
                  .then(res => {
                        //console.log(res.status);
                        //console.log(res.headers);
                        return res.json();
                  })
                  .then(async (result) => {
                        //console.log(`getempresa`)
                        //console.log(result.status);
                        //console.log(result)
                        if (result.status) {
                              //const json = await result.json();
                              //console.log(result.dados)
                              setDadosEmpresa(result.dados);


                        } else {
                              console.log(result.mensagem);
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
                              console.log(result.mensagem);
                              alert(`${result.mensagem}`)
                        }
                  },
                        (error) => {
                              console.log(error);
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
                              alert(`${result.mensagem}`)
                        }
                  },
                        (error) => {
                              console.log(error);
                        })
                  .finally();
      }

      let getSetor = (idEmpresa: any, idLocal: any, idCentroDeCusto: any, instalacao: any, acessToken: any) => {
            fetch(`${urlApi}/Setor/ListarTodos/${idEmpresa}/${idLocal}/${idCentroDeCusto}/${instalacao}`, {
                  headers: { Authorization: `Bearer ${acessToken}` }
            })
                  .then(res => {
                        //console.log(res.status);
                        //console.log(res.headers);
                        return res.json();
                  })
                  .then(async (result) => {
                        //console.log(`getSetor`)
                        //console.log(result.status);
                        if (result.status) {
                              //const json = await result.json();
                              //console.log(result.dados)
                              setDadosSetor(result.dados);


                        } else {
                              console.log(result.mensagem);
                              alert(`${result.mensagem}`)
                        }
                  },
                        (error) => {
                              console.log(error);
                        })
                  .finally();
      }

      let getItems = (instalacao: any, acessToken: any) => {
            fetch(`${urlApi}/Items/ListarTodos/${instalacao}`, {
                  headers: { Authorization: `Bearer ${acessToken}` }
            })
                  .then(res => {
                        //console.log(res.status);
                        //console.log(res.headers);
                        return res.json();
                  })
                  .then(async (result) => {
                        //console.log(`getItems`)
                        //console.log(result.status);
                        if (result.status) {
                              //const json = await result.json();
                              //console.log(result.dados)
                              setDadosItems(result.dados);


                        } else {
                              console.log(result.mensagem);
                              alert(`${result.mensagem}`)
                        }
                  },
                        (error) => {
                              console.log(error);
                        })
                  .finally();
      }

      let setDropDownLocal = async (value) => {
            setCarregando(true)
            //carregar centro de custo
            //console.log('droplocal')
            //console.log(value)
            setLocal(value)
            if (value != '') {
                  let sessao: string | null = await AsyncStorage.getItem(`session`)
                  if (sessao != null) {
                        //console.log(response.instalacao);
                        const response = JSON.parse(sessao);
                        const instalacao = response.instalacao
                        const idEmpresa = response.idEmpresa
                        const acessToken = response.acessToken
                        await getCentroDeCusto(idEmpresa.toString(), value.toString(), instalacao, acessToken);
                  }
            }
            else {
                  setDadosCentroDeCusto([]);
                  setDadosSetor([])
            }
            setCarregando(false)
      }

      let setDropDownCentroDeCusto = async (value) => {
            setCarregando(true)
            //carregar centro de custo
            //console.log('droplocal')
            //console.log(value)
            setCentroDeCusto(value);
            if (value != '') {
                  let sessao: string | null = await AsyncStorage.getItem(`session`)
                  if (sessao != null) {
                        //console.log(response.instalacao);
                        const response = JSON.parse(sessao);
                        const instalacao = response.instalacao
                        const idEmpresa = response.idEmpresa
                        const acessToken = response.acessToken

                        await getSetor(idEmpresa.toString(), local.toString(), value.toString(), instalacao, acessToken)
                  }
            }
            else {
                  setDadosCentroDeCusto([]);
                  setDadosSetor([])
            }
            setCarregando(false)
      }

      let setDropDownItem = (value) => {
            setItems(value);
            setDescricao(value);
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

      let Salvar = async () => {
            setCarregando(true)
            let sessao: string | null = await AsyncStorage.getItem(`session`)
            if (sessao == null) {
                  alert(`Sua Sessão caiu...`)
                  router.navigate("..")
            } else {

                  if (empresa == '') {
                        alert('Selecione uma Empresa.')
                  }
                  else if (local == '') {
                        alert('Selecione um local.')
                  }
                  else if (centroDeCusto == '') {
                        alert('Selecione um Centro de Custo.')
                  }
                  else if (plaqueta == '') {
                        alert('Digite uma plaqueta.')
                  }
                  else if (setor == '') {
                        alert('Selecione um Setor.')
                  }
                  else if (items == '') {
                        alert('Selecione um Item.')
                  }
                  else if (conservacao == '') {
                        alert('Selecione uma nota de conservação.')
                  }
                  else if (situacao == '') {
                        alert('Selecione uma situacao.')
                  } else {

                        //console.log(response.instalacao);
                        const response = JSON.parse(sessao);
                        console.log('botao_salvar')

                        const instalacao = response.instalacao
                        const idEmpresa = response.idEmpresa
                        const acessToken = response.acessToken
                        const idUser = response.idUser

                        try {
                              if (idInventario != '') {
                                    console.log('executar edicao')

                                    let novaSituacao = situacao.toString()
                                    //Se For sobre contabil virar Inventario
                                    if (situacao.toString() == 'S') {
                                          novaSituacao = 'I'
                                    }

                                    const resposta = await fetch(`${urlApi}/Inventario/Atualizar`, {
                                          method: 'PUT',
                                          body: JSON.stringify({
                                                'avlItmId': idInventario,
                                                'avlItmEpsId': empresa.toString(),
                                                'avlItmLocId': local.toString(),
                                                'avlItmCecId': centroDeCusto.toString(),
                                                'avlItmSetId': setor.toString(),
                                                'avlItmPlq': plaqueta.toString(),
                                                'avlItmPlqAnt': plaqueta.toString(),
                                                'avlItmDes': descricao.toString(),
                                                'avlItmComp': complemento.toString(),
                                                'avlItmNumSer': numeroDeSerie.toString(),
                                                'avlItmCon': conservacao.toString(),
                                                'avlItmAnd': andar.toString(),
                                                'avlItmSit': novaSituacao.toString(),
                                                'avlItmVlrAqs': '0',
                                                'avlItmSts': status.toString(),
                                                'avlItmUsrIncId': idUser.toString(),
                                                'avlItmUsrAltId': idUser.toString(),
                                                'avlItmIstId': instalacao.toString(),
                                          }),
                                          headers: {
                                                Authorization: `Bearer ${acessToken}`,
                                                'Content-Type': `application/json`
                                          }
                                    })

                                    console.log(resposta)
                                    if (resposta.status) {
                                          if (resposta.ok) {
                                                const json = await resposta.json();
                                                alert('Registro salvo com sucesso!');
                                                router.navigate('/listaInventarios')
                                          } else {
                                                console.log(resposta.status)
                                                throw new Error(`Erro ao atualizar: ${resposta.status}`);
                                          }
                                    } else {
                                          console.log(resposta.status)
                                          throw new Error(`Erro ao atualizar: ${resposta}`);
                                    }
                              } else {
                                    console.log('executar adicao')
                                    console.log(acessToken)
                                    console.log(instalacao)
                                    console.log(empresa)
                                    const resposta = await fetch(`${urlApi}/Inventario/Adicionar`, {
                                          method: 'POST',
                                          body: JSON.stringify({
                                                'avlItmId': 0,
                                                'avlItmEpsId': empresa.toString(),
                                                'avlItmLocId': local.toString(),
                                                'avlItmCecId': centroDeCusto.toString(),
                                                'avlItmSetId': setor.toString(),
                                                'avlItmPlq': plaqueta.toString(),
                                                'avlItmPlqAnt': plaqueta.toString(),
                                                'avlItmDes': descricao.toString(),
                                                'avlItmComp': complemento.toString(),
                                                'avlItmNumSer': numeroDeSerie.toString(),
                                                'avlItmCon': conservacao.toString(),
                                                'avlItmAnd': andar.toString(),
                                                'avlItmSit': situacao.toString(),
                                                'avlItmVlrAqs': 0,
                                                'avlItmSts': 1,
                                                'avlItmUsrIncId': idUser.toString(),
                                                'avlItmUsrAltId': idUser.toString(),
                                                'avlItmIstId': instalacao.toString(),
                                          }),
                                          headers: {
                                                Authorization: `Bearer ${acessToken}`,
                                                'Content-Type': `application/json`
                                          }
                                    })

                                    console.log(resposta)
                                    console.log(resposta.status)
                                    console.log(resposta.ok)
                                    if (resposta.status) {
                                          if (resposta.ok) {
                                                const json = await resposta.json();
                                                console.log(json.mensagem)
                                                if (json.status) {
                                                      alert('Registro Incluído com sucesso!');
                                                      router.navigate('/listaInventarios')
                                                } else {
                                                      alert(json.mensagem);
                                                }
                                          } else {
                                                console.log(resposta)
                                                throw new Error(`Erro ao incluir: ${resposta.status}`);
                                          }
                                    } else {
                                          console.log(resposta.status)
                                          throw new Error(`Erro ao incluir: ${resposta}`);
                                    }
                              }

                        } catch (error) {
                              console.log(error);
                              console.error(error);
                              setCarregando(false)
                        }
                  }
            }
            setCarregando(false)
      }

      return (
      <SafeAreaView style={{ flex: 1 }}>


            {carregando ? (
                  <View style={styles.containerMenu}>
                  <Text style={styles.title}>Carregando os dados...</Text>
                  <ActivityIndicator size="large" color="#6C3BAA" />
                  </View>
            ) : (
            <ScrollView>
                  <View style={styles.containerMenu}>
                        <Text style={styles.title}>Purple Collector</Text>
                        <Text style={styles.titlePequeno}> {tituloPage}
                        </Text>

                        <Text>EMPRESA</Text>
                        <View style={styles.pickerContainer}>
                              <Picker selectedValue={empresa} onValueChange={(value) => setEmpresa(value)} enabled={pickerEnabled}>
                                    <Picker.Item label="SELECIONE" value={''}></Picker.Item>
                                    {dadosEmpresa.map((item) => (
                                          <Picker.Item key={item.epsId} label={item.epsNomFnt + `-` + item.epsCnpj} value={item.epsId.toString()} />
                                    ))}
                              </Picker>
                        </View>
                        <Text>LOCAL</Text>
                        <View style={styles.pickerContainer}>
                              <Picker selectedValue={local} onValueChange={(value) => setDropDownLocal(value)}>
                                    <Picker.Item label="SELECIONE" value={``}></Picker.Item>
                                    {dadosLocal.map((item) => (
                                          <Picker.Item key={item.locId} label={item.locCod + `-` + item.locNom} value={item.locId.toString()} />
                                    ))}
                              </Picker>
                        </View>
                        <Text>CENTRO DE CUSTO</Text>
                        <View style={styles.pickerContainer}>
                              <Picker selectedValue={centroDeCusto} onValueChange={(value) => setDropDownCentroDeCusto(value)}>
                                    <Picker.Item label="SELECIONE" value={``}></Picker.Item>
                                    {dadosCentroDeCusto.map((item) => (
                                          <Picker.Item key={item.cecId} label={item.cecCod + `-` + item.cecNom} value={item.cecId.toString()} />
                                    ))}
                              </Picker>
                        </View>

                        <Text>PLAQUETA</Text>
                        <Input value={plaqueta} maxLength={6} onChangeText={(value) => setPlaqueta(value)} placeholder={'000000'} />

                        <Text>NOVA PLAQUETA</Text>
                        <Input value={plaqueta} maxLength={6} onChangeText={(value) => setPlaqueta(value)} placeholder={'000000'} />

                        <Text>SETOR</Text>
                        <View style={styles.pickerContainer}>
                              <Picker selectedValue={setor} onValueChange={(value) => setSetor(value)}>
                                    <Picker.Item label="SELECIONE" value={``}></Picker.Item>
                                    {dadosSetor.map((item) => (
                                          <Picker.Item key={item.setId} label={item.setCod + `-` + item.setNom} value={item.setId.toString()} />
                                    ))}
                              </Picker>
                        </View>
                        <Text>ITEM</Text>
                        <View style={styles.pickerContainer}>
                              <Picker selectedValue={items} onValueChange={(value) => setDropDownItem(value)}>
                                    <Picker.Item label="SELECIONE" value={``}></Picker.Item>
                                    {dadosItems.map((item) => (
                                          <Picker.Item key={item.itmNom} label={item.itmNom} value={item.itmNom.toString()} />
                                    ))}
                              </Picker>
                        </View>
                        <Text>DESCRIÇÃO</Text>
                        <Input value={descricao} maxLength={200} onChangeText={(value) => setDescricao(value)} placeholder={'DIGITE'} />
                        <Text>COMPLEMENTO</Text>
                        <Input value={complemento} onChangeText={(value) => setComplemento(value)} placeholder={'DIGITE'} />
                        <Text>NÚMERO DE SÉRIE</Text>
                        <Input value={numeroDeSerie} onChangeText={(value) => setNumeroDeSerie(value)} placeholder={'DIGITE'} />
                        <Text>NOTA DE CONSERVAÇÃO</Text>
                        <View style={styles.pickerContainer}>
                              <Picker selectedValue={conservacao} onValueChange={(value) => setConservacao(value)}>
                                    <Picker.Item label="SELECIONE" value={``}></Picker.Item>
                                    <Picker.Item label="NOTA 1" value={`1`}></Picker.Item>
                                    <Picker.Item label="NOTA 2" value={`2`}></Picker.Item>
                                    <Picker.Item label="NOTA 3" value={`3`}></Picker.Item>
                                    <Picker.Item label="NOTA 4" value={`4`}></Picker.Item>
                                    <Picker.Item label="NOTA 5" value={`5`}></Picker.Item>
                                    <Picker.Item label="NOTA 6" value={`6`}></Picker.Item>
                                    <Picker.Item label="NOTA 7" value={`7`}></Picker.Item>
                                    <Picker.Item label="NOTA 8" value={`8`}></Picker.Item>
                                    <Picker.Item label="NOTA 9" value={`9`}></Picker.Item>
                                    <Picker.Item label="NOTA 10" value={`10`}></Picker.Item>
                              </Picker>
                        </View>
                        <Text>ANDAR</Text>
                        <Input value={andar} onChangeText={(value) => setAndar(value)} placeholder={'DIGITE'} />
                        <Text>SITUAÇÃO</Text>
                        <View style={styles.pickerContainer}>
                              <Picker selectedValue={situacao} onValueChange={(value) => setSituacao(value)} enabled={pickerEnabled}>
                                    <Picker.Item label="SELECIONE" value={``}></Picker.Item>
                                    <Picker.Item label="NOVO" value={`N`}></Picker.Item>
                                    <Picker.Item label="SOBRA CONTÁBIL" value={`S`}></Picker.Item>
                                    <Picker.Item label="INVENTARIADO" value={`I`}></Picker.Item>
                                    <Picker.Item label="CONCLUÍDO" value={`C`}></Picker.Item>
                              </Picker>
                        </View>

                        {
                              !carregando ? (
                                    <Button title={btnInventariar ? 'Inventariar' : 'Salvar'} onPress={Salvar} />
                              ) :
                                    (
                                          <ActivityIndicator color={'#6C3BAA'} size={40}></ActivityIndicator>
                                    )
                        }

                        <Button title="Voltar" onPress={() => router.navigate('/listaInventarios')} />
                  </View>
            </ScrollView>
            )}

      </SafeAreaView>
      )
};

export default Inventarios;
