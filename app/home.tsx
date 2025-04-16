import {TouchableOpacity, View, Text, StyleSheet, Alert, Image} from "react-native"
import { router } from "expo-router"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from "react"
import { Button } from "../components/button"

import { styles } from "./styles";

export default function Home(){

    const [empresaLogado, setEmpresaLogado] = useState("")
    const [empresaCnpj, setEmpresaCnpj] = useState("")
    const nomeLogado = AsyncStorage.getItem('nome');
    const email = AsyncStorage.getItem('email');

    const instalacao = AsyncStorage.getItem('instalacao');
    const idEmpresa = AsyncStorage.getItem('empresa');
    const acessToken = AsyncStorage.getItem('acessToken');
    const urlApi = `http://development.eba-bu5ryrmq.us-east-1.elasticbeanstalk.com/Api`

    useEffect(() => {
        // Função que será executada assim que o componente carregar
        carregarDados();
    
        // Se quiser rodar só uma vez, deixe o array de dependências vazio
      }, []);
    
      const carregarDados = () => {
        console.log('---home Token---');
        console.log(`Bearer ${acessToken._j}`);

        console.log(`instalacao ${instalacao._j}`);
        console.log(`idEmpresa ${idEmpresa._j}`);
        getEmpresa()
        // Coloque aqui o que você quer executar
      };

    let sair = () => {
        AsyncStorage.getAllKeys()
            .then(keys => AsyncStorage.multiRemove(keys))
            .then(() => router.navigate(".."))
            .then(() => console.log(AsyncStorage.getItem('acessToken')._j)
        );
    }

    let getEmpresa = () =>{
        fetch(`${urlApi}/Empresa/BuscarPorID/${idEmpresa._j}/${instalacao._j}`,{
            headers: {Authorization: `Bearer ${acessToken._j}`}
        })
        .then(res => {
            console.log(res.status);
            //console.log(res.headers);
            return res.json();
        })
        .then((result) =>{
            console.log(result);

            if(result.status){

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

    function redirecionaEstoque(){      
        router.navigate("/estoques")
    }

    function redirecionaInventario(){      
        router.navigate("/inventarios")
    }

    function redirecionaScan(){      
        router.navigate("/scanner")
    }

return(
    <View style={styles.containerMenu}>
    <Text style={styles.title}>Purple Manager</Text>
    <Text style={styles.textMenu}> Bem vindo {nomeLogado} - {email} </Text>
    <Text style={styles.textMenu}>Empresa: {empresaLogado} - CN {empresaCnpj}</Text>
        
        <TouchableOpacity onPress={redirecionaInventario}>
            <View style={styles.absoluteView}>
                <Text style={styles.absoluteText}>Inventários</Text>
            </View>
            <Image source={require('../assets/images/icones/square-plus.png')} />
        </TouchableOpacity>
        
        
        <TouchableOpacity onPress={redirecionaEmpresa} >
            <View style={styles.absoluteView}>
                <Text style={styles.absoluteText}>Empresas</Text>
            </View>
            <Image source={require('../assets/images/icones/building.png')} />
        </TouchableOpacity>

        <TouchableOpacity onPress={redirecionaScan} >
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

        <TouchableOpacity>
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
)
    
}