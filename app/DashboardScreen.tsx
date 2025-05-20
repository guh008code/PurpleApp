import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { router } from "expo-router"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from "react"

import { StatCard } from '@/components/card';
import { Button } from "../components/button"

import { styles } from "./styles";

const screenWidth = Dimensions.get('window').width;

const DashboardScreen = () => {

  const [nomeLogado, setNomeLogado] = useState("")
  const [email, setEmail] = useState("")

  const [empresaLogado, setEmpresaLogado] = useState("")
  const [empresaCnpj, setEmpresaCnpj] = useState("")

  const [instalacao, setInstalacao] = useState("")
  const [idEmpresa, setIdEmpresa] = useState("")
  const [acessToken, setAcessToken] = useState("")

  const urlApi = `https://servicos.opurple.com.br/Api`

  useEffect(() => {
      // Função que será executada assim que o componente carregar
      carregarDados();
  
      // Se quiser rodar só uma vez, deixe o array de dependências vazio
    }, []);


  const carregarDados = async () => {
    let sessao:string | null = await AsyncStorage.getItem(`session`)
    if(sessao == null){
        alert(`Sua Sessão caiu...`)
        router.navigate("..")
    }else{
        const response = JSON.parse(sessao);
        //console.log(response)
        //console.log(response.instalacao);

        const instalacao = response.instalacao
        const idEmpresa = response.idEmpresa
        const acessToken = response.acessToken

        setInstalacao(response.instalacao);
        setNomeLogado(response.nome);
        setEmail(response.email);
        setIdEmpresa(response.idEmpresa);
        setAcessToken(response.acessToken);

        //console.log('---home Token---');
        //console.log(`Bearer ${acessToken}`);

        //console.log(`instalacao ${instalacao}`);
        //console.log(`idEmpresa ${idEmpresa}`);s

        let itemEmpresa: string | null = await AsyncStorage.getItem(`empresa`)
        if(itemEmpresa == null ){
            getEmpresa(idEmpresa, instalacao, acessToken)
            // Coloque aqui o que você quer executar
        }else{
            const empresa = JSON.parse(itemEmpresa);
            const empresaLogado = empresa.epsNomFnt
            const empresaCnpj = empresa.epsCnpj
            setEmpresaLogado(empresaLogado)
            setEmpresaCnpj(empresaCnpj)
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

  let getEmpresa = (idEmpresa: any, instalacao: any, acessToken: any) =>{
    fetch(`${urlApi}/Empresa/BuscarPorID/${idEmpresa}/${instalacao}`,{
        headers: {Authorization: `Bearer ${acessToken}`}
    })
    .then(res => {
        //console.log(res.status);
        //console.log(res.headers);
        return res.json();
    })
    .then(async (result) =>{
        //console.log(result);

        if(result.status){
            result.dados.epsCnpj = formatarCNPJ(result.dados.epsCnpj)
            await AsyncStorage.setItem(`empresa`, JSON.stringify(result.dados))
            const empresaLogado = result.dados.epsNomFnt
            const empresaCnpj = result.dados.epsCnpj
            setEmpresaLogado(empresaLogado)
            setEmpresaCnpj(empresaCnpj)

        }else{
            alert(`${result.mensagem}`)
        }
    },
    (error) => {
        console.log(error);
    })
    .finally();
}


  return (
    <ScrollView>
      <View style={styles.containerCadastros}>
        <Text style={styles.title}>Purple Collector </Text>
        <Text style={styles.titleMedio}>Relatórios(em construção.)</Text>
        <Text style={styles.titleMedio}>{empresaLogado} - {empresaCnpj}</Text>
       
      
        <StatCard title="Total de Itens" value="120" />
        <StatCard title="Plaquetas em uso" value="35" />
        <StatCard title="Centros de Custos" value="7" />

        <Text style={styles.title}>Plaquetas por Local</Text>
        </View>
        <View style={{ alignItems: 'center' }}>
        
        <BarChart 
        data={{
          labels: ['Local 1', 'Local 2', 'Local 3'],
          datasets: [{ data: [20, 45, 28] }]
        }}
        width={screenWidth - 42}
        height={220}
        yAxisLabel=""
        chartConfig={{
          backgroundColor: '#ffffff',
          backgroundGradientFrom: '#ffffff',
          backgroundGradientTo: '#f2f2f2',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
          labelColor: () => '#333',
        }}
        style={{
          borderRadius: 8,
        }}
      ></BarChart></View>

  <View style={styles.containerMenu}>
    <Button title="Voltar" onPress={() => router.navigate('/home')} />
    </View>
    </ScrollView>
  );
};

export default DashboardScreen;
