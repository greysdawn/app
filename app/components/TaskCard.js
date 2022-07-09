import React from 'react';
import {
	Text,
	View,
	StyleSheet as SS
} from 'react-native';

export default function TaskCard(props) {
	var {m} = props;

	return (
		<View style={styles.body}>
		<Text style={{
			fontSize: 20,
			color: '#eee'
		}}>{m.title || "Untitled Task"}</Text>
		{m.content && (<Text style={{
			fontSize: 10,
			color: "#eee"
		}}>{m.content}</Text>)}
		</View>
	)
}

const styles = SS.create({
	body: {
		flex: 1,
		color: '#eee',
		backgroundColor: '#333',
		padding: 10,
		height: 45,
		borderRadius: 2,
		margin: 0,
		marginTop: 2,
		elevation: 1
	},
})