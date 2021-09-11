import React from 'react';
import { 
	StyleSheet as SS,
	Text,
	View,
	Pressable,
} from 'react-native';

import {
	AntDesign, SimpleLineIcons as SLI
} from '@expo/vector-icons';

export default function Header(props) {
	const {navigation, title, shown} = props;

	if(shown === false) return null;
	return (
		<View
			elevation={3}
			navigation={navigation}
			style={styles.header}
			{...props}
		>
		<HBtn {...props} navigation={navigation} />
		<Text style={styles.hText}>{title}</Text>
		{props.children}
		</View>
	)
}

function HBtn(props) {
	const {
		navigation,
		buttonType:type,
		size,
		onBack
	} = props;
	if(type == "back") {
		return (
			<Pressable onPress={() => {
				if(onBack) {
					onBack().then(() => navigation.goBack());
				} else navigation.goBack();
			}}>
				<AntDesign name='arrowleft' size={size ?? 20} style={{
					color: '#eee',
					margin: 5,
					marginLeft: 10
				}} />
			</Pressable>
		)
	} else {
		return (
			<Pressable onPress={() => navigation.toggleDrawer()}>
				<SLI name='menu' size={size ?? 20} style={{
					color: '#eee',
					margin: 5,
					marginLeft: 10
				}} />
			</Pressable>
		)
	}
}

const styles = SS.create({
  header: {
	backgroundColor: '#444',
	elevation: 3,
	borderTopLeftRadius: 5,
	borderTopRightRadius: 5,
	height: 80-28,
	flexDirection: 'row',
	alignItems: 'center',
	margin: 0,
	width: '100%'
  },
  hText: {
	color: '#eee',
	fontSize: 20
  },
})