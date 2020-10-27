import React, { Component, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Platform,
} from "react-native";

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { TextInput } from "react-native-gesture-handler";
import moment from "moment";
import RNUrlPreview from 'react-native-url-preview';
import { firestore, storage} from '../../../database/firebase';
import firebase from '../../../database/firebase';

const DATA = {
  senderEmail: "aaa@gmail.com",
  senderName: "JackSon",
  senderPhotoUrl: "https://randomuser.me/api/portraits/men/29.jpg",
  text: "Hi, nice to meet you",
  check: true,
  data: [
    {
      id: Number(new Date())-900100,
      senderid: 22,
      senderEmail: "bbb@gmail.com",
      senderName: "Julian",
      senderPhotoUrl: "https://randomuser.me/api/portraits/women/33.jpg",
      text: "Nice to meet you, William",
      from: Number(new Date())-900100,
    },
    {
      id: Number(new Date())-1000100,
      senderid: 22,
      senderEmail: "ccc@gmail.com",
      senderName: "Lucus",
      senderPhotoUrl: "https://randomuser.me/api/portraits/men/24.jpg",
      text: "how are you, William",
      from: Number(new Date())-1000100,
    },
    {
      id: Number(new Date())-1900100,
      senderid: 22,
      senderEmail: "ddd@gmail.com",
      senderName: "William",
      senderPhotoUrl: "https://randomuser.me/api/portraits/women/68.jpg",
      urlLink: "https://www.linkedin.com/",
      text: "Hey! how are you. This is William",
      from: Number(new Date())-1900100,
    },
    {
      id: Number(new Date())-2000100,
      senderid: 22,
      senderEmail: "ddd@gmail.com",
      senderName: "William",
      senderPhotoUrl: "https://randomuser.me/api/portraits/women/68.jpg",
      text: "Hey! how are you. This is William",
      from: Number(new Date())-2000100,
    },
    {
      id: Number(new Date())-3000100,
      senderid: 11,
      senderEmail: "aaa@gmail.com",
      senderName: "JackSon",
      senderPhotoUrl: "https://randomuser.me/api/portraits/men/39.jpg",
      text: "Thank you so much 🎉",
      from: Number(new Date())-3000100,
    },
    {
      id: Number(new Date())-4000100,
      senderid: 22,
      senderEmail: "ccc@gmail.com",
      senderName: "Lucus",
      senderPhotoUrl: "https://randomuser.me/api/portraits/men/49.jpg",
      text: "me too. Great! 👍",
      from: Number(new Date())-4000100,
    },
    {
      id: Number(new Date())-5000100,
      senderid: 22,
      senderEmail: "bbb@gmail.com",
      senderName: "Julian",
      senderPhotoUrl: "https://randomuser.me/api/portraits/women/33.jpg",
      text: "Really!, Great!. I love Canana",
      from: Number(new Date())-5000100,
    },
    {
      id: Number(new Date())-6000100,
      senderid: 11,
      senderEmail: "aaa@gmail.com",
      senderName: "JackSon",
      senderPhotoUrl: "https://randomuser.me/api/portraits/men/39.jpg",
      text: "This is JackSon from Canada",
      from: Number(new Date())-6000100,
    },
    {
      id: Number(new Date())-7000100,
      senderid: 22,
      senderEmail: "ccc@gmail.com",
      senderName: "Lucus",
      senderPhotoUrl: "https://randomuser.me/api/portraits/men/49.jpg",
      text: "that's fine",
      from: Number(new Date())-7000100,
    },
    {
      id: Number(new Date())-8000100,
      senderid: 22,
      senderEmail: "bbb@gmail.com",
      senderName: "Julian",
      senderPhotoUrl: "https://randomuser.me/api/portraits/women/33.jpg",
      text: "nice to meet you too",
      from: Number(new Date())-8000100,
    },
    {
      id: Number(new Date())-8900100,
      senderid: 11,
      senderEmail: "aaa@gmail.com",
      senderName: "JackSon",
      senderPhotoUrl: "https://randomuser.me/api/portraits/men/39.jpg",
      urlLink: "https://www.youtube.com/watch?v=Kmiw4FYTg2U",
      text: "Hi, nice to meet you. This is my video",
      from: Number(new Date())-8900100,
    },
    {
      id: Number(new Date())-9000100,
      senderid: 11,
      senderEmail: "aaa@gmail.com",
      senderName: "JackSon",
      senderPhotoUrl: "https://randomuser.me/api/portraits/men/39.jpg",
      text: "Hi, nice to meet you. This is my video",
      from: Number(new Date())-9000100,
    },
  ]
}

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
  const [messages, setMessages] = useState(DATA)
  const [newtext, setMessage] = useState("")
  const [group, setGroup] = useState(props.route.params?.group)

  useEffect(() => {
    if(!initialize)
      getProfile()
    setInitialize(true)

    let title = group?.group_name
    props.navigation.setOptions({ title: title })

    const unsubscribeListener = firestore
    .collection('MESSAGE_THREADS')
    .doc(group?.threadId)
    .collection('MESSAGES')
    .orderBy('createdAt', 'desc')
    .onSnapshot(querySnapshot => {
      const messages = querySnapshot.docs.map(doc => {
        const firebaseData = doc.data()

        const data = {
          _id: doc.id,
          text: '',
          createdAt: new Date().getTime(),
          ...firebaseData
        }

        // if (!firebaseData.system) {
        //   data.user = {
        //     ...firebaseData.user,
        //     name: firebaseData.user.displayName
        //   }
        // }
        return data
      })

      console.log('messages=============', messages)
      setMessages(messages)
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
        await firestore
        .collection('MESSAGE_THREADS')
        .doc(group?.threadId)
        .set(
          {
            latestMessage: {
              text,
              createdAt: new Date().getTime()
            }
          },
          { merge: true }
        )

      })
  }

  const onChangeMessage = (text) => {
    setMessage(text)
  }

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      { Platform.OS === 'ios' && 
        <View style={{height: 20}}/>
      }
      <View style={styles.body}>

        <FlatList
          style={{
            width: '100%'
          }}
          inverted
          contentContainerStyle={{ paddingHorizontal: 20 }}
          data={messages}
          renderItem={({ item }) => {
            return messageBox(item, userMe?.user_id);
          }}
          keyExtractor={item => item._id}
        />

        <View style={styles.inputBoxWrapper}>
            <View style={styles.inputBox}>
              <TextInput
                  style={{
                    width:'90%',
                    paddingVertical:5,
                  }}
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
  }
});
