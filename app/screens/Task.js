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
	TouchableOpacity,
	useWindowDimensions,
	BackHandler,
	StatusBar,
	ActivityIndicator,
	ScrollView,
	FlatList
} from 'react-native';

import {
	useFocusEffect
} from '@react-navigation/native';

import {
	FontAwesome5 as FA5
} from '@expo/vector-icons';

import Markdown from 'react-native-markdown-display';

import axios from 'axios';
import Header from '../components/Header';
import Modal from '../components/Modal';

function EmptyItem({item}) {
	return (
      // Flat List Item
      <Text
        style={styles.empty}
        // onPress={() => getItem(item)}
      >
        Nothing here 👻
      </Text>
    );
}

export default Task = ({route, navigation}) => {
	var { task: hid } = route.params;
	
	var [task, sTask] = useState({})
	var [content, sCon] = useState(task.content);
	var [title, sTi] = useState(task.title);
	var [cl, sCl] = useState(task.checklist ?? []);
	var [lo, sLo] = useState(false);
	var [foc, sFoc] = useState(false);

	var mod = useRef();
	var fl = useRef();
	console.log(cl)

	const {width} = useWindowDimensions();

	async function fetch() {
		if(!hid) return;
		sLo(true);
		var rs = await axios.get(`/api/task/${hid}`);
		sTask(rs.data);
		sCon(rs.data.content);
		sTi(rs.data.title)
		sCl(rs.data.checklist)
		sLo(false)
	}

	async function save() {
		sLo(true)
		var rq = {
			data: {
				title,
				content,
				checklist: cl
			}
		}

		if(task.hid) {
			rq.method = 'PATCH';
			rq.url = `/api/task/${task.hid}`
		} else {
			if(!title && !content) return;
			rq.method = 'POST';
			rq.url = '/api/tasks'
		}
		var rs = await axios(rq);
		sTask(rs.data);
		sLo(false)
		sFoc(false)
		return;
	}

	async function del() {
		if(!task.hid) return navigation.goBack();

		await axios.delete(`/api/task/${task.hid}`);
		navigation.goBack();
	}

	function showMod() {
		mod?.current?.show();
	}

	function hideMod() {
		mod?.current?.hide();
	}

	const handle = async () => {
		await save();
		navigation.goBack();
	}

	useFocusEffect(React.useCallback(() => {
		BackHandler.addEventListener('hardwareBackPress', handle);

		return () => BackHandler.removeEventListener('hardwareBackPress', handle);
	}, [task, title, content]));

	useEffect(() => {
		const unsubscribe = navigation.addListener('focus', () => {
			fetch()
		});

		return unsubscribe;
	}, [navigation])

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
			title={task.hid ? "Task" : "New Task"}
		>
			{lo && <ActivityIndicator size="small" color="#aaa" />}
			<Pressable onPress={() => save()} style={{
				marginLeft: 'auto'
			}}>
			<FA5 name="save" size={20} style={styles.t}/>
			</Pressable>

			<Pressable onPress={() => sFoc(true)}>
			<FA5 name="edit" size={20} style={styles.t}/>
			</Pressable>

			<Pressable onPress={() => showMod()}>
			<FA5 name="trash-alt" size={20} style={styles.t}/>
			</Pressable>
		</Header>
		<Modal ref={mod}>
			<Text style={{color: '#eee'}}>Are you sure you want to delete this task?</Text>
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
		{(!content || foc) && (
			<TextInput style={[
				styles.t,
				{
					flex: 1,
					width,
				}
			]}
			placeholder="Content"
			placeholderTextColor='#aaa5'
			value={content || null}
			onChangeText={sCon}
			textAlignVertical='top'
			multiline
			autoFocus
			onFocus={() => { sFoc(true); }}
			/>
		)}
		{(!foc && content?.trim()?.length > 0) && (
			<ScrollView >
			<Markdown style={tstyle} rules={rules}>
			{content}
			</Markdown>
			</ScrollView>
		)}
		<View>
			<Text style={{
				...styles.tit,
				paddingLeft: 10
			}}>Checklist</Text>
			<FlatList
				keyExtractor={(item) => item.name}
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
				data={cl}
				renderItem={({item, index}) => {
					return (
						<View>
							<Text>{item.name}</Text>
						</View>
					)
					// return (
					// 	<Pressable onLongPress={() => {
					// 		if(!sel) callBS(index);
					// 		else return;
					// 	}}
					// 		onPress={() => {
					// 			if(sel) {
					// 				if(sel.includes(index)) removeSelect(index);
					// 				else addSelect(index);
					// 			} else {
					// 				navigation.navigate('Note', {
					// 					note: item.hid
					// 				})}
					// 		}} style={{
					// 			flexDirection: 'row',
					// 			alignItems: 'center'
					// 		}}>
					// 		{(sel) && (<MI name={sel.includes(index) ? "check-box" : "check-box-outline-blank"} size={20} style={{color: '#eee', margin: 5}} />)}
					// 		<NoteCard m={item} />
					// 	</Pressable>
					// )
				}}
				ref={fl}
				// onRefresh={() => refetch()}
				// refreshing={refr}
				ListEmptyComponent={EmptyItem}
			/>
		</View>
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
		borderColor: '#ffffff05',
		borderBottomWidth: 2,
		color: '#eee'
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
	empty: {
		color: '#eee',
		padding: 5,
		fontSize: 15
	}
})

const tstyle = {
	body: {
		flexShrink: 0,
		color: '#eee',
		width: '100%',
		margin: 0,
		elevation: 1,
		flex: 1,
	  	height: '100%'
	},
	blockquote: {
		backgroundColor: '#ca51',
		borderColor: '#ccaa55',
		marginBottom: 10
	},
	heading: {
		margin: 0,
		marginTop: 5,
		marginBottom: 5,
		padding: 0
	},
	paragraph: {
		paddingLeft: 5
	},
	// em: {
		// fontStyle: 'normal'
	// }
}

const rules = {
	em: (node, children, parent, styles) => (
		<Text key={node.key} style={styles.em}>"{children}​"</Text>
	),
	strong: (node, children, parent, styles) => (
		<Text key={node.key} style={styles.strong}>
		"{children}​"
		</Text>
	)
}