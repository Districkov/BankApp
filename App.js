import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

// Main Screens
import SimpleLoader from './src/screens/main/SimpleLoader';
import SuccessScreen from './src/screens/main/SuccessScreen';
import Home from './src/screens/main/Home';
import Operations from './src/screens/main/Operations';

// Cards Screens
import CardsList from './src/screens/cards/CardsList';
import BlackCardScreen from './src/screens/cards/BlackCardScreen';
import PlatinumCardScreen from './src/screens/cards/PlatinumCardScreen';

// Transfers Screens
import Payments from './src/screens/transfers/Payments';
import TransfersScreen from './src/screens/transfers/TransfersScreen';
import TransferCard from './src/screens/transfers/TransferCard';
import TransferPhone from './src/screens/transfers/TransferPhone';
import TopUpScreen from './src/screens/transfers/TopUpScreen';
import QRPay from './src/screens/transfers/QRPay';

// Profile Screens
import More from './src/screens/profile/More';
import Settings from './src/screens/profile/Settings';
import PersonalData from './src/screens/profile/PersonalData';
import Notifications from './src/screens/profile/Notifications';
import Support from './src/screens/profile/Support';

// History Screens
import TransactionHistory from './src/screens/history/TransactionHistory';

// Partners Screens
import PartnersList from './src/screens/partners/PartnersList';
import AstraDetail from './src/screens/partners/AstraDetail';
import YanimaDetail from './src/screens/partners/YanimaDetail';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function Tabs() {
  return (
    <Tab.Navigator 
      screenOptions={({ route })=>({ 
        headerShown: false, 
        tabBarStyle: { 
          height: 72, 
          paddingBottom: 10,
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#E5E5E5'
        }, 
        tabBarActiveTintColor: '#6A2EE8',
        tabBarInactiveTintColor: '#666',
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={Home} 
        options={{ 
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color}/>
          ),
          title: 'Главная',
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '500',
          }
        }} 
      />
      <Tab.Screen 
        name="Payments" 
        component={Payments} 
        options={{ 
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="credit-card-outline" size={size} color={color}/>
          ),
          title: 'Платежи',
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '500',
          }
        }} 
      />
      <Tab.Screen 
        name="More" 
        component={More} 
        options={{ 
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="ellipsis-horizontal-circle-outline" size={size} color={color}/>
          ),
          title: 'Ещё',
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '500',
          }
        }} 
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        screenOptions={{ 
          headerShown: false,
          animation: 'slide_from_right',
          gestureEnabled: true
        }} 
        initialRouteName="Loader"
      >
        <Stack.Screen name="Loader" component={SimpleLoader} />
        <Stack.Screen name="Success" component={SuccessScreen} />
        <Stack.Screen name="Main" component={Tabs} />
        
        {/* Основные экраны */}
        <Stack.Screen name="Operations" component={Operations} />
        
        {/* Карты */}
        <Stack.Screen name="CardDetail" component={BlackCardScreen} />
        <Stack.Screen name="PlatinumCard" component={PlatinumCardScreen} />
        <Stack.Screen name="CardsList" component={CardsList} />
        
        {/* Переводы и платежи */}
        <Stack.Screen name="TopUp" component={TopUpScreen} />
        <Stack.Screen name="TransferCard" component={TransferCard} />
        <Stack.Screen name="TransferPhone" component={TransferPhone} />
        <Stack.Screen name="QRPay" component={QRPay} />
        <Stack.Screen name="TransfersScreen" component={TransfersScreen} />
        
        {/* Профиль и настройки */}
        <Stack.Screen name="Settings" component={Settings} />
        <Stack.Screen name="PersonalData" component={PersonalData} />
        <Stack.Screen name="Support" component={Support} />
        <Stack.Screen name="Notifications" component={Notifications} />
        
        {/* История операций */}
        <Stack.Screen name="TransactionHistory" component={TransactionHistory} />
        
        {/* Партнёры */}
        <Stack.Screen name="AstraDetail" component={AstraDetail} />
        <Stack.Screen name="YanimaDetail" component={YanimaDetail} />
        <Stack.Screen name="PartnersList" component={PartnersList} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}