import React, { Component, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Platform,
  ActivityIndicator,
  BackHandler,
  RefreshControl,
  ScrollView
} from "react-native";

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { TextInput } from "react-native-gesture-handler";
import moment from "moment";
import RNUrlPreview from 'react-native-url-preview';
import { firestore, storage} from '../../../database/firebase';
import firebase from '../../../database/firebase';
import {stylesGlobal} from '../../../app/styles/stylesGlobal';
import { useFocusEffect } from '@react-navigation/native';

const maxLoadData = 15

function validURL(str) {
  var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  return !!pattern.test(str);
}

const messageBox = (message, myuid) => {
  let received = message?.user?._id != myuid;
  let created_at = moment(Number(message?.createdAt)).format("DD/M/YYYY HH:mm:ss");
  return (
    <View
        style={{
          flex: 1,
          flexDirection: "row",
          marginTop: 20,
          width: "70%",
          minHeight: 50,
          alignSelf: received ? "flex-start" : "flex-end",
        }}
      >
      {received ? (
        <View style={{ width: 40, marginRight: 10, justifyContent: "flex-end" }}>
          <View>
            { message?.user?.senderPhotoUrl ?
              <Image source={{ uri: message?.user?.senderPhotoUrl }} style={styles.chatimg} />
                :
                <Image style={styles.img} />
            }
            <Text style={{fontSize: 12, fontWeight: 'bold'}} numberOfLines={1}>
              {message?.user?.displayName}
            </Text>
          </View>
        </View>
      ) : null}
      { validURL(message?.text) == true &&
        <TouchableOpacity style={{flex: 1, width: "100%", flexDirection: "column"}}>
          <RNUrlPreview
            text={message?.text}
          />
        </TouchableOpacity>
      }
      { validURL(message?.text) == false &&
        <View
            style={{
              width: "100%",
              borderRadius: 10,
              padding: 10,
              borderBottomLeftRadius: received ? 0 : 10,
              borderBottomRightRadius: received ? 10 : 0,
              backgroundColor: received ? '#f2f6f9' : '#ddf4fd',
            }}
          >
          <Text
            style={{
              width: "100%",
              textAlign: "left",
              lineHeight: 20,
            }}
          >
            {message?.text}
          </Text>
          <View
              style={{
                alignSelf: received ? "flex-start" : "flex-end",
                marginTop: 10,
              }}
            >
            <Text style={{ fontSize: 10 }}>{created_at}</Text>
          </View>
        </View>
      }
    </View>
  );
};

export default function GroupChatPage(props) {

  const [initialize, setInitialize] = useState(false)
  const [userMe, setUserMe] = useState(null)
  const [threads, setThreads] = useState([])
  const [loading, setLoading] = useState(false)
  const [messageModal, setMessageModal] = useState(false)
  const [messages, setMessages] = useState(null)
  const [newtext, setMessage] = useState("")
  const [group, setGroup] = useState(props.route.params?.group)
  const [limitCount, setLimitCount] = useState(maxLoadData)
  const [showLoadMore, setShowLoadMore] = useState(true)

  const navigationiOptions = () => {
    
    props.navigation.setOptions({
        title: group?.group_name,
        headerLeft: () => (
          <TouchableOpacity
              onPress={() => onPressBack() }
              style={{paddingLeft: 16}}
          >
            <MaterialCommunityIcons name="arrow-left" size={25} color="white" />
          </TouchableOpacity>
        )
    })
  }

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        return true;
      };
  
      BackHandler.addEventListener(
        'hardwareBackPress', onBackPress
      );
  
      return () =>
        BackHandler.removeEventListener(
          'hardwareBackPress', onBackPress
        );
    }, [])
  );

  useEffect(() => {
    if(!initialize) {
      getProfile()
      InitializeMyUnreadMessageCount(group)
    }

    navigationiOptions();

    setInitialize(true)

    setLoading(true)

    const unsubscribeListener = firestore
    .collection('MESSAGE_THREADS')
    .doc(group?.threadId)
    .collection('MESSAGES')
    .orderBy('createdAt', 'desc')
    .limit(limitCount)
    .onSnapshot(querySnapshot => {
      const messages = querySnapshot.docs.map(doc => {
        const firebaseData = doc.data()

        const data = {
          _id: doc.id,
          text: '',
          createdAt: new Date().getTime(),
          ...firebaseData
        }

        if (firebaseData?.system == true)
          setShowLoadMore(false)

        // if (!firebaseData.system) {
        //   data.user = {
        //     ...firebaseData.user,
        //     name: firebaseData.user.displayName
        //   }
        // }
        return data
      })


      setMessages(messages)
      setLimitCount(messages.length)

      setLoading(false)
    })

    return () => unsubscribeListener()

  }, [])
  
  const getProfile = () => {
    
    let user = firebase.auth().currentUser
    let uid = user.uid

    firestore.collection("member_list")
        .where("user_id", "==", uid)
        .get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                let userMe = doc.data();
                userMe.id = doc.id
                userMe.displayName = user.displayName
                setUserMe(userMe)
            });
        });
  }

  const onPressBack = () => {
    InitializeMyUnreadMessageCount(group)
    props.navigation.goBack()
  }

  const onPressSendMessage = () => {
    if(newtext == "")
      return;

    let text = newtext
    setMessage("")

    firestore
      .collection('MESSAGE_THREADS')
      .doc(group?.threadId)
      .collection('MESSAGES')
      .add({
        text,
        createdAt: new Date().getTime(),
        user: {
          _id: userMe.user_id,
          displayName: userMe.displayName,
          senderPhotoUrl: userMe.picture
        }
      }).then( async docref => {

        updateUnreadMessageCount(group, text)
        
      })
  }

  const updateUnreadMessageCount = async (group, text) => {
    let new_unread_msg_count_list = []
    var messageThreadRef = firestore.collection("MESSAGE_THREADS").doc(group?.threadId);
    messageThreadRef.get().then(async(doc) => {
        if (doc.exists)
        {
            var data = doc.data();
            // checking if user is existing in this group
            data?.unread_msg_count_list.forEach( item => {
                let newItem = {
                  ...item,
                }
                if (item._id != userMe.user_id) {
                    newItem = {
                      ...item,
                     count: item.count+1 
                    }
                }
                new_unread_msg_count_list.push(newItem)
            })
            await firestore
                  .collection('MESSAGE_THREADS')
                  .doc(group?.threadId)
                  .set(
                    {
                      latestMessage: {
                        text,
                        createdAt: new Date().getTime()
                      },
                      unread_msg_count_list: new_unread_msg_count_list
                    },
                    { merge: true }
                  )

        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
  }

  const InitializeMyUnreadMessageCount = async(group) => {
    let new_unread_msg_count_list = []
    let uid = firebase.auth().currentUser.uid

    let messageThreadRef = firestore.collection("MESSAGE_THREADS").doc(group?.threadId);

    messageThreadRef.get().then(async(doc) => {
        if (doc.exists)
        {
            let data = doc.data();
            // checking if user is existing in this group
            data?.unread_msg_count_list.forEach( item => {
                let newItem = {
                  ...item,
                }
                if (item._id == uid) {
                    newItem = {
                      ...item,
                     count: 0
                    }
                }
                new_unread_msg_count_list.push(newItem)
            })
            await firestore
                  .collection('MESSAGE_THREADS')
                  .doc(group?.threadId)
                  .set(
                    {
                      unread_msg_count_list: new_unread_msg_count_list
                    },
                    { merge: true }
                  )

        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
  }

  const onChangeMessage = (text) => {
    setMessage(text)
  }

  const handleLoadMore = () => {
    if(!showLoadMore)
      return

    setLoading(true)

    firestore
    .collection('MESSAGE_THREADS')
    .doc(group?.threadId)
    .collection('MESSAGES')
    .orderBy('createdAt', 'desc')
    .limit(limitCount+maxLoadData)
    .onSnapshot(querySnapshot => {
      const messages = querySnapshot.docs.map(doc => {
        const firebaseData = doc.data()

        const data = {
          _id: doc.id,
          text: '',
          createdAt: new Date().getTime(),
          ...firebaseData
        }

        if (firebaseData?.system == true)
          setShowLoadMore(false)

        return data
      })

      setMessages(messages)
      setLimitCount(messages.length)
      
      setLoading(false)

    })
  }

  const endScroll = (event) => {

  };

  const beginScroll = (event) => {

  };

  const endReached = (event) => {
    handleLoadMore()
  };

  const renderRefreshControl = () => {
    // handleLoadMore()
  }
  
  const headerList = () => {
    return (
      <View>
          { showLoadMore && 
            <TouchableOpacity style={{paddingTop: 10, justifyContent: "center", alignItems: "center"}} onPress={() => handleLoadMore()}>
              <Text style={{fontSize: 14, color: stylesGlobal.back_color}}>Load more...</Text>
            </TouchableOpacity>
          }
    </View>
    )
  }

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      { Platform.OS === 'ios' && 
        <View style={{height: 20}}/>
      }
      { loading && 
        <ActivityIndicator style={styles.spinnerStyle} animating={loading} size="large" color={'#9E9E9E'} />
      }
      <View style={styles.body}>

        {/* <ScrollView
            contentContainerStyle={{
              flexDirection: 'row',
              alignSelf: 'flex-end',
              flexGrow: 1
            }}
            refreshControl={<RefreshControl refreshing={loading} onRefresh={() => renderRefreshControl()} />}
          > */}
          <FlatList
            style={{
              width: '100%',
              lexDirection: 'row',
              alignSelf: 'flex-end',
              flexGrow: 1
            }}
            inverted
            // ListFooterComponent={() => headerList()}
            contentContainerStyle={{ paddingHorizontal: 20 }}
            data={messages}
            renderItem={({ item, index }) => {
              return messageBox(item, userMe?.user_id);
            }}
            keyExtractor={(item, index) => index.toString()}
            onEndReached={() => endReached()}
            onEndReachedThreshold={0.2}
            // enableEmptySections={true}
            // onScrollEndDrag={endScroll}
            // onScrollBeginDrag={beginScroll}
            // scrollEventThrottle={16}
            // onRefresh={() => renderRefreshControl()}
            // refreshing={loading}
          />
        {/* </ScrollView> */}
      
        <View style={styles.inputBoxWrapper}>
            <View style={styles.inputBox}>
              <TextInput
                  style={{
                    width:'90%',
                    paddingVertical:5,
                  }}
                  autoCapitalize="none"
                  value={newtext}
                  placeholder="Type a message..."
                  onChangeText={(text) => onChangeMessage(text)}
              />
            </View>
            <TouchableOpacity
                onPress={() => onPressSendMessage() }
                style={styles.buttonSend}
              >
              <MaterialCommunityIcons name="arrow-right-thick" size={20} color="white" />
            </TouchableOpacity>
          </View>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "ios" ? 24 : 0,
  },
  body: {
    flex: 7.5,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    backgroundColor: "white",
  },
  img: {
    borderColor: 'rgba(0,0,0,0.1)',
    borderWidth: 1,
    backgroundColor: 'white',
    borderRadius: 20,
    width: 40,
    height: 40,
  },
  chatimg: {
    borderColor: 'rgba(0,0,0,0.1)',
    borderWidth: 1,
    backgroundColor: 'white',
    borderRadius: 20,
    width: 40,
    height: 40,
  },
  inputBoxWrapper: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderColor: "#e5e5e5",
    borderWidth: 1,
    marginTop: 5,
    paddingHorizontal: 20,
    paddingVertical: 5,
    alignItems: "center",
  },
  inputBox: {
    flex: 1,
    marginHorizontal: 20,
    height: 40,
    borderColor: "#e5e5e5",
    borderWidth: 1,
    borderRadius: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    width:'100%',
  },
  buttonSend: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(85,170,255,1)",
    justifyContent: "center",
    alignItems: "center",
  },
  spinnerStyle: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: 1,
    justifyContent: "center",
  },
});
