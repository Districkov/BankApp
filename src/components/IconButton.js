import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';

export default function IconButton({icon, label, onPress, style}) {
  return (
    <TouchableOpacity style={[styles.btn, style]} onPress={onPress}>
      <View style={styles.circle}>{icon}</View>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  btn: { alignItems:'center', width:80 },
  circle: { width:56, height:56, borderRadius:28, backgroundColor:'#F0EEFD', alignItems:'center', justifyContent:'center' },
  label: { marginTop:8, fontSize:12, textAlign:'center' }
});