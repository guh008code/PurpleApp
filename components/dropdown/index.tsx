import { Picker, PickerProps } from '@react-native-picker/picker';

import { styles } from "./styles";

export function DropDown({ ...rest} : PickerProps ){
    return <Picker style={styles.DropDown} {...rest} />
    
}