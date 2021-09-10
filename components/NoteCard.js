import React, {useRef, useState} from 'react';
import {
	Text,
	View,
	StyleSheet as SS
} from 'react-native';
import Markdown from 'react-native-markdown-display';

export default function NoteCard(props) {
	var {m} = props;

	return (
		<View style={styles.body}>
		<Text style={{
			fontSize: 20,
			color: '#eee'
		}}>{m.title || "Untitled Note"}</Text>
		</View>
	)
}

const styles = SS.create({
	body: {
		flexShrink: 0,
		color: '#eee',
		backgroundColor: '#333',
		padding: 10,
		height: 45,
		borderRadius: 2,
		margin: 0,
		marginTop: 2,
		elevation: 1
	},
	// blockquote: {
		// backgroundColor: '#ca51',
		// borderColor: '#ccaa55'
	// }
})