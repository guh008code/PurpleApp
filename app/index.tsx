import { View, Text, TouchableOpacity, StyleSheet, Alert, Image, ActivityIndicator, Platform } from "react-native"
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useState } from "react"
import { router } from "expo-router"

import { Button } from "../components/button"
import { Input } from "../components/input"


import { styles } from "./styles";

const Index = () => {

    const [data, setData] = useState([]);
    const [carregando, setCarregando] = useState(false);
    const [senha, setSenha] = useState("")
    const [email, setEmail] = useState("")
    const urlApi = `https://servicos.opurple.com.br/Api`

    function validarLogin(){
        if(email == ''){
            Alert.alert('Informe um email válido.')
        }else if(senha == ''){
            Alert.alert('Informe uma senha válida.')
        }else{
            setCarregando(true);
            getLogin(email, senha);
        }
    }

    let getLogin = (email: string, senha: string) =>{
        fetch(`${urlApi}/Acesso/Login/`,{
            method:`POST`,
            body: JSON.stringify({
                'email': email,
                'senha': senha,
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
        .then(res => {
            console.log(res.status);
            console.log(res.headers);
            return res.json();
        })
        .then(async (result) =>{
            //console.log(result);

            if(result.status){
                if(result.dados.idEmpresa == ''){
                    Alert.alert(`Usuário sem permissão para acesso!`)
                }
                else
                {
                    //setData(result)

                    await AsyncStorage.setItem(`session`, JSON.stringify(result.dados))

                    //console.log('-----token login -----')

                    //console.log(result.dados.acessToken)
                    //console.log(result.dados.nome)     
                    if(Platform.OS === 'ios'){
                        router.navigate("/homeIOS")
                    }else{
                        router.navigate("/homeAndroid")
                    }
                }
            }else{
                Alert.alert(`${result.mensagem}`)
            }
        },
        (error) => {
            console.log(`api erro`)
            console.log(error);
        })
        .finally(() => setCarregando(false));
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
            {
                !carregando ? (
                    <Button title="Entrar" onPress={validarLogin} />
                ) : 
                (
                    <ActivityIndicator color={'#6C3BAA'} size={40}></ActivityIndicator>
                )
            }
            <Button title="Cadastre-se" onPress={irCadastro} />
            
        </View>
    )
};

export default Index;



