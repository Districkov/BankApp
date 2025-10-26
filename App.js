import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

// Screens
import SimpleLoader from './src/screens/SimpleLoader';
import SuccessScreen from './src/screens/SuccessScreen';
import Home from './src/screens/Home';
import Payments from './src/screens/Payments';
import More from './src/screens/More';
import Operations from './src/screens/Operations';
import CardDetail from './src/screens/BlackCardScreen';
import TopUp from './src/screens/TopUpScreen';
import TransferPhone from './src/screens/TransferPhone';
import QRPay from './src/screens/QRPay';
import TransferCard from './src/screens/TransferCard';
import TransfersScreen from './src/screens/TransfersScreen';
import PlatinumCard from './src/screens/PlatinumCardScreen';
import Settings from './src/screens/Settings';
import CardsList from './src/screens/CardsList';
import TransactionHistory from './src/screens/TransactionHistory';
import Support from './src/screens/Support';
import Notifications from './src/screens/Notifications';
import PersonalData from './src/screens/PersonalData';

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
        {/* Loader Screen - показывается первым */}
        <Stack.Screen 
          name="Loader" 
          component={SimpleLoader}
          options={{
            gestureEnabled: false
          }}
        />
        
        {/* Success Screen */}
        <Stack.Screen 
          name="Success" 
          component={SuccessScreen}
          options={{
            gestureEnabled: false,
            presentation: 'transparentModal'
          }}
        />
        
        {/* Main App Navigation */}
        <Stack.Screen 
          name="Main" 
          component={Tabs}
          options={{
            gestureEnabled: false
          }}
        />
        
        {/* Operations & Analytics */}
        <Stack.Screen 
          name="Operations" 
          component={Operations} 
        />
        
        {/* Cards & Details */}
        <Stack.Screen 
          name="CardDetail" 
          component={CardDetail} 
        />
        <Stack.Screen 
          name="PlatinumCard" 
          component={PlatinumCard} 
        />
        
        {/* Transfers & Payments */}
        <Stack.Screen 
          name="TopUp" 
          component={TopUp} 
        />
        <Stack.Screen 
          name="TransferCard" 
          component={TransferCard}
        />
        <Stack.Screen 
          name="TransferPhone" 
          component={TransferPhone}
        />
        <Stack.Screen 
          name="QRPay" 
          component={QRPay}
        />
        <Stack.Screen 
          name="TransfersScreen" 
          component={TransfersScreen}
        />
        
        {/* Settings & Profile */}
        <Stack.Screen 
          name="Settings" 
          component={Settings} 
        />
        <Stack.Screen 
          name="PersonalData" 
          component={PersonalData} 
        />
        <Stack.Screen 
          name="CardsList" 
          component={CardsList} 
        />
        <Stack.Screen 
          name="TransactionHistory" 
          component={TransactionHistory} 
        />
        <Stack.Screen 
          name="Support" 
          component={Support} 
        />
        <Stack.Screen 
          name="Notifications" 
          component={Notifications} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}