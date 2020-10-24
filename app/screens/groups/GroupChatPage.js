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

const DATA = {
  senderEmail: "aaa@gmail.com",
  senderName: "JackSon",
  senderPhotoUrl: "https://randomuser.me/api/portraits/men/29.jpg",
  message: "Hi, nice to meet you",
  check: true,
  data: [
    {
      id: Number(new Date())-900100,
      senderid: 22,
      senderEmail: "bbb@gmail.com",
      senderName: "Julian",
      senderPhotoUrl: "https://randomuser.me/api/portraits/women/33.jpg",
      message: "Nice to meet you, William",
      from: Number(new Date())-900100,
    },
    {
      id: Number(new Date())-1000100,
      senderid: 22,
      senderEmail: "ccc@gmail.com",
      senderName: "Lucus",
      senderPhotoUrl: "https://randomuser.me/api/portraits/men/24.jpg",
      message: "how are you, William",
      from: Number(new Date())-1000100,
    },
    {
      id: Number(new Date())-1900100,
      senderid: 22,
      senderEmail: "ddd@gmail.com",
      senderName: "William",
      senderPhotoUrl: "https://randomuser.me/api/portraits/women/68.jpg",
      urlLink: "https://www.linkedin.com/",
      message: "Hey! how are you. This is William",
      from: Number(new Date())-1900100,
    },
    {
      id: Number(new Date())-2000100,
      senderid: 22,
      senderEmail: "ddd@gmail.com",
      senderName: "William",
      senderPhotoUrl: "https://randomuser.me/api/portraits/women/68.jpg",
      message: "Hey! how are you. This is William",
      from: Number(new Date())-2000100,
    },
    {
      id: Number(new Date())-3000100,
      senderid: 11,
      senderEmail: "aaa@gmail.com",
      senderName: "JackSon",
      senderPhotoUrl: "https://randomuser.me/api/portraits/men/39.jpg",
      message: "Thank you so much 🎉",
      from: Number(new Date())-3000100,
    },
    {
      id: Number(new Date())-4000100,
      senderid: 22,
      senderEmail: "ccc@gmail.com",
      senderName: "Lucus",
      senderPhotoUrl: "https://randomuser.me/api/portraits/men/49.jpg",
      message: "me too. Great! 👍",
      from: Number(new Date())-4000100,
    },
    {
      id: Number(new Date())-5000100,
      senderid: 22,
      senderEmail: "bbb@gmail.com",
      senderName: "Julian",
      senderPhotoUrl: "https://randomuser.me/api/portraits/women/33.jpg",
      message: "Really!, Great!. I love Canana",
      from: Number(new Date())-5000100,
    },
    {
      id: Number(new Date())-6000100,
      senderid: 11,
      senderEmail: "aaa@gmail.com",
      senderName: "JackSon",
      senderPhotoUrl: "https://randomuser.me/api/portraits/men/39.jpg",
      message: "This is JackSon from Canada",
      from: Number(new Date())-6000100,
    },
    {
      id: Number(new Date())-7000100,
      senderid: 22,
      senderEmail: "ccc@gmail.com",
      senderName: "Lucus",
      senderPhotoUrl: "https://randomuser.me/api/portraits/men/49.jpg",
      message: "that's fine",
      from: Number(new Date())-7000100,
    },
    {
      id: Number(new Date())-8000100,
      senderid: 22,
      senderEmail: "bbb@gmail.com",
      senderName: "Julian",
      senderPhotoUrl: "https://randomuser.me/api/portraits/women/33.jpg",
      message: "nice to meet you too",
      from: Number(new Date())-8000100,
    },
    {
      id: Number(new Date())-8900100,
      senderid: 11,
      senderEmail: "aaa@gmail.com",
      senderName: "JackSon",
      senderPhotoUrl: "https://randomuser.me/api/portraits/men/39.jpg",
      urlLink: "https://www.youtube.com/watch?v=Kmiw4FYTg2U",
      message: "Hi, nice to meet you. This is my video",
      from: Number(new Date())-8900100,
    },
    {
      id: Number(new Date())-9000100,
      senderid: 11,
      senderEmail: "aaa@gmail.com",
      senderName: "JackSon",
      senderPhotoUrl: "https://randomuser.me/api/portraits/men/39.jpg",
      message: "Hi, nice to meet you. This is my video",
      from: Number(new Date())-9000100,
    },
  ]
}

const messageBox = (message, user_id) => {
  let received = message?.senderid != user_id;
  let created_at = moment(Number(message.id)).format("DD/M/YYYY HH:mm:ss");
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
            { message?.senderPhotoUrl ?
              <Image source={{ uri: message?.senderPhotoUrl }} style={styles.chatimg} />
                :
                <Image style={styles.img} />
            }
            <Text style={{fontSize: 12, fontWeight: 'bold'}} numberOfLines={1}>
              {message.senderName}
            </Text>
          </View>
        </View>
      ) : null}
      { message.urlLink != undefined &&
        <TouchableOpacity style={{flex: 1, width: "100%", flexDirection: "column"}}>
          <RNUrlPreview
            text={message.urlLink}
          />
        </TouchableOpacity>
      }
      { message.urlLink == undefined &&
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
            {message.message}
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

class GroupChatPage extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      messageModal: false,
      messages: DATA,
      message: "",
      loading: false,
      group: this.props.route.params?.group
    };
  }

  componentDidMount () {
    let title = this.state.group?.group_name;
    this.props.navigation.setOptions({ title: title });
  }

  onPressSendMessage () {

  }

  onChangeMessage = (text) => {
    this.setState({
      message: text,
    })
  }

  render () {
    const { messages, message } = this.state;
    
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
            data={messages?.data}
            renderItem={({ item }) => {
              return messageBox(item, 11 );
            }}
          />

          <View style={styles.inputBoxWrapper}>
              <View style={styles.inputBox}>
                <TextInput
                    style={{
                      width:'90%',
                      paddingVertical:5,
                    }}
                    value={message}
                    placeholder="Type a message..."
                    onChangeText={(text) => this.onChangeMessage(text)}
                />
              </View>
              <TouchableOpacity
                  onPress={() => this.onPressSendMessage() }
                  style={styles.buttonSend}
                >
                <MaterialCommunityIcons name="arrow-right-thick" size={20} color="white" />
              </TouchableOpacity>
            </View>
        </View>

      </View>
    );
  }
};

export default GroupChatPage;

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
    borderRadius: 60,
    width: 60,
    height: 60,
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
