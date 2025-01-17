import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Avatar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { db, auth } from '../DB/firebase';
import { onSnapshot, collection, doc, getDoc } from 'firebase/firestore';

const TopBar = ({ navigation }) => {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const fetchUserName = async () => {
      const user = auth.currentUser;
      if (user) {
        const { uid } = user;
        const userDocRef = doc(db, 'usuarios', uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          const { nome, sobrenome } = userData;
          const fullName = `${nome} ${sobrenome}`;
          setUserName(fullName);
        } else {
          setUserName('UserName');
        }
      }
    };

    const unsubscribe = onSnapshot(collection(db, 'usuarios'), () => {
      fetchUserName();
    });

    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.containerTopBar}>
      <View style={styles.positionFoto}>
        <Avatar.Image
          style={styles.icon}
          size={50}
          source={require('../assets/avatar.png')}
        />
      </View>
      <View style={styles.positionUserName}>
        <Text style={styles.username}>Olá: {userName}</Text>
      </View>
      <View style={styles.positionIcon}>
        <TouchableOpacity style={styles.leftIcon}>
          <Icon
            name="user"
            size={25}
            color="white"
            onPress={() => navigation.navigate('Profile')}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  containerTopBar: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 1,
    height: 800,
    maxHeight: '14%',
    width: '100%',
    backgroundColor: '#4A59E3',
    zIndex: 1,
  },
  positionFoto: {
    marginTop: 35,
    marginLeft: 30,
  },
  positionUserName: {
    marginTop: 35,
    marginLeft: 20,
  },
  positionIcon: {
    position: 'absolute',
    right: 40,
    top: 35,
    marginTop: 24,
    marginLeft: 30,
  },
  username: {
    fontFamily: 'roboto',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffff',
    fontFamily: 'Roboto',
  },
});

export default TopBar;
