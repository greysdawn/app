import { StyleSheet as SS } from 'react-native';
import React from 'react';
import {
	DrawerContentScrollView,
	DrawerItemList
} from '@react-navigation/drawer';
import { View, useWindowDimensions } from 'react-native';

export default function DrawerContent(props) {
	const { height, width } = useWindowDimensions();
	
	return (
		<DrawerContentScrollView {...props} style={styles.sv} >
			<View style={[styles.il, {height: height - 33}]}>
			<DrawerItemList {...props} drawerItemStyle={{
				backgroundColor: '#111',
				elevation: 3
			}}/>
			</View>
		</DrawerContentScrollView>
	);
}

const styles = SS.create({
	sv: {
		backgroundColor: '#111',
		padding: 10,
		paddingTop: 0,
		flex: 1
	},
	il: {
		backgroundColor: '#444',
		padding: 5,
		borderRadius: 5,
		flex: 1
	}
})