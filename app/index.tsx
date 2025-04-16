import { View, Text, TouchableOpacity, StyleSheet, Alert, Image, ActivityIndicator } from "react-native"
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useState } from "react"
import { router } from "expo-router"

import { Button } from "../components/button"
import { Input } from "../components/input"


import { styles } from "./styles";

export default function Index(){

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false)
    const [senha, setSenha] = useState("")
    const [email, setEmail] = useState("")
    const urlApi = `http://development.eba-bu5ryrmq.us-east-1.elasticbeanstalk.com/Api`

    function validarLogin(){
        if(email == ''){
            Alert.alert('Informe um email válido.')
        }else if(senha == ''){
            Alert.alert('Informe uma senha válida.')
        }else{
            console.log(`{`+urlApi+`}/Acesso/Login/`+email+`/`+senha+``)
            //console.log(`${urlApi}/Acesso/Login/${email}/${senha}`)
            getLogin()
        }
    }

    let getLogin = () =>{
        fetch(`${urlApi}/Acesso/Login/${email}/${senha}`)
        .then(res => {
            console.log(res.status);
            //console.log(res.headers);
            return res.json();
        })
        .then((result) =>{
            console.log(result);

            if(result.status){

                if(result.dados.idEmpresa == ''){
                    Alert.alert(`Usuário sem permissão para acesso!`)
                }
                else
                {

                //setData(result)
                AsyncStorage.setItem(`acessToken`, result.dados.acessToken)
                AsyncStorage.setItem(`idUser`, result.dados.idUser)
                AsyncStorage.setItem(`idPerfil`, result.dados.idPerfil)
                AsyncStorage.setItem(`nome`, result.dados.nome)
                AsyncStorage.setItem(`instalacao`, `${result.dados.instalacao}`)
                AsyncStorage.setItem(`empresa`, result.dados.idEmpresa)
                AsyncStorage.setItem(`email`, result.dados.email)
                console.log('-----token login -----')

                //console.log(result.dados.acessToken)

                //console.log(result.dados.nome)
                //console.log(result.dados.email)
                //console.log(result.dados.instalacao)
                //console.log(result.dados.idEmpresa)
                //console.log(result.status)
                //console.log(result.dados.acessToken)

                router.navigate("/home")
                }
            }else{
                Alert.alert(`${result.mensagem}`)
            }
        },
        (error) => {
            console.log(`catch entrou`)
            console.log(error);
        })
        .finally(() => setLoading(false));
    }

    function novaMensagem(){      
        setEmail(email)
        console.log("alertando")
        Alert.alert(`Bem vindo, ${email}`)
        router.navigate("/home")
  
    }

    function irCadastro(){      
        router.navigate("/cadastro")
  
    }

    return(
        <View style={styles.container}>
        <Image style={styles.logo} source={require('../assets/logos/logo.png')} />
            <Text style={styles.titleLogin}>E-mail Login</Text>
            <Input value={email} onChangeText={(value) => setEmail(value.toLowerCase())}/>
            <Text style={styles.titleLogin}>Senha </Text>
            <Input secureTextEntry={true} value={senha} onChangeText={(value) => setSenha(value)}/>
            
            <Button title="Entrar" onPress={validarLogin} />
            <Button title="Cadastre-se" onPress={irCadastro} />
            <ActivityIndicator color={'#fff'} size={30}></ActivityIndicator>
        </View>
    )
}



