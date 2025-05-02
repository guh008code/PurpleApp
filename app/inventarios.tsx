import { TouchableOpacity, View, ActivityIndicator, Text, StyleSheet, Image, ScrollView, StatusBar } from "react-native"
import { router } from "expo-router"
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import { useRoute, useNavigation, createStaticNavigation } from '@react-navigation/native';
import React, { useEffect, useState, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

      const [metodo, setMetodo] = ""
      const [urlFuncao, seturlFuncao] = useState('')

      const [idInventario, setIdInventario] = useState('')

      useEffect(() => {
            // Função que será executada assim que o componente carregar
            validaSessao();
            carregarDados(route.params?.item)
            // Se quiser rodar só uma vez, deixe o array de dependências vazio
      }, []);

      let carregarDados = async (item) => {
            let sessao: string | null = await AsyncStorage.getItem(`session`)
            if (sessao != null) {

                  //console.log(response.instalacao);
                  const response = JSON.parse(sessao);
                  //console.log(response)
                  const instalacao = response.instalacao
                  const idEmpresa = response.idEmpresa
                  const acessToken = response.acessToken
                  getEmpresa(instalacao, acessToken)
                  getLocal(idEmpresa, instalacao, acessToken)

                  if (item != null) {
                        if (item.avlItmId.toString() != '' && item.avlItmId.toString() != '0') {
                              //console.log(item)
                              //Edicao
                              //console.log('Edicao')
                              setIdInventario(item.avlItmId.toString())

                              setEmpresa(item.avlItmEpsId.toString())
                              //setDadosEmpresa(item.avlItmEpsId.toString())
                              setPickerEnabled(false)

                              setLocal(item.avlItmLocId.toString())
                              //setDadosLocal(item.avlItmLocId.toString())
                              //console.log('id empresa')
                              //console.log(item.avlItmEpsId.toString())
                              getCentroDeCusto(item.avlItmEpsId.toString(), item.avlItmLocId.toString(), instalacao, acessToken);
                              setCentroDeCusto(item.avlItmCecId.toString())

                              getSetor(item.avlItmEpsId.toString(), item.avlItmLocId.toString(), item.avlItmCecId.toString(), instalacao, acessToken)
                              setSetor(item.avlItmSetId.toString())

                              setPlaqueta(setFormatPlaqueta(item.avlItmPlq.toString()))
                              if (item.avlItmPlqAnt.toString() != '') {
                                    setPlaquetaAnt(item.avlItmPlqAnt.toString())
                              } else {
                                    setPlaquetaAnt(item.avlItmPlq.toString())
                              }
                              getItems(instalacao, acessToken)
                              setItems(item.avlItmDes.toString())
                              setDescricao(item.avlItmDes.toString())
                              //setItems(item)
                              setComplemento(item.avlItmComp.toString())
                              setNumeroDeSerie(item.avlItmNumSer.toString())
                              setConservacao(item.avlItmCon.toString())
                              //console.log(item.avlItmCon.toString())
                              setAndar(item.avlItmAnd.toString())
                              setSituacao(item.avlItmSit.toString())
                              if (item.avlItmSit.toString() == 'S') {
                                    setBtnInventariar(true)
                              }
                              //setValorAquisicao(item.avlItmVlrAqs.toString())
                              setStatus(item.avlItmSts.toString())
                        } else {
                              //novo registro
                              setEmpresa(item.avlItmEpsId.toString())
                              //setDadosEmpresa(item.avlItmEpsId.toString())
                              setPickerEnabled(false)

                              setPlaqueta(setFormatPlaqueta(item.avlItmPlq.toString()))
                              if (item.avlItmPlqAnt.toString() != '') {
                                    setPlaquetaAnt(item.avlItmPlqAnt.toString())
                              } else {
                                    setPlaquetaAnt(item.avlItmPlq.toString())
                              }
                              getItems(instalacao, acessToken)

                              setSituacao('N')
                        }
                  }
            }
            setCarregando(false);
      }


      let validaSessao = async () => {
            let sessao: string | null = await AsyncStorage.getItem(`session`)
            if (sessao == null) {
                  alert(`Sua Sessão caiu...`)
                  router.navigate("..")
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
                        getCentroDeCusto(idEmpresa.toString(), value.toString(), instalacao, acessToken);
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

                        getSetor(idEmpresa.toString(), local.toString(), value.toString(), instalacao, acessToken)
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

      const setFormatPlaqueta = (value) => {
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
                                                if(json.status){
                                                      alert('Registro Incluído com sucesso!');
                                                      router.navigate('/listaInventarios')
                                                }else{
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

            <ScrollView>
                  <View style={styles.containerMenu}>
                        <Text style={styles.title}>Purple Manager</Text>
                        <Text style={styles.titlePequeno}>
                              {carregando ? (
                                    <ActivityIndicator size="large" color="#6C3BAA" />
                              ) : (`Cadastrar Inventário`)}
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

      )
};

export default Inventarios;
