import React, {
	useState,
	useRef,
	useEffect
} from 'react';

import { 
	StyleSheet as SS,
	TextInput,
	View,
	Pressable
} from 'react-native';

import {
	AntDesign
} from '@expo/vector-icons';

export default function Input(props) {
	return (
		<View style={{
			width: '100%',
			flex: 0,
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'center',
			borderWidth: 1,
			borderColor: '#eee',
			borderRadius: 5,
			padding: 5
		}} >
			<TextInput
				style={styles.input}
				placeholder='text here'
				placeholderTextColor={'#aaa'}
				onChangeText={setText}
				value={text}
				multiline
			/>
			<Pressable
				onPress={() => editing ? setEdit() : addMsg()}
			>
			<AntDesign name={editing ? 'checkcircleo' : 'rightcircleo'}
				style={styles.icon}
				size={40}
			/>
			</Pressable>
			{editing && (
				<Pressable onPress={() => cancelEdit()}>
				<AntDesign name='closecircleo'
					style={styles.icon}
					size={40}
				/>
				</Pressable>
			)}
		</View>
	)
}

const styles = SS.create({
  input: {
  	width: '70%',
  	color: '#eee',
  	borderWidth: 0,
  	flexGrow: 0,
  	maxHeight: 80
  },
  icon: {
  	color: '#eee'
  },
})