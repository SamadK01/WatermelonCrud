import {  View,  Text,SafeAreaView, TouchableOpacity, TextInput,FlatList, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import {database} from './data/database';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';

const App = () => {
  const [showCard, setShowCard] = useState(false);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [notes, setNotes] = useState([]);
  const [type, setType] = useState('new');
  const [selectedId,setSelectedId]=useState('')

  useEffect(() => {
    getNotes();
  }, []);

  const getNotes = () => {
    const notesData = database.collections.get('notes');
    console.log(notesData);
    notesData
      .query()
      .observe()
      .forEach(item => {
        console.log('item===>', item);
        let temp = [];
        item.forEach(data => {
          temp.push(data._raw);
        });
        setNotes(temp);
      });
  };
  const addNote = async () => {
    await database.write(async () => {
      const newPost = await database.get('notes').create(note => {
        note.note = title;
        note.desc = desc;
      });
      console.log('saved');
      setTitle('');
      setDesc('');
      setShowCard(false);
      getNotes();
    });
  };

  const updateNote = async() => {
    await database.write(async () => {
      const note = await database.get('notes').find(selectedId)
      await note.update((item) => {
        item.note = title
        item.desc=desc
      })
      setType('new')
      setTitle('')
      setDesc('')
      setShowCard(false)
      getNotes()
    })
  };

  const deleteNote = async id => {
    await database.write(async () => {
      const note = await database.get('notes').find(id);
      await note.destroyPermanently();
      getNotes();
      alert('Note successfully deleted!');
    });
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      {showCard ? (
        <View
          style={styles.cardDesign}>
          <Text style={{ alignSelf: 'center', marginTop: 10, fontSize: 28,fontWeight:'bold' }}>
            {type == 'new' ? ' To Do Task' : ' Update Note'}
          </Text>
          <TextInput
            placeholder="Enter Title"
            style={styles.inputField}
            value={title}
            onChangeText={txt => setTitle(txt)}
          />
          <TextInput
            placeholder="Enter Description"
            style={styles.inputField}
            value={desc}
            onChangeText={txt => setDesc(txt)}
          />
          <TouchableOpacity
            style={styles.addNewButton}
            onPress={() => {
              if (type == 'new') {
                addNote();
              } else {
                updateNote()
              }

            }}>
            <Text style={{ color: 'white', fontSize: 18 }}>
              {type == 'edit' ? 'Save Note' : 'Add New Task'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => {
              setShowCard(false);
            }}>
            <Text style={{ color: 'white', fontSize: 18 }}>Back To List</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 28, fontWeight: 'bold', marginVertical: 20, color: '#274728' }}>My Crud WatermelonDB</Text>
          </View>

          <FlatList
            data={notes}
            renderItem={({ item, index }) => {
              console.log(item);
              return (
                <View
                  style={styles.itemFlatlist}>
                  <View>
                    <Text style={{ fontSize: 18, color: 'black' }}>{item.note}</Text>
                    <Text style={{ fontSize: 16, color: 'black' }}>{item.desc}</Text>
                  </View>
                  <View>
                    <Text style={{ color: 'red' }} onPress={() => { deleteNote(item.id); }}> <MaterialCommunityIcons name="delete" size={25} style={{ color: 'red' }} /> </Text>
                    <Text style={{ color: 'blue', marginTop: 10, left: 4 }}
                      onPress={() => {
                        setType('edit');
                        setTitle(item.note);
                        setDesc(item.desc);
                        setSelectedId(item.id)
                        setShowCard(true);
                      }}>
                      <Feather name="edit" size={25} style={{ color: 'green' }} />
                    </Text>
                  </View>
                </View>
              );
            }}
          />
          <TouchableOpacity style={styles.buttonAdd} onPress={() => { setShowCard(true); }}>
            <Text style={{ color: 'white', fontSize: 18 }}>Add New Task</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
    
  );
};
export default App;

const styles = StyleSheet.create({
  buttonAdd: {
    width: '80%',
    bottom: 30,
    height: 60,
    backgroundColor: 'orange',
    position: 'absolute',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius:10
  },
  cardDesign: {
    width: '90%',
    paddingBottom: 20,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignSelf: 'center',
    padding: 10,
    marginTop: 50,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  inputField: {
    width: '90%',
    height: 50,
    borderWidth: 0.5,
    alignSelf: 'center',
    marginTop: 20,
    paddingLeft: 20,
    borderRadius:5
  },

  itemFlatlist: {
    width: '90%',
    height: 80,
    alignSelf: 'center',
    marginTop: 10,
    paddingLeft: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 10,
    borderRadius: 10,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
      
    },
    marginBottom:10,
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cancelButton : {
    width: '90%',
    marginTop: 20,
    height: 50,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'orange',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'orange'
  },

  addNewButton : {
    width: '90%',
    marginTop: 20,
    height: 50,
    borderRadius: 8,
    backgroundColor: 'green',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
});



