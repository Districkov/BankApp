import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
export default function Header({name, onPress}){
  return (
    <View style={s.header}>
      <TouchableOpacity onPress={onPress} style={{paddingVertical:8}}>
        <Text style={s.name}>{name}</Text>
      </TouchableOpacity>
      <View style={s.sep}/>
    </View>
  );
}
const s = StyleSheet.create({
  header:{paddingTop:18,paddingHorizontal:16,backgroundColor:'#F7F7FB'},
  name:{fontSize:28,fontWeight:'800',color:'#0B0B0B'},
  sep:{height:12}
});