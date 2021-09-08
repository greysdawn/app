import {
	Animated,
	Pressable,
	StyleSheet as SS,
	Text,
	View,
	TouchableOpacity,
	PanResponder,
	useWindowDimensions,
	StatusBar,
	ScrollView
} from 'react-native';

import React, {
	forwardRef,
	useImperativeHandle as uIH,
	useRef,
	useState,
	useEffect
} from 'react';

const BottomSheet = forwardRef((props, ref) => {
	const {height, width} = useWindowDimensions();
	const hgt = height / 4;
	const min = 100;
	const sheet = useRef(null);
	var [open, sO] = useState(props.open ?? true);

	const pan = useRef(new Animated.ValueXY({x: 0, y: 0})).current;
	const prev = useRef(new Animated.ValueXY({x: 0, y: 0})).current;

	const panResp = useRef(PanResponder.create({
		onMoveShouldSetPanResponder: (e, gS) => Math.abs(gS.dy) > 20,
		onPanResponderMove: (e, gS) => {
			var val = prev.y._value - gS.dy;
			var capped = Math.min(Math.max(val, min), hgt)
			
			pan.setValue({x: 0, y: capped})
		},
		onPanResponderEnd: (e, gS) => {
			var val = prev.y._value - gS.dy;
			var capped = Math.min(Math.max(val, min), hgt)
			
			prev.setValue({x: 0, y: capped})
		}
	})).current;

	function show() {
		sO(true);
		Animated.timing(pan, {
			toValue: {x: 0, y: hgt},
			duration: 100,
			useNativeDriver: false
		}).start(({finished}) => {
			prev.setValue({x: 0, y: hgt})
		})
	}

	function hide() {
		Animated.timing(pan, {
			toValue: {x: 0, y: 0},
			duration: 100,
			useNativeDriver: false
		}).start(({finished}) => {
			prev.setValue({x: 0, y: prev.y._value});
			sO(false)
		})
	}

	uIH(ref, () => ({show, hide}));

	if(!open) return null;
	return (
		<View style={{
			height,
			position: 'absolute',
			elevation: 3,
			marginTop: StatusBar.currentHeight,
			backgroundColor: '#000a',
			justifyContent: 'flex-end',
			flex: 1,
			flexDirection: 'column-reverse',
			bottom: 0
		}}>
		<Pressable onPress={(e)=>{
			e.stopPropagation();
			hide()
		}} style={{
			flex: 1,
			justifyContent: 'flex-end',
		}}>
		<Animated.View
			ref={sheet}
			style={[
				styles.container,
				{
					// top: pan.y,
					maxHeight: pan.y,
					height: hgt,
					width,
					alignItems: 'center',
					overflow: "hidden"
				}
			]}
			{...panResp.panHandlers}
		>
		<Pressable onPress={(e)=>{
			e.stopPropagation();
		}} style={{
			flex: 1,
			flexDirection: 'column',
			alignItems: 'center',
			width
		}}>
		{props.children}
		</Pressable>
		</Animated.View>
		</Pressable>
		</View>
	)
})

export default BottomSheet;

const styles = SS.create({
	container: {
		backgroundColor: '#333',
		elevation: 3,
		bottom: 0
	}
})