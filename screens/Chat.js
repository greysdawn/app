import React, {
	useState,
	useRef,
	useEffect
} from 'react';

import { 
	StyleSheet,
	Text,
	TextInput,
	View,
	Pressable,
	FlatList,
	ToastAndroid,
	Button,
	TouchableOpacity,
	Animated,
	useWindowDimensions,
	ScrollView,
	TouchableHighlight,
	Easing
} from 'react-native';

import {
	AntDesign, Octicons, SimpleLineIcons as SLI
} from '@expo/vector-icons';

import Message from '../components/Message';
import Modal from '../components/Modal';
import Header from '../components/Header';
import BottomSheet from '../components/BottomSheet';
import axios from 'axios';

const axinst = new axios.create({
	baseURL: 'http://localhost:8080'
})

export default function Chat(props) {
	const { height, width } = useWindowDimensions();
	
	var [text, setText] = useState(null);
	var [list, setList] = useState([]);
	var [editing, setEditing] = useState(false);
	var [cedit, sCed] = useState(null);
	var [tm, sTm] = useState(null);
	var [fetched, sF] = useState(false);
	var [mod, sMod] = useState(false);
	var [bs, sBs] = useState(false);

	var fl = useRef();
	var BS = useRef();
	var [refr, sRefr] = useState(false);

	useEffect(() => {
		if(!fetched) {
			refetch();
			sF(true);
		}
	})

	async function refetch() {
		sRefr(true);
		fl.current.scrollToEnd()
		var d = await axinst.get('/api/msgs');
		setList(d.data.map(t => {
			return {
				key: t.id.toString(),
				text: t.content,
				sent: t.sent,
				edited: t.edited
			}
		}));
		sRefr(false);
		fl.current.scrollToEnd()
	}
	
	async function addMsg() {
		if(!text) return;
		var l = list;
		try {
			var rq = await axinst.post('/api/msg', {text: text.trim()})
		} catch(e) {
			console.log(e)
		}
		console.log(rq.data)

		l.push({
			key: rq.data.id,
			text: rq.data.content,
			sent: rq.data.sent
		});
		setList(l);
		setText(null);
		fl.current.scrollToEnd()
	}

	async function del(ind) {
		var k = list[ind].key;
		var rq = await axinst.delete('/api/msg/'+k);
		var l = list.filter(x => x.key != k);
		setList(l)
		BS?.current?.hide();
	}

	async function clear() {
		setEditing(false);
		sCed(null);
		setText(null)
		setList([]);
		await axinst.delete('/api/msgs');
	}

	function callBS(ind) {
		sCed(ind)
		BS?.current?.show();
	}

	function startEdit(ind) {
		setText(list[ind].text);
		setEditing(true);
		BS?.current?.hide();
	}

	async function setEdit() {
		var rq = await axinst.patch('/api/msg/'+list[cedit].key, {
			text
		});
		console.log(rq)
		var i = {
			text: rq.data.content,
			key: rq.data.id.toString(),
			...rq.data
		}
		list[cedit] = i;
		setList(list);
		setText(null);
		setEditing(false);
		sCed(null);
	}

	function cancelEdit() {
		setText(null);
		setEditing(false);
		sCed(null);
	}

	function setTime(ind) {
		if(ind == tm) sTm(null)
		else sTm(ind)
	}

	function toggleModal() {
		sMod(!mod)
	}

	function toggleBS(val) {
		sBs(val ?? !bs)
	}
	
	return (
		<View style={styles.container}>	
			<Header 
				title="Chat"
				navigation={props.navigation}
				headerRight={(props) => (<DBtn {...props} toggle={toggleModal}/>)}
			/>
			<Modal clear={clear} vis={mod} toggle={toggleModal}/>
			<FlatList
				contentContainerStyle={{
					alignItems: 'stretch'
				}}
				style={styles.list}
				data={list}
				renderItem={({item, index}) => {
					return (
						<Pressable onLongPress={() => callBS(index)}
							onPress={() => setTime(index)}>
							<Message m={item} i={index} tm={tm == index}/>
						</Pressable>
					)
				}}
				ref={fl}
				onRefresh={() => refetch()}
				refreshing={refr}
				keyboardShouldPersistTaps="always"
			/>
			<FAB />
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
			<BottomSheet open={bs} toggle={toggleBS} ref={BS}>
				<TouchableHighlight onPress={() => {
					startEdit(cedit)
				}} underlayColor='#444'>
				<View style={[styles.bsBtns, {width}]}>
				<AntDesign name='edit' size={20} style={{
					color: '#eee',
					marginRight: 5
				}} />
				<Text style={{color: '#eee'}}>Edit</Text>
				</View>
				</TouchableHighlight>
				<TouchableHighlight onPress={() => {
					del(cedit)
				}} underlayColor='#444'>
				<View style={[styles.bsBtns, {width}]}>
				<Octicons name='trashcan' size={20} style={{
					color: '#eee',
					marginRight: 5
				}} />
				<Text style={{color: '#eee'}}>Delete</Text>
				</View>
				</TouchableHighlight>
			</BottomSheet>
		</View>
	)
}

function DBtn(props) {
	return (
		<Pressable onPress={() => props.toggle()}>
			<Octicons name='trashcan' size={20} style={{
				marginRight: 10,
				color: '#eee',
			}} />
		</Pressable>
	)
}

function FAB(props) {
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
				useNativeDriver: false,
				// easing: Easing.bezier(0.5, -0.5, 0.5, 1.5)
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
				useNativeDriver: false,
				// easing: Easing.bezier(0.5, -0.5, 0.5, 1.5)
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

	// const rot =

	const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
	
	if(open) {
		// console.log("rotation", rot)
		return (
			<View style={[styles.fab, {overflow: 'hidden'}]}>
			<Animated.View style={{
				maxHeight: hgt,
				opacity: opc,
				// overflow: 'hidden'
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

const styles = StyleSheet.create({
  container: {
  	flex: 1,
    backgroundColor: '#111',
    color: '#eee',
    padding: 5,
    paddingTop: 28
  },
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
  list: {
  	width: '100%',
  	paddingBottom: 40
  },
  fab: {
  	position: 'absolute',
  	bottom: 80,
  	right: 11,
  	backgroundColor: '#a5a',
  	padding: 0,
  	borderRadius: 20,
  	elevation: 3
  },
  bsBtns: {
	width: '100%',
	padding: 10,
	paddingTop: 20,
	paddingBottom: 20,
	flexDirection: 'row',
	justifyContent: 'flex-start',
	alignItems: 'center'
  }
});

