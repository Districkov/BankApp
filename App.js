import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { AuthProvider } from './src/context/AuthContext';

// Main Screens
import Home from './src/screens/main/Home';
import Operations from './src/screens/main/Operations';
import WelcomeScreen from './src/screens/main/WelcomeScreen';

// Auth Screens
import TelegramAuthScreen from './src/screens/auth/TelegramAuthScreen';
import CodeInputScreen from './src/screens/auth/CodeInputScreen';
import SessionLimitScreen from './src/screens/auth/SessionLimitScreen';

// Transfers Screens
import Payments from './src/screens/transfers/Payments';
import TransfersScreen from './src/screens/transfers/TransfersScreen';
import TransferPhone from './src/screens/transfers/TransferPhone';

// Profile Screens
import More from './src/screens/profile/More';
import Settings from './src/screens/profile/Settings';
import PersonalData from './src/screens/profile/PersonalData';
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
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
            gestureEnabled: true
          }}
          initialRouteName="TelegramAuth"
        >
          {/* Auth Screens */}
          <Stack.Screen name="TelegramAuth" component={TelegramAuthScreen} />
          <Stack.Screen name="CodeInput" component={CodeInputScreen} />
          <Stack.Screen name="SessionLimit" component={SessionLimitScreen} />

          {/* Main App */}
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Main" component={Tabs} />
          <Stack.Screen name="Operations" component={Operations} />

          {/* Переводы и платежи */}
<<<<<<< HEAD
=======
          <Stack.Screen name="TransferCard" component={TransferCard} />
>>>>>>> 01403a62e3c3e10a942cd2afda1e6be28a8c0d3b
          <Stack.Screen name="TransferPhone" component={TransferPhone} />
          <Stack.Screen name="TransfersScreen" component={TransfersScreen} />

          {/* Профиль и настройки */}
          <Stack.Screen name="Settings" component={Settings} />
          <Stack.Screen name="PersonalData" component={PersonalData} />
          <Stack.Screen name="Support" component={Support} />

          {/* История операций */}
          <Stack.Screen name="TransactionHistory" component={TransactionHistory} />

          {/* Партнёры */}
          <Stack.Screen name="AstraDetail" component={AstraDetail} />
          <Stack.Screen name="YanimaDetail" component={YanimaDetail} />
          <Stack.Screen name="PartnersList" component={PartnersList} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}