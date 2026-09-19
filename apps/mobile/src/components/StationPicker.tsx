import { useMemo, useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme';

type Props = {
  label: string;
  value: string;
  stations: string[];
  onChange: (station: string) => void;
  placeholder: string;
};

const normalize=(value:string)=>value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();

export function StationPicker({label,value,stations,onChange,placeholder}:Props){
  const [open,setOpen]=useState(false);
  const [query,setQuery]=useState('');
  const filtered=useMemo(()=>{
    const needle=normalize(query);
    return stations.filter(station=>normalize(station).includes(needle));
  },[query,stations]);

  return <>
    <Text style={styles.label}>{label}</Text>
    <Pressable style={styles.field} onPress={()=>{setQuery('');setOpen(true)}}>
      <Text style={value?styles.value:styles.placeholder}>{value||placeholder}</Text>
      <Text style={styles.chevron}>⌄</Text>
    </Pressable>

    <Modal visible={open} animationType="slide" presentationStyle="pageSheet" onRequestClose={()=>setOpen(false)}>
      <SafeAreaView style={styles.modal}>
        <View style={styles.modalHeader}>
          <View>
            <Text style={styles.modalEyebrow}>ESTACIONES</Text>
            <Text style={styles.modalTitle}>{label}</Text>
          </View>
          <Pressable onPress={()=>setOpen(false)} hitSlop={12}><Text style={styles.close}>Cerrar</Text></Pressable>
        </View>
        <TextInput
          autoFocus
          value={query}
          onChangeText={setQuery}
          placeholder="Buscar estación"
          placeholderTextColor={theme.colors.muted}
          style={styles.search}
        />
        <FlatList
          data={filtered}
          keyExtractor={item=>item}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.list}
          renderItem={({item})=><Pressable style={styles.option} onPress={()=>{onChange(item);setOpen(false)}}>
            <Text style={styles.optionText}>{item}</Text>
            <Text style={styles.arrow}>→</Text>
          </Pressable>}
          ListEmptyComponent={<Text style={styles.empty}>No encontramos estaciones con ese nombre.</Text>}
        />
      </SafeAreaView>
    </Modal>
  </>;
}

const styles=StyleSheet.create({
  label:{fontSize:13,fontWeight:'700',color:theme.colors.muted,marginBottom:8,marginTop:18},
  field:{minHeight:58,borderWidth:1,borderColor:theme.colors.border,borderRadius:theme.radius.md,backgroundColor:theme.colors.surface,paddingHorizontal:16,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},
  value:{fontSize:16,fontWeight:'700',color:theme.colors.text,flex:1},
  placeholder:{fontSize:16,color:theme.colors.muted,flex:1},
  chevron:{fontSize:22,color:theme.colors.muted},
  modal:{flex:1,backgroundColor:theme.colors.background},
  modalHeader:{paddingHorizontal:20,paddingTop:12,paddingBottom:16,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},
  modalEyebrow:{fontSize:11,fontWeight:'900',letterSpacing:1.4,color:theme.colors.accent},
  modalTitle:{fontSize:26,fontWeight:'900',color:theme.colors.text,marginTop:3},
  close:{fontSize:15,fontWeight:'800',color:theme.colors.accent},
  search:{marginHorizontal:20,borderWidth:1,borderColor:theme.colors.border,borderRadius:16,backgroundColor:theme.colors.surface,paddingHorizontal:16,paddingVertical:14,fontSize:16,color:theme.colors.text},
  list:{padding:20,paddingBottom:40},
  option:{paddingVertical:16,borderBottomWidth:1,borderBottomColor:theme.colors.border,flexDirection:'row',justifyContent:'space-between',alignItems:'center'},
  optionText:{fontSize:16,fontWeight:'700',color:theme.colors.text,flex:1,paddingRight:12},
  arrow:{fontSize:18,color:theme.colors.accent},
  empty:{paddingVertical:36,textAlign:'center',color:theme.colors.muted}
});
