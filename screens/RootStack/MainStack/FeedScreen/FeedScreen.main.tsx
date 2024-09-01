import React, { useState, useEffect } from "react";
import { View, FlatList, Text } from "react-native";
import { Appbar, Button, Card, Headline } from "react-native-paper";
import firebase from "firebase/app";
import "firebase/firestore";
import { SocialModel } from "../../../../models/social.js";
import { styles } from "./FeedScreen.styles";
import { StackNavigationProp } from "@react-navigation/stack";
import { MainStackParamList } from "../MainStackScreen.js";
import { SafeAreaView } from "react-native-safe-area-context";

/* 
  Remember the navigation-related props from Project 2? They were called `route` and `navigation`,
  and they were passed into our screen components by React Navigation automatically.  We accessed parameters 
  passed to screens through `route.params` , and navigated to screens using `navigation.navigate(...)` and 
  `navigation.goBack()`. In this project, we explicitly define the types of these props at the top of 
  each screen component.

  Now, whenever we type `navigation.`, our code editor will know exactly what we can do with that object, 
  and it'll suggest `.goBack()` as an option. It'll also tell us when we're trying to do something 
  that isn't supported by React Navigation!
*/
interface Props {
  navigation: StackNavigationProp<MainStackParamList, "FeedScreen">;
}

export default function FeedScreen({ navigation }: Props) {
  // List of social objects
  const [socials, setSocials] = useState<SocialModel[]>([]);
  const [likes, setLikes] = useState<String[]>([]);
  const [changes, setChanges] = useState(true);
  const [icon, setIcon] = useState("heart-outline");
  const [inLikes, setInLikes] = useState(false);

  const currentUserId = firebase.auth().currentUser!.uid;

  useEffect(() => {
    const db = firebase.firestore();
    const unsubscribe = db
      .collection("socials")
      .orderBy("eventDate", "asc")
      .onSnapshot((querySnapshot: any) => {
        var newSocials: SocialModel[] = [];
        querySnapshot.forEach((social: any) => {
          const newSocial = social.data() as SocialModel;
          newSocial.id = social.id;
          newSocials.push(newSocial);
        });
        setSocials(newSocials);
      });
    return unsubscribe;
  }, []);

  const toggleInterested = (social: SocialModel) => {
    if (icon === "heart") {
      setIcon("heart-outline");
    } else {
      setIcon("heart");
    }
    const ref = firebase.firestore().collection("socials").doc(social.id)

    if (changes && !inLikes) {
      const arr = likes;
      arr.push(currentUserId)
      setLikes(arr)
      const res = ref.update({likes: likes}).then(() => {
        setChanges(false);
        setInLikes(true);

      })
    } else if (inLikes) {
      const arr = likes;
      const index = arr.indexOf(currentUserId);
      arr.splice(index,1);
      setLikes(arr);
      const res = ref.update({likes: likes}).then(() => {
        setChanges(true);
        setInLikes(false);
      })
    }
  };

  const deleteSocial = (social: SocialModel) => {
    const documentRef = firebase.firestore().collection("socials").doc(social.id)
    var doc_data = documentRef.get();
    doc_data.then((data) => {
      var fieldValue= data.get("userID");
      if (fieldValue === currentUserId) {
        const res = firebase.firestore().collection("socials").doc(social.id);
        res.delete().then(() => { 
        }).catch((err) => console.error(err));
      }
    })
    
    // TODO: Put your logic for deleting a social here,
    // and call this method from your "delete" button
    // on each Social card that was created by this user.
  };

  const Liked = (social: SocialModel) => {
    const documentRef = firebase.firestore().collection("socials").doc(social.id)
    var doc_data = documentRef.get();
    const likeValue = doc_data.then((data) => {
      var aaa= data.get("likes");
      setLikes(aaa);
    })

    return (
      <Button icon = {icon} onPress = {() => toggleInterested(social)}>{layks()}</Button>
    )
  }

  const layks = () => {
    if (!likes || !likes.includes(currentUserId)) {
      return 0
    } else {
      return likes.length;
    }
  }
  const renderSocial = ({ item }: { item: SocialModel }) => {
    const onPress = () => {
      navigation.navigate("DetailScreen", {
        social: item,
      });
    };

    return (
      <Card onPress={onPress} style={{ margin: 16 }}>
        <Card.Cover source={{ uri: item.eventImage }} />
        <Card.Title
          title={item.eventName}
          subtitle={
            item.eventLocation +
            " • " +
            new Date(item.eventDate).toLocaleString()
          }
        /> 
        <Card.Actions>
          <Button onPress = {() => deleteSocial(item)}> Delete </Button>
          {Liked(item)}
        </Card.Actions>
      </Card>
    );
  };

  const noEvents = () => {
    return (
      <SafeAreaView>
        <Headline >No Events so far! Add some!!</Headline>
        </SafeAreaView>
    )
  }

  const Bar = () => {
    return (
      <Appbar.Header>
        <Appbar.Action
          icon="exit-to-app"
          onPress={() => firebase.auth().signOut()}
        />
        <Appbar.Content title="Socials" />
        <Appbar.Action
          icon="plus"
          onPress={() => {
            navigation.navigate("NewSocialScreen");
          }}
        />
      </Appbar.Header>
    );
  };

  return (
    <>
      <Bar />
      <View style={styles.container}>
        <FlatList
          data={socials}
          renderItem={renderSocial}
          keyExtractor={(_: any, index: number) => "key-" + index}
          // TODO: Uncomment the following line, and figure out how it works
          // by reading the documentation :)
          // https://reactnative.dev/docs/flatlist#listemptycomponent

          ListEmptyComponent={noEvents}
        />
      </View>
    </>
  );
}
