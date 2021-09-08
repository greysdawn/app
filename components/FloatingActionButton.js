import React, {
	useState,
	useRef
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

export default function FloatingActionButton(props) {
	var [open, sO] = useState(false);
	var hgt = useRef(new Animated.Value(0)).current;
	var opc = useRef(new Animated.Value(0)).current;
	var rotV = useRef(new Animated.Value(0)).current;

	function tog(e) {
		e.stopPropagation();
		if(!open) {
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
		} else {
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
			
	}

	const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
	
	if(open) {
		return (
			<View style={[styles.fab, {overflow: 'hidden'}]}>
			<Animated.View style={{
				maxHeight: hgt,
				opacity: opc
			}}>
				<Pressable>
				<AntDesign name='closecircleo'
					style={[styles.icon, {marginBottom: 5}]}
					size={40}
				/>
				</Pressable>
				<Pressable>
				<AntDesign name='checkcircleo'
					style={[styles.icon, {marginBottom: 5}]}
					size={40}
				/>
				</Pressable>
			</Animated.View>
			<AnimatedPressable onPress={(e) => tog(e)}
				style={{
					transform: [{
						rotate: rotV.interpolate({
							inputRange: [0, 1],
							outputRange: ['0deg', '225deg']
						})
					}],
					backgroundColor: '#a5a',
					borderRadius: 20
				}}
			>
				<AntDesign name='pluscircleo'
					style={[styles.icon]}
					size={40}
				/>
			</AnimatedPressable>
			</View>
		)
	}
	
	return (
		<Pressable style={styles.fab} onPress={(e) => tog(e)}>
			<AntDesign name='pluscircleo'
				style={[styles.icon]}
				size={40}
			/>
		</Pressable>
	)
}

const styles = SS.create({
	icon: {
		color: '#eee'
	},
	fab: {
		position: 'absolute',
		bottom: 80,
		right: 11,
		backgroundColor: '#a5a',
		padding: 0,
		borderRadius: 20,
		elevation: 3
  }
});