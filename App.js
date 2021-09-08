import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet as SS, Text, Pressable, View, useWindowDimensions } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { SimpleLineIcons as SLI, Octicons } from '@expo/vector-icons';

import Chat from './screens/Chat';
import DrawerContent from './components/Drawer';
import Header from './components/Header';
import BottomSheet from './components/BottomSheet';

const Drawer = createDrawerNavigator();

export default function App() {
	const { height, width } = useWindowDimensions();
	
	return (
		<SafeAreaProvider style={{
			backgroundColor: '#111'
		}}>
		<NavigationContainer>
		<Drawer.Navigator
			screenOptions={{
				drawerType: 'slide',
				drawerContainerStyle: { height: '100%' },
				drawerStyle: styles.drawer,
				drawerItemStyle: styles.item,
				drawerLabelStyle: styles.label,
				drawerActiveBackgroundColor: '#333',
				drawerInactiveBackgroundColor: '#0000',
				swipeEdgeWidth: width,
				swipeMinDistance: width / 2
				// header: (props) => (<CHeader {...props} />)
			}}
			initialRouteName="Chat"
			drawerContent={(props) => (<DrawerContent {...props} />)}
		>
		<Drawer.Screen name="Chat" options={{headerShown: false}} component={Chat} />
		<Drawer.Screen name="Test" options={{headerShown: false}} component={Test} />
		<Drawer.Screen name="Test2" options={{headerShown: false}} component={Test} />
		</Drawer.Navigator>
		<StatusBar style={"light"}/>
		</NavigationContainer>
		</SafeAreaProvider>
	);
}

function Test(props) {
	return (
		<View style={{
			backgroundColor: '#111',
			flex: 1,
			paddingTop: 28
		}}>
		<Header {...props} title={props.route.name} />
		<Text style={{color: 'white'}}>This is a test!</Text>
		<BottomSheet>
			<Text>TESTING</Text>
		</BottomSheet>
		</View>
	)
}

const styles = SS.create({
	drawer: {
		backgroundColor: '#333',
		width: '90%',
		color: '#eee',
		flex: 1,
		height: '100%'
	},
	item: {
		// backgroundColor: '#444'
	},
	label: {
		color: '#eee'
	}
})