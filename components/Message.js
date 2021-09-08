import React, {useRef, useState} from 'react';
import { 
	StyleSheet,
	Text,
	TextInput,
	View,
	Pressable,
	Animated
} from 'react-native';
import Markdown from 'react-native-markdown-display';

export default function Message(props) {
	var {m, tm} = props;
	const hgt = useRef(new Animated.Value(0)).current;
	const opc = useRef(new Animated.Value(0)).current;
	const bottom = useRef(new Animated.Value(15)).current;
	
	var dt = new Date(m.sent);
	var sent = {
		day: `${pad(dt.getMonth() + 1)}/${pad(dt.getDay())}/${dt.getFullYear()}`,
		time: `${pad(dt.getHours())}:${pad(dt.getMinutes())}`
	}

	var edited;
	if(m.edited) {
		dt = new Date(m.edited);
		edited = {
			day: `${pad(dt.getMonth() + 1)}/${pad(dt.getDay())}/${dt.getFullYear()}`,
			time: `${pad(dt.getHours())}:${pad(dt.getMinutes())}`
		}
	}

	function pad(val) {
		return ('00'+val).slice(-2);
	}

	if(tm) {
		Animated.timing(hgt, {
			toValue: 15,
			duration: 250,
			useNativeDriver: false
		}).start();

		Animated.timing(opc, {
			toValue: 1,
			duration: 250,
			useNativeDriver: false
		}).start();

		Animated.timing(bottom, {
			toValue: 0,
			duration: 250,
			useNativeDriver: false
		}).start();
	} else {
		Animated.timing(hgt, {
			toValue: 0,
			duration: 250,
			useNativeDriver: false
		}).start();

		Animated.timing(opc, {
			toValue: 0,
			duration: 250,
			useNativeDriver: false
		}).start();

		Animated.timing(bottom, {
			toValue: 15,
			duration: 250,
			useNativeDriver: false
		}).start();
	}

	return (
		<>
		<Markdown style={tstyle}>
			{m.text + '&nbsp;'}
		</Markdown>
		<Animated.Text style={[
			styles.tcon,
			{
				height: hgt,
				opacity: opc,
				bottom,
				elevation: 0
			}
		]}>
			Sent: {sent.day} at {sent.time} {edited && `| Last edited: ${edited.day} at ${edited.time}`}
		</Animated.Text>
		</>
	)
}

const styles = StyleSheet.create({
	tcon: {
		fontSize: 10,
		color: '#eee',
		marginLeft: 10
	}
})

const tstyle = {
	body: {
		flexShrink: 0,
		color: '#eee',
		width: '100%',
		maxWidth: '100%',
		backgroundColor: '#333',
		padding: 5,
		borderRadius: 5,
		marginTop: 5,
		marginBottom: 5,
		elevation: 1
	},
	blockquote: {
		backgroundColor: '#ca51',
		borderColor: '#ccaa55'
	}
}