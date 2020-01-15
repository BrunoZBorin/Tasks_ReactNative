import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableWithoutFeedback, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';
import 'moment/locale/pt-br';
import Common from '../commonStyles';
import Swip from 'react-native-swipeable'

export default props => {
  let check = null;
  if (props.doneAt !== null) {
    check = (
      <View style={styles.done}>
        <Icon name="check" size={20} color={Common.colors.secondary} />
      </View>
    );
  } else {
    check = <View style={styles.pending} />;
  }

  const descStyle =
    props.doneAt !== null ? {textDecorationLine: 'line-through'} : {};

  const leftContent = (
    <View style={styles.exclude}>
      <Icon name='trash' size={20}
      color={Common.colors.secondary} />
      <Text style={styles.excludeText}>Excluir</Text>
    </View>
  )
  const rightContent = [
    <TouchableOpacity style={[styles.exclude,{justifyContent:'flex-start', paddingLeft:20}]}
                            onPress={()=>onDelete(props.id)}>
      <Icon name='trash' size={30} color={Common.colors.secondary}/>
    </TouchableOpacity>
  ]
  
  return (
  <Swip leftActionActivationDistance={200}
      onLeftActionActivate={() => props.onDelete(props.id)}
      leftContent={leftContent} rightButtons={rightContent}> 
    <View style={styles.container}>
        <TouchableWithoutFeedback onPress={() => props.mudaCheck(props.id)}>
          <View style={styles.checkContainer}>{check}</View>
        </TouchableWithoutFeedback>

        <View>
          <Text style={[styles.description, descStyle]}>{props.desc}</Text>
          <Text style={styles.date}>
            {moment(props.estimateAt)
              .locale('pt-br')
              .format('ddd, D [de] MMMM [de] YYYY')}
          </Text>
        </View>
      </View>
  </Swip>
  );
};
const styles = StyleSheet.create({
  done: {
    height: 25,
    width: 25,
    borderRadius: 15,
    backgroundColor: '#4D7031',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pending: {
    borderWidth: 1, 
    height: 25,
    width: 25,
    borderRadius: 15,
    borderColor: '#555',
  },
  container: {
    paddingVertical: 10,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#AAA',
  },
  checkContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '20%',
  },
  description: {
    fontFamily: Common.fontFamily,
    color: Common.colors.mainText,
    fontSize: 15,
  },
  date: {
    fontFamily: Common.fontFamily,
    color: Common.colors.subText,
    fontSize: 12,
  },
  exclude:{
    flex:1,
    backgroundColor:'red',
    flexDirection:'row',
    justifyContent:'flex-end',
    alignItems:'center'
  },
  excludeText:{
    fontFamily:Common.fontFamily,
    color:'white',
    fontSize:20,
    margin:10
  }
});
