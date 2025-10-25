import React from 'react';
import { View, StyleSheet } from 'react-native';
export default function Card({children, style}){
  return <View style={[styles.card, style]}>{children}</View>;
}
const styles = StyleSheet.create({
  card:{backgroundColor:'#fff', borderRadius:14, padding:12, shadowColor:'#000', shadowOpacity:0.03, shadowOffset:{width:0,height:2}, elevation:2}
});