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

import TaskCard from '../components/TaskCard';
import Modal from '../components/Modal';
import Header from '../components/Header';
import BottomSheet from '../components/BottomSheet';
import FAM from '../components/FloatingActionMenu';
import axios from 'axios';

function EmptyItem({item}) {
	return (
      // Flat List Item
      <Text
        // style={styles.emptyListStyle}
        // onPress={() => getItem(item)}
      >
        Nothing here 👻
      </Text>
    );
}

export default function Tasks(props) {
	const { width } = useWindowDimensions();
	const { navigation } = props;

	var [list, setList] = useState([]);
	var [cedit, sCed] = 	useState(null);
	var [sel, sSel] = 		useState(null)
	var [refr, sRefr] = 	useState(false);

	var fl = 	useRef();
	var BS = 	useRef();
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
		var d = await axios.get('/api/tasks');
		setList(d.data);
		sRefr(false);
	}

	async function del(ind) {
		var k = list[ind].hid;
		await axios.delete('/api/task/'+k);
		refetch()
		BS?.current?.hide();
	}

	async function clear() {
		sCed(null);
		setList([]);
		await axios.delete('/api/tasks');
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
		navigation.navigate("Task", {
			task: list[ind].hid
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
		await axios.delete('/api/tasks/mass', {
			data: [sel.map(s => list[s].hid)]
		});

		sSel(null);
		refetch();
	}
	
	return (
		<View style={styles.container}>	
			<Header 
				title="Tasks"
				navigation={props.navigation}
			>
			<View style={{
				flex: 1,
				flexDirection: 'row',
				marginLeft: 'auto',
				alignItems: 'center',
				justifyContent: 'flex-end'
			}}>
				<NBtn navigation={navigation}/>
				<DBtn show={callMod}/>
				{sel && (
					<Pressable onPress={() => clearSelect()}>
					<MI name="cancel" size={20} style={{color: '#eee', marginLeft: 5, marginRight: 5}} />
					</Pressable>
				)}
			</View>
			</Header>
			<Modal ref={Mod}>
				{sel && (<Text style={{color: '#eee'}}>Are you sure you want to delete the selected task(s)?</Text>)}
				{(!sel && cedit !== null) && (<Text style={{color: '#eee'}}>Are you sure you want to delete this task?</Text>)}
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
									navigation.navigate('Task', {
										task: item.hid
									})}
							}} style={{
								flexDirection: 'row',
								alignItems: 'center'
							}}>
							{(sel) && (<MI name={sel.includes(index) ? "check-box" : "check-box-outline-blank"} size={20} style={{color: '#eee', margin: 5}} />)}
							<TaskCard m={item} bottom={(index + 1) == list.length} />
						</Pressable>
					)
				}}
				ref={fl}
				onRefresh={() => refetch()}
				refreshing={refr}
				ListEmptyComponent={EmptyItem}
				ItemSeparatorComponent={() => null}
			/>
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
					{list[cedit]?.title ?? "Untitled Task"}
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
				<FA5 name='trash-alt' size={20} style={{
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
			// marginLeft: 'auto'
		}}>
			<FA5 name='trash-alt' size={20} style={{
				marginRight: 10,
				color: '#eee',
			}} />
		</Pressable>
	)
}

function NBtn({navigation}) {
	return (
		<Pressable onPress={(e) => {
				navigation.navigate("Task", {
					task: ''
				});
			}}>
			<AntDesign name='plussquareo'
				style={[styles.icon, {
					marginRight: 10
				}]}
				size={20}
			/>
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
  	paddingBottom: 5
  	// backgroundColor: '#333'
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