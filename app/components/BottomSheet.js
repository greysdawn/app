import {
	Animated,
	Pressable,
	StyleSheet as SS,
	View,
	PanResponder,
	useWindowDimensions,
	StatusBar
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
	const [hgt, setHgt] = useState(0);
	const hgtRef = useRef();

	useEffect(() => { hgtRef.current = hgt; }, [hgt]);

	const min = 0;
	const sheet = useRef(null);
	var [open, sO] = useState(props.open ?? false);

	const pan = useRef(new Animated.ValueXY({x: 0, y: height})).current;
	const prev = useRef(new Animated.ValueXY({x: 0, y: height})).current;

	function move(e, gS) {
		var val = prev.y._value + gS.dy;
		var capped = Math.min(Math.max(val, min), hgtRef.current)
		
		pan.setValue({x: 0, y: capped})
	}

	function end(e, gS) {
		var val = prev.y._value + gS.dy;
		var capped = Math.min(Math.max(val, min), hgtRef.current)

		if(capped < hgtRef.current * .5) {
			prev.setValue({x: 0, y: 0});
			show();
		} else {
			prev.setValue({x: 0, y: hgtRef.current});
			hide();
		}
	}

	const panResp = useRef(PanResponder.create({
		onMoveShouldSetPanResponder: (e, gS) => Math.abs(gS.dy) > 20,
		onPanResponderMove: move,
		onPanResponderEnd: end
	})).current;

	function show() {
		sO(true);
		Animated.timing(pan, {
			toValue: {x: 0, y: 0},
			duration: 150,
			useNativeDriver: false
		}).start(() => {
			prev.setValue({x: 0, y: 0})
		})
	}

	function hide() {
		Animated.timing(pan, {
			toValue: {x: 0, y: hgtRef.current},
			duration: 150,
			useNativeDriver: false
		}).start(() => {
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
					top: pan.y,
					width,
					alignItems: 'center',
					overflow: "hidden"
				}
			]}
			{...panResp.panHandlers}
			onLayout={(e) => {
				var {height: h} = e.nativeEvent.layout;
				setHgt((cur) => h);
			}}
		>
		{props.children}
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
		bottom: 0,
		borderTopLeftRadius: 10,
		borderTopRightRadius: 10,
	}
})