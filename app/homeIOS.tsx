import {TouchableOpacity, View, Text, StyleSheet, Alert, Image} from "react-native"
import { router } from "expo-router"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from "react"
import { Button } from "../components/button"

import { styles } from "./styles";

const Home = () => {


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
            //console.log(`idEmpresa ${idEmpresa}`);

            let itemEmpresa: string | null = await AsyncStorage.getItem(`empresa`)
            if(itemEmpresa == null ){
                getEmpresa(idEmpresa, instalacao, acessToken)
                // Coloque aqui o que você quer executar
                console.log('buscou dados empresa na base');
            }else{
                const empresa = JSON.parse(itemEmpresa);
                const empresaLogado = empresa.epsNomFnt
                const empresaCnpj = empresa.epsCnpj
                setEmpresaLogado(empresaLogado)
                setEmpresaCnpj(empresaCnpj)
                console.log('buscou dados empresa na memoria');
            }
        }
      };

    let getEmpresa = (idEmpresa: any, instalacao: any, acessToken: any) =>{
        fetch(`${urlApi}/Empresa/BuscarPorID/${idEmpresa}/${instalacao}`,{
            headers: {Authorization: `Bearer ${acessToken}`}
        })
        .then(res => {
            console.log(res.status);
            //console.log(res.headers);
            return res.json();
        })
        .then(async (result) =>{
            console.log(result);

            if(result.status){
                await AsyncStorage.setItem(`empresa`, JSON.stringify(result.dados))
                const empresaLogado = result.dados.epsNomFnt
                const empresaCnpj = result.dados.epsCnpj
                setEmpresaLogado(result.dados.epsNomFnt)
                setEmpresaCnpj(result.dados.epsCnpj)

            }else{
                Alert.alert(`${result.mensagem}`)
            }
        },
        (error) => {
            console.log(error);
        })
        .finally();
    }

    function redirecionaEmpresa(){      
        router.navigate("/empresas")
    }

    function redirecionaSetor(){      
        //router.navigate("/setor")
    }

    function redirecionaMeuPerfil(){      
        router.navigate("/meuPerfil")
    }

    function redirecionaEstoque(){      
        router.navigate("/estoques")
    }

    function redirecionaInventario(){      
        router.navigate("/listaInventarios")
    }

    let sair = async () => {
        console.log('Signout - Deslogando')
        AsyncStorage.getAllKeys()
            .then(keys => AsyncStorage.multiRemove(keys))
            .then(async () => await AsyncStorage.removeItem(`session`))
            .then(() => router.navigate("..")
        );
    }

return(
    <View style={styles.containerMenu}>
    <Text style={styles.title}>Purple Manager</Text>
    <Text style={styles.textMenu}> {nomeLogado} - {email} </Text>
    <Text style={styles.textMenu}>Empresa: {empresaLogado} - {empresaCnpj}</Text>
        

        <TouchableOpacity onPress={redirecionaInventario}>
        <View style={styles.absoluteView}>
            <Text style={styles.absoluteText}>Inventários</Text>
        </View>
        <Image source={require('../assets/images/icones/square-plus.png')} />
        </TouchableOpacity>


        <TouchableOpacity onPress={redirecionaSetor} >
        <View style={styles.absoluteView}>
            <Text style={styles.absoluteText}>Setor</Text>
        </View>
        <Image source={require('../assets/images/icones/building.png')} />
        </TouchableOpacity>

        <TouchableOpacity >
        <View style={styles.absoluteView}>
            <Text style={styles.absoluteText}>Scannear</Text>
        </View>
        <Image source={require('../assets/images/icones/camera.png')} />
        </TouchableOpacity>


        <TouchableOpacity>
        <View style={styles.absoluteView}>
            <Text style={styles.absoluteText}>Relatórios</Text>
        </View>
        <Image source={require('../assets/images/icones/chart-no-axes-combined.png')} />
        </TouchableOpacity>

        <TouchableOpacity onPress={redirecionaMeuPerfil}>
        <View style={styles.absoluteView}>
            <Text style={styles.absoluteText}>Meu Perfil</Text>
        </View>
        <Image source={require('../assets/images/icones/user-plus.png')} />
        </TouchableOpacity>

        <TouchableOpacity>
        <View style={styles.absoluteView} >
            <Text style={styles.absoluteText}>Configurações</Text>
        </View>
        <Image source={require('../assets/images/icones/settings.png')} />
        </TouchableOpacity>
      
        <Button title="SAIR" onPress={sair} />
    </View>
  
)};

export default Home;