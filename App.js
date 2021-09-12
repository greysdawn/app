import React from 'react';
import {
	StyleSheet as SS,
	Text,
	View,
	useWindowDimensions,
	StatusBar as SB
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

import Notes from './screens/Notes';
import Note from './screens/Note';
import DrawerContent from './components/Drawer';
import Header from './components/Header';
import BottomSheet from './components/BottomSheet';

import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:8080';

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

export default function App() {
	const { height, width } = useWindowDimensions();
	
	return (
		<SafeAreaProvider style={{
			backgroundColor: '#111'
		}}>
		<NavigationContainer theme={{ colors: { background: '#111' } }}>
		<Drawer.Navigator
			screenOptions={{
				drawerType: 'slide',
				drawerContainerStyle: { height },
				drawerStyle: [styles.drawer, { height }],
				drawerLabelStyle: styles.label,
				drawerActiveBackgroundColor: '#333',
				drawerInactiveBackgroundColor: '#0000',
				swipeEdgeWidth: width,
				swipeMinDistance: width / 2
			}}
			initialRouteName="Notes"
			drawerContent={(props) => (<DrawerContent {...props} />)}
		>
		<Drawer.Screen name="Notes" options={{headerShown: false}} component={NoteNav} />
		<Drawer.Screen name="Test" options={{headerShown: false}} component={Test} />
		<Drawer.Screen name="Test2" options={{headerShown: false}} component={Test} />
		</Drawer.Navigator>
		<SB barStyle={"light-content"} translucent={true}/>
		</NavigationContainer>
		</SafeAreaProvider>
	);
}

function Test(props) {
	return (
		<View style={{
			backgroundColor: '#111',
			flex: 1,
			paddingTop: SB.currentHeight
		}}>
		<Header {...props} title={props.route.name} />
		<Text style={{color: 'white'}}>This is a test!</Text>
		<BottomSheet>
			<Text>TESTING</Text>
		</BottomSheet>
		</View>
	)
}

function NoteNav() {
	return (
		<Stack.Navigator
			initialRouteName="NoteList"
			screenOptions={{
				// presentation:"modal",
				animation: "slide_from_right"
			}}
		>
		<Stack.Group>
			<Stack.Screen name="NoteList" options={{headerShown: false}} component={Notes} />
			<Stack.Screen name="Note"
			options={{
				headerShown: false
			}} component={Note} />
		</Stack.Group>
		</Stack.Navigator>
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
	label: {
		color: '#eee'
	}
})