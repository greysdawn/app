import React, {
	useState,
	useRef,
	forwardRef,
	useImperativeHandle as uIH
} from 'react';

import { 
	StyleSheet as SS,
	View,
	Pressable,
	Animated,
} from 'react-native';

import {
	AntDesign, Octicons, SimpleLineIcons as SLI
} from '@expo/vector-icons';

export default FloatingActionButton = forwardRef((props, ref) => {
	var [open, sO] = useState(false);
	var hgt = useRef(new Animated.Value(0)).current;
	var opc = useRef(new Animated.Value(0)).current;
	var rotV = useRef(new Animated.Value(0)).current;

	function tog(e) {
		e.stopPropagation();
		if(!open) {
			show(e)
		} else {
			close(e)
		}
	}

	function show(e) {
		e.stopPropagation();
		sO(true);
		Animated.timing(hgt, {
			toValue: 100,
			duration: 250,
			useNativeDriver: false
		}).start()
		Animated.timing(opc, {
			toValue: 1,
			duration: 250,
			useNativeDriver: false
		}).start()

		Animated.timing(rotV, {
			toValue: 1,
			duration: 250,
			useNativeDriver: false
		}).start()
	}

	function close(e) {
		e.stopPropagation();
		Animated.timing(opc, {
			toValue: 0,
			duration: 250,
			useNativeDriver: false
		}).start()			
		Animated.timing(rotV, {
			toValue: 0,
			duration: 250,
			useNativeDriver: false
		}).start(({finished}) => {
			if(finished) sO(false)
		})
		Animated.timing(hgt, {
			toValue: 0,
			duration: 250,
			useNativeDriver: false
		}).start()
	}

	uIH(ref, () => ({show, close}));

	const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
	
	if(open) {
		return (
			<View style={[styles.fab, {overflow: 'hidden'}]}>
			<Animated.View style={{
				maxHeight: hgt,
				opacity: opc
			}}>
				{props.children}
			</Animated.View>
			<AnimatedPressable onPress={(e) => tog(e)}
				style={{
					transform: [{
						rotate: rotV.interpolate({
							inputRange: [0, 1],
							outputRange: ['0deg', '225deg']
						})
					}],
					borderRadius: 30
				}}
			>
				<AntDesign name='pluscircleo'
					style={[styles.icon]}
					size={60}
				/>
			</AnimatedPressable>
			</View>
		)
	}
	
	return (
		<Pressable style={styles.fab} onPress={(e) => tog(e)}>
			<AntDesign name='pluscircleo'
				style={[styles.icon]}
				size={60}
			/>
		</Pressable>
	)
})

const styles = SS.create({
	icon: {
		color: '#eee'
	},
	fab: {
		position: 'absolute',
		bottom: 65,
		right: 11,
		padding: 0,
		borderRadius: 20,
		elevation: 3
    }
});