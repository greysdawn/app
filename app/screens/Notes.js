import React, {
	useState,
	useRef,
	useEffect
} from 'react';

import { 
	StyleSheet,
	Text,
	View,
	Pressable,
	FlatList,
	TouchableOpacity,
	useWindowDimensions,
	TouchableHighlight,
	StatusBar
} from 'react-native';

import {
	AntDesign, Octicons,
	MaterialIcons as MI, FontAwesome5 as FA5
} from '@expo/vector-icons';

import NoteCard from '../components/NoteCard';
import Modal from '../components/Modal';
import Header from '../components/Header';
import BottomSheet from '../components/BottomSheet';
import FAM from '../components/FloatingActionMenu';
import axios from 'axios';

export default function Notes(props) {
	const { width } = useWindowDimensions();
	const { navigation } = props;

	var [list, setList] = useState([]);
	var [cedit, sCed] = 	useState(null);
	var [sel, sSel] = 		useState(null)
	var [refr, sRefr] = 	useState(false);

	var fl = 		useRef();
	var BS = 		useRef();
	var Mod = 	useRef();
	var fab = 	useRef();

	useEffect(() => {
		const unsubscribe = navigation.addListener('focus', () => {
			refetch()
		});

		return unsubscribe;
	}, [navigation])

	async function refetch() {
		sRefr(true);
		var d = await axios.get('/api/notes');
		setList(d.data);
		sRefr(false);
	}

	async function del(ind) {
		var k = list[ind].hid;
		await axios.delete('/api/note/'+k);
		refetch()
		BS?.current?.hide();
	}

	async function clear() {
		sCed(null);
		setList([]);
		await axios.delete('/api/notes');
	}

	function callBS(ind) {
		sCed(ind)
		BS?.current?.show();
	}

	function callMod() {
		Mod?.current?.show();
	}

	function hideMod() {
		Mod?.current?.hide();
	}

	function startEdit(ind) {
		navigation.navigate("Note", {
			note: list[ind].hid
		})
		BS?.current?.hide();
	}

	function startSelect(ind) {
		sSel([ind]);
		BS?.current?.hide();
	}

	function addSelect(ind) {
		var s = Object.assign([], sel);
		s.push(ind);
		sSel(s)
	}

	function removeSelect(ind) {
		var s = sel;
		s = s.filter(x => x !== ind);
		if(s.length == 0) sSel(null);
		else sSel(s);
	}

	function clearSelect() {
		sSel(null);
	}

	async function delSelected() {
		await axios.delete('/api/notes/mass', {
			data: [sel.map(s => list[s].hid)]
		});

		sSel(null);
		refetch();
	}
	
	return (
		<View style={styles.container}>	
			<Header 
				title="Notes"
				navigation={props.navigation}
			>
				<DBtn show={callMod}/>
				{sel && (
					<Pressable onPress={() => clearSelect()}>
					<MI name="cancel" size={20} style={{color: '#eee', marginLeft: 5, marginRight: 5}} />
					</Pressable>
				)}
			</Header>
			<Modal ref={Mod}>
				{sel && (<Text style={{color: '#eee'}}>Are you sure you want to delete the selected note(s)?</Text>)}
				{(!sel && cedit !== null) && (<Text style={{color: '#eee'}}>Are you sure you want to delete this note?</Text>)}
				{(!sel && cedit == null) && (<Text style={{color: '#eee'}}>Are you sure you want to delete everything?</Text>)}
				<View style={{
					flexDirection: 'row',
					alignItems: 'space-around'
				}}>
				<TouchableOpacity style={styles.btn} onPress={() => {
						hideMod();
						if(sel) delSelected();
						else if(cedit !== null) del(cedit);
						else clear();
				}}>
					<Text style={{color: '#eee'}}>Yes</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.btn} onPress={() => {hideMod()}}>
					<Text style={{color: '#eee'}}>No</Text>
				</TouchableOpacity>
				</View>
			</Modal>
			<FlatList
				keyExtractor={(item) => item.hid}
				getItemLayout = {(data, index) => (
					{
						length: 47,
						offset: index * 47,
						index
					}
				)}
				contentContainerStyle={{
					alignItems: 'stretch'
				}}
				style={styles.list}
				data={list}
				renderItem={({item, index}) => {
					return (
						<Pressable onLongPress={() => {
							if(!sel) callBS(index);
							else return;
						}}
							onPress={() => {
								if(sel) {
									if(sel.includes(index)) removeSelect(index);
									else addSelect(index);
								} else {
									navigation.navigate('Note', {
										note: item.hid
									})}
							}} style={{
								flexDirection: 'row',
								alignItems: 'center'
							}}>
							{(sel) && (<MI name={sel.includes(index) ? "check-box" : "check-box-outline-blank"} size={20} style={{color: '#eee', margin: 5}} />)}
							<NoteCard m={item} />
						</Pressable>
					)
				}}
				ref={fl}
				onRefresh={() => refetch()}
				refreshing={refr}
			/>
			<FAM ref={fab}>
				<Pressable onPress={(e) => {
					sSel(null)
					fab?.current?.close(e);
					navigation.navigate("Note", {
						note: ''
					});
				}}>
				<MI name='notes'
					style={[styles.icon, {
						marginBottom: 5
					}]}
					size={60}
				/>
				</Pressable>
			</FAM>
			<BottomSheet ref={BS}>
				<Text style={{
					color: '#eee',
					fontSize: 20,
					fontWeight: 'bold',
					padding: 5,
					paddingLeft: 10,
					textAlign: 'left',
					width
				}}>
					{list[cedit]?.title ?? "Untitled Note"}
				</Text>
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
					callMod();
				}} underlayColor='#444'>
				<View style={[styles.bsBtns, {width}]}>
				<Octicons name='trash' size={20} style={{
					color: '#eee',
					marginRight: 5
				}} />
				<Text style={{color: '#eee'}}>Delete</Text>
				</View>
				</TouchableHighlight>
				<TouchableHighlight onPress={() => {
					startSelect(cedit)
				}} underlayColor='#444'>
				<View style={[styles.bsBtns, {width}]}>
				<MI name='check-box' size={20} style={{
					color: '#eee',
					marginRight: 5
				}} />
				<Text style={{color: '#eee'}}>Select</Text>
				</View>
				</TouchableHighlight>
			</BottomSheet>
		</View>
	)
}

function DBtn(props) {
	return (
		<Pressable onPress={() => props.show()} style={{
			marginLeft: 'auto'
		}}>
			<FA5 name='trash-alt' size={20} style={{
				marginRight: 10,
				color: '#eee',
			}} />
		</Pressable>
	)
}

const styles = StyleSheet.create({
  container: {
  	flex: 1,
    backgroundColor: '#111',
    color: '#eee',
    paddingTop: StatusBar.currentHeight
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
  bsBtns: {
		width: '100%',
		padding: 10,
		paddingTop: 20,
		paddingBottom: 20,
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center'
  },
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
  },
  icon: {
	color: '#eee'
  },
});

