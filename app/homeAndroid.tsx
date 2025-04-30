import {TouchableOpacity, View, Text, StyleSheet, Alert, Image} from "react-native"
import { router } from "expo-router"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from "react"
import { Button } from "../components/button"
import { styles } from "./styles";
import ListaInventarios from "./listaInventarios";

const HomeAndroid = () => {
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
            console.log(res.status);
            //console.log(res.headers);
            return res.json();
        })
        .then(async (result) =>{
            console.log(result);

            if(result.status){
                result.dados.epsCnpj = formatarCNPJ(result.dados.epsCnpj)
                await AsyncStorage.setItem(`empresa`, JSON.stringify(result.dados))
                const empresaLogado = result.dados.epsNomFnt
                const empresaCnpj = result.dados.epsCnpj
                setEmpresaLogado(empresaLogado)
                setEmpresaCnpj(empresaCnpj)

            }else{
                Alert.alert(`${result.mensagem}`)
            }
        },
        (error) => {
            console.log(error);
        })
        .finally();
    }

    function redirecionaSetor(){      
        router.navigate("/setor")
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

    function validarSaida(){
        Alert.alert(
            "-Mensagem-",
            "Você deseja realmente sair?",
            [
              {
                text: "Cancelar",
                style: "cancel"
              },
              { text: "SAIR", onPress: () => sair() }
            ],
            { cancelable: false }
          );
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
    <Text style={styles.textMenu}> Bem vindo {nomeLogado} </Text>
    <Text style={styles.textMenu}> Acesso: {email} </Text>
    <Text style={styles.textMenu}>{empresaLogado} - {empresaCnpj}</Text>
        
    <Button title="Inventários" onPress={redirecionaInventario} /> 
    <Button title="Setor" onPress={redirecionaSetor} /> 
    <Button title="Scannear" /> 
    <Button title="Relatórios" /> 
    <Button title="Meu Perfil" onPress={redirecionaMeuPerfil} /> 

    <Button title="SAIR" onPress={validarSaida} />
    </View>
)
    
};

export default HomeAndroid;