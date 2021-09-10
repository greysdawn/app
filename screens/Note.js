import React, {
	useState,
	useRef,
	useEffect
} from 'react';

import { 
	StyleSheet as SS,
	Text,
	TextInput,
	View,
	Pressable,
	FlatList,
	TouchableOpacity,
	useWindowDimensions,
	TouchableHighlight,
	BackHandler,
	StatusBar,
	ActivityIndicator
} from 'react-native';

import {
	useFocusEffect
} from '@react-navigation/native';

import {
	AntDesign, Entypo, FontAwesome5 as FA5
} from '@expo/vector-icons';

import axios from 'axios';
import Header from '../components/Header';
import Modal from '../components/Modal';

export default Note = ({route, navigation}) => {
	var { i, save:onSave } = route.params;
	
	var [note, sNote] = useState(route.params.note)
	var [content, sCon] = useState(note.content);
	var [title, sTi] = useState(note.title);
	var [lo, sLo] = useState(false);

	var mod = useRef();

	const {height, width} = useWindowDimensions();

	async function save() {
		sLo(true)
		var rq = {
			data: {
				title,
				content
			}
		}

		if(note.hid) {
			rq.method = 'PATCH';
			rq.url = `/api/note/${note.hid}`
		} else {
			if(!title && !content) return;
			rq.method = 'POST';
			rq.url = '/api/notes'
		}
		var rs = await axios(rq);
		sNote(rs.data);
		if(onSave) onSave(i);
		sLo(false)
	}

	async function del() {
		if(!note.hid) return navigation.goBack();

		await axios.delete(`/api/note/${note.hid}`);
		if(onSave) onSave();
		navigation.goBack();
	}

	function showMod() {
		mod?.current?.show();
	}

	function hideMod() {
		mod?.current?.hide();
	}

	useFocusEffect(React.useCallback(() => {
		const handle = () => {
			save().then(() => {
				return false;
			});
		}

		BackHandler.addEventListener('hardwareBackPress', handle);

		return () => BackHandler.removeEventListener('hardwareBackPress', handle);
	}, [title, content]));

	return (
		<View style={[
			styles.v,
			{
				paddingTop: StatusBar.currentHeight
			}
		]}>
		<Header
			buttonType="back"
			onBack={save}
			size={20}
			navigation={navigation}
			title={note.hid ? "Note" : "New Note"}
		>
			{lo && <ActivityIndicator size="small" color="#aaa" />}
			<Pressable onPress={() => save()} style={{
				marginLeft: 'auto'
			}}>
			<FA5 name="save" size={20} style={styles.t}/>
			</Pressable>
			<Pressable onPress={() => showMod()} style={{
				// marginLeft: 'auto'
			}}>
			<FA5 name="trash-alt" size={20} style={styles.t}/>
			</Pressable>
		</Header>
		<Modal ref={mod}>
			<Text style={{color: '#eee'}}>Are you sure you want to delete this note?</Text>
			<View style={{
				flexDirection: 'row',
				alignItems: 'space-around'
			}}>
			<TouchableOpacity style={styles.btn} onPress={() => {hideMod(); del();}}>
				<Text style={{color: '#eee'}}>Yes</Text>
			</TouchableOpacity>
			<TouchableOpacity style={styles.btn} onPress={() => {hideMod()}}>
				<Text style={{color: '#eee'}}>No</Text>
			</TouchableOpacity>
			</View>
		</Modal>
		<TextInput style={[
			styles.t,
			styles.tit,
			{
				width
			}
		]}
		placeholder="Title"
		placeholderTextColor='#aaa5'
		value={title}
		onChangeText={sTi}
		/>
		<View style={{width, flex: 1}}>
		<TextInput style={[
			styles.t,
			{
				flex: 1,
				width,
			}
		]}
		placeholder="Content"
		placeholderTextColor='#aaa5'
		value={content}
		onChangeText={sCon}
		textAlignVertical='top'
		multiline
		/>
		</View>
		</View>
	)
}

const styles = SS.create({
	v: {
		flex: 1,
		alignItems: 'stretch',
		backgroundColor: '#111'
	},
	t: {
		color: '#eee',
		padding: 5
	},
	tit: {
		fontSize: 20,
		paddingTop: 20,
		borderColor: '#111',
		borderBottomWidth: 2,
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
})