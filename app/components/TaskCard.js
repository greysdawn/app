import React from 'react';
import {
	Text,
	View,
	StyleSheet as SS
} from 'react-native';

export default function TaskCard(props) {
	var {m, bottom} = props;

	var content = m.content;
	// if(m.content) {
	// 	if(m.content.length > 100)
	// 		content = m.content.slice(0, 100) + '...';
	// 	else content = m.content;
	// }
	return (
		<View style={{
			...styles.body,
			marginBottom: bottom ? 2 : 0
		}}>
		<Text style={{
			fontSize: 20,
			color: '#eee'
		}}>{m.title || "Untitled Task"}</Text>
		{content && (<Text style={{
			fontSize: 10,
			color: "#eee"
		}}>{content}</Text>)}
		</View>
	)
}

const styles = SS.create({
	body: {
		flex: 1,
		color: '#eee',
		backgroundColor: '#333',
		padding: 10,
		minHeight: 50,
		borderRadius: 5,
		margin: 5,
		marginBottom: 0,
		marginTop: 2,
		// marginTop: 5,
		// elevation: 1,
		justifyContent: 'center'
	},
})