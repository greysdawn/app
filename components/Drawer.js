import {
	StyleSheet as SS,
	StatusBar,
	ScrollView
} from 'react-native';
import React from 'react';
import {
	DrawerContentScrollView,
	DrawerItemList
} from '@react-navigation/drawer';
import { View, useWindowDimensions } from 'react-native';

export default function DrawerContent(props) {
	const { height, width } = useWindowDimensions();
	
	return (
		<ScrollView {...props} style={[
			styles.sv
		]} >
			<View style={[styles.il, {
				height: height - 33,
				margin: 0,
				padding: 5
			}]}>
			<DrawerItemList {...props} drawerItemStyle={{
				backgroundColor: '#111',
				elevation: 3,
			}}/>
			</View>
		</ScrollView>
	);
}

const styles = SS.create({
	sv: {
		backgroundColor: '#000',
		padding: 10,
		paddingTop: StatusBar.currentHeight,
		flex: 1
	},
	il: {
		backgroundColor: '#444',
		padding: 5,
		borderRadius: 5,
		flex: 1
	}
})