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
	TouchableOpacity,
	useWindowDimensions,
	TouchableHighlight,
	StatusBar
} from 'react-native';

import {
	AntDesign, Octicons, SimpleLineIcons as SLI,
	MaterialIcons as MI, FontAwesome5 as FA5
} from '@expo/vector-icons';

import NoteCard from '../components/NoteCard';
import Modal from '../components/Modal';
import Header from '../components/Header';
import BottomSheet from '../components/BottomSheet';
import FAB from '../components/FloatingActionButton';
import axios from 'axios';

export default function Notes(props) {
	const { width } = useWindowDimensions();
	const { navigation } = props;
	
	var [text, setText] = useState(null);
	var [list, setList] = useState([]);
	var [editing, setEditing] = useState(false);
	var [cedit, sCed] = useState(null);
	var [tm, sTm] = useState(null);
	var [fetched, sF] = useState(false);
	var [mod, sMod] = useState(false);
	var [bs, sBs] = useState(false);
	var [upd, sUpd] = useState(false);

	var fl = useRef();
	var BS = useRef();
	var Mod = useRef();
	var fab = useRef();
	var [refr, sRefr] = useState(false);

	useEffect(() => {
		if(!fetched) {
			refetch();
			sF(true);
		}
	})

	async function refetch() {
		sRefr(true);
		var d = await axios.get('/api/notes');
		setList(d.data);
		sRefr(false);
	}
	
	async function addMsg() {
		if(!text) return;
		var l = list;
		try {
			var rq = await axios.post('/api/note', {content: text.trim()})
		} catch(e) {
			console.log(e)
		}

		l.push(rq.data);
		setList(l);
		setText(null);
		fl.current.scrollToEnd()
	}

	async function del(ind) {
		var k = list[ind].hid;
		var rq = await axios.delete('/api/note/'+k);
		refetch()
		BS?.current?.hide();
	}

	async function clear() {
		setEditing(false);
		sCed(null);
		setText(null)
		setList([]);
		sTm(null)
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
			note: list[ind],
			i: ind,
			save
		})
		BS?.current?.hide();
	}

	function save(index) {
		refetch()
		if(index && list[index]) fl.current.scrollToIndex({index});
	}

	function toggleModal(val) {
		sMod(val ?? !mod)
	}

	function toggleBS(val) {
		sBs(val ?? !bs)
	}
	
	return (
		<View style={styles.container}>	
			<Header 
				title="Notes"
				navigation={props.navigation}
			>
				<DBtn show={callMod}/>
			</Header>
			<Modal ref={Mod}>
				<Text style={{color: '#eee'}}>Are you sure you want to clear everything?</Text>
				<View style={{
					flexDirection: 'row',
					alignItems: 'space-around'
				}}>
				<TouchableOpacity style={styles.btn} onPress={() => {hideMod(); clear();}}>
					<Text style={{color: '#eee'}}>Yes</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.btn} onPress={() => {hideMod()}}>
					<Text style={{color: '#eee'}}>No</Text>
				</TouchableOpacity>
				</View>
			</Modal>
			<FlatList
				keyExtractor={(item) => item.hid}
				extraData={upd}
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
						<Pressable onLongPress={() => callBS(index)}
							onPress={() => navigation.navigate('Note', {
								note: item,
								i: index,
								save
							})}>
							<NoteCard m={item} />
						</Pressable>
					)
				}}
				ref={fl}
				onRefresh={() => refetch()}
				refreshing={refr}
			/>
			<FAB ref={fab}>
				<Pressable onPress={(e) => {
					fab?.current?.close(e);
					console.log(fab)
					navigation.navigate("Note", {
						note: {},
						i: list.length,
						save
					});
				}}>
				<MI name='notes'
					style={[styles.icon, {
						marginBottom: 5
					}]}
					size={60}
				/>
				</Pressable>
			</FAB>
			<BottomSheet open={bs} toggle={toggleBS} ref={BS}>
				<Text style={{
					color: '#eee',
					fontSize: 20,
					fontWeight: 'bold',
					padding: 5,
					paddingLeft: 10,
					textAlign: 'left',
					width
				}}>
					{list[cedit].title}
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

