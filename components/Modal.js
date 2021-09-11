import {
	Modal as Mod,
	Animated,
	Pressable,
	StyleSheet as SS,
} from 'react-native';

import React, {
	useRef,
	useState,
	forwardRef,
	useImperativeHandle as uIH
} from 'react';

const Modal = forwardRef((props, ref) => {
	const [open, setOpen] = useState(props.vis ?? false);

	var top = useRef(new Animated.Value(1000)).current;
	var opc = useRef(new Animated.Value(0)).current;
	
	function show() {
		setOpen(true)
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
			if(finished) {
				setOpen(false);
			}
		});
	}

	uIH(ref, () => ({show, hide}));

	if(!open) return null;
	return (
		<Mod
			animationType="none"
			transparent
			visible={open}
			statusBarTranslucent
			onShow={() => show()}
			onRequestClose={() => {
				hide();
			}}
		>
			<Pressable onPress={() => hide()}>
			<Animated.View style={[styles.pView, { opacity: opc }]}
			>
			<Pressable onPress={(e) => e.stopPropagation()}>
			<Animated.View style={[styles.cView, { top }]}>
			{props.children}
			</Animated.View>
			</Pressable>
			</Animated.View>
			</Pressable>
		</Mod>
	)
})

export default Modal;

const styles = SS.create({
	pView: {
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#000a',
		height: '100%',
		width: '100%',
	},
	cView: {
		backgroundColor: '#111',
		padding: 10,
		borderRadius: 10,
		margin: 'auto',
		width: 'auto',
		alignItems: 'center',
		borderWidth: 2,
		borderColor: 'black'
	}
})