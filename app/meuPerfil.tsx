import {TouchableOpacity, View, Text, StyleSheet, ScrollView, Image} from "react-native"
import React, { useEffect, useState, useRef } from 'react';
import { router } from "expo-router"

import { Button } from "../components/button"
import { Input } from "../components/input"

import { styles } from "./styles";

export default function MeuPerfil(){
    const [nome, setNome] = useState('')
    const [email, setEmail] = useState('')
    const [empresa, setEmpresa] = useState('')
    const [cnpj, setCnpj] = useState('')
    const [senha, setSenha] = useState('')
    const [confSenha, setConfSenha] = useState('')


    useEffect(() => {
        // Função que será executada assim que o componente carregar

        // Se quiser rodar só uma vez, deixe o array de dependências vazio
  }, []);

return(
    <ScrollView>
    <View style={styles.containerMenu}>
    <Text style={styles.title}>Purple Manager </Text>
    <Text style={styles.title}>Meu Perfil</Text>
            <Text >Meu Nome</Text>
            <Input editable={false} contextMenuHidden={true}/>
            <Text >Meu E-mail</Text>
            <Input editable={false} value={email} maxLength={200} onChangeText={(value) => setEmail(value)} placeholder={'Seu E-mail'}  />
            <Text >CNPJ - Empresa</Text>
            <Input editable={false} value={cnpj} maxLength={14} onChangeText={(value) => setCnpj(value)} placeholder={'000.000.000/0000-00'}  />
            <Text >Nova Senha</Text>
            <Input value={senha} maxLength={10} onChangeText={(value) => setSenha(value)} placeholder={'Senha nova'}  />
            <Text >Confirmar Senha</Text>
            <Input value={confSenha} maxLength={10} onChangeText={(value) => setConfSenha(value)} placeholder={'Confirmação de Senha nova'} />
            <Button title="Salvar"/>
        <Button title="Voltar" onPress={() => router.back()} />
    </View>
    </ScrollView>
)
    
}