import {
	Modal as Mod,
	Animated,
	Pressable,
	StyleSheet as SS,
	Text,
	View,
	TouchableOpacity
} from 'react-native';

import React, {
	useRef,
	useState
} from 'react';

export default function Modal(props) {
	var top = useRef(new Animated.Value(1000)).current;
	var opc = useRef(new Animated.Value(0)).current;
	
	function show() {
		Animated.timing(top, {
			toValue: 0,
			duration: 250,
			useNativeDriver: false
		}).start();

		Animated.timing(opc, {
			toValue: 1,
			duration: 250,
			useNativeDriver: false
		}).start();
	}

	function hide() {
		Animated.timing(opc, {
			toValue: 0,
			duration: 250,
			useNativeDriver: false
		}).start();
		
		Animated.timing(top, {
			toValue: 1000,
			duration: 250,
			useNativeDriver: false
		}).start(({finished}) => {
			if(finished) props.toggle()
		});
	}

	if(!props.vis) return null;
	return (
		<Mod
			animationType="none"
			transparent
			visible={props.vis}
			statusBarTranslucent
			onShow={() => show()}
			onRequestClose={() => {
				hide();
			}}
		>
			<Pressable onPress={() => hide()}>
			<Animated.View style={{
				alignItems: 'center',
				justifyContent: 'center',
				backgroundColor: '#000a',
				height: '100%',
				width: '100%',
				opacity: opc
			}}
			>
			<Pressable onPress={(e) => e.stopPropagation()}>
			<Animated.View style={{
				backgroundColor: '#111',
				padding: 10,
				borderRadius: 10,
				margin: 'auto',
				width: 'auto',
				alignItems: 'center',
				top: top,
				borderWidth: 2,
				borderColor: 'black'
			}}>
			<Text style={{color: '#eee'}}>Are you sure you want to clear everything?</Text>
			<View style={{
				flexDirection: 'row',
				alignItems: 'space-around'
			}}>
			<TouchableOpacity style={styles.btn} onPress={() => {hide(); props.clear();}}>
				<Text style={{color: '#eee'}}>Yes</Text>
			</TouchableOpacity>
			<TouchableOpacity style={styles.btn} onPress={() => {hide()}}>
				<Text style={{color: '#eee'}}>No</Text>
			</TouchableOpacity>
			</View>
			</Animated.View>
			</Pressable>
			</Animated.View>
			</Pressable>
		</Mod>
	)
}

const styles = SS.create({
  btn: {
  	width: '30%',
  	margin: 5,
  	marginBottom: 5,
  	backgroundColor: '#333',
  	color: '#eee',
  	padding: 10,
  	width: '30%',
  	borderRadius: 10,
  	alignItems: 'center'
  }
})