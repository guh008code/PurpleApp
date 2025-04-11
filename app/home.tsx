import {TouchableOpacity, View, Text, StyleSheet, Image} from "react-native"
import { router } from "expo-router"
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Button } from "../components/button"

import { styles } from "./styles";

export default function Home(){

    const nomeLogado = AsyncStorage.getItem('NOME');
    const empresaLogado = AsyncStorage.getItem('EMPRESA');

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
    <Text >Bem vindo {nomeLogado} - {empresaLogado}</Text>
    <Text style={styles.title}>Purple Manager</Text>

    <Text style={styles.textCadastro}> Serviços disponíveis abaixo:</Text>

        <TouchableOpacity onPress={redirecionaEmpresa}>
            <View style={styles.absoluteView}>
                <Text style={styles.absoluteText}>Empresas</Text>
            </View>
            <Image source={require('../assets/images/icones/building.png')} />
        </TouchableOpacity>

        <TouchableOpacity onPress={redirecionaScan}>
            <View style={styles.absoluteView}>
                <Text style={styles.absoluteText}>Scannear</Text>
            </View>
            <Image source={require('../assets/images/icones/camera.png')} />
        </TouchableOpacity>

        <TouchableOpacity>
            <View style={styles.absoluteView}>
                <Text style={styles.absoluteText}>Configurações</Text>
            </View>
            <Image source={require('../assets/images/icones/settings.png')} />
        </TouchableOpacity>

        <TouchableOpacity>
            <View style={styles.absoluteView}>
                <Text style={styles.absoluteText}>Relatórios</Text>
            </View>
            <Image source={require('../assets/images/icones/chart-no-axes-combined.png')} />
        </TouchableOpacity>

        <TouchableOpacity onPress={redirecionaInventario}>
            <View style={styles.absoluteView}>
                <Text style={styles.absoluteText}>Inventários</Text>
            </View>
            <Image source={require('../assets/images/icones/square-plus.png')} />
        </TouchableOpacity>
        
      
        <Button title="SAIR" onPress={() => router.back()} />
    </View>
)
    
}