import {TouchableOpacity, View, Text, StyleSheet, Image, SafeAreaView, Pressable} from "react-native"
import { Link, router, Stack } from "expo-router"

import { Button } from "../components/button"
import { Input } from "../components/input"
import {CameraView, useCameraPermissions} from "expo-camera"

import { styles } from "./styles";

export default function Inventarios(){

const [permission, requestPermission] = useCameraPermissions();
const isPermissionGranted = Boolean(permission?.granted);

return(
    <View style={styles.containerMenu}>

    <Text style={styles.title}>Purple Manager</Text>

    <Text style={styles.title}>Scannear equipamento</Text>
            <SafeAreaView style={StyleSheet.absoluteFillObject}>
                <Stack.Screen options={{
                    title:"Overview",
                    headerShown:false,
                }}></Stack.Screen>
        
                <CameraView style={StyleSheet.absoluteFillObject}
                facing="back"
                onBarcodeScanned={({data})=>{
                    console.log("data", data);
                }}>
                </CameraView>

            </SafeAreaView>

        <Button title="Scannear" onPress={requestPermission} />
        <Button title="Voltar" onPress={() => router.back()} />
    </View>

)
    
}