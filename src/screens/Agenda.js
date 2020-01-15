import React, {Component} from 'react';
import {View, ImageBackground, Text, StyleSheet, FlatList, AsyncStorage, TouchableOpacity, Alert} from 'react-native';
import moment from 'moment';
import 'moment/locale/pt-br';
import Common from '../commonStyles';
import Task from '../components/Task';
import Icon from 'react-native-vector-icons/FontAwesome';
import ActionButton from 'react-native-action-button'
import AddTask from './AddTask'

export default class Agenda extends Component {
  state = {
    tasks: [],
    tasksVisiveis:[],
    mostraTasksFinalizadas:true,
    showAddTask:false
    //mostraTasksPendentes:true
  };

  adicionaTask = task =>{
      const tasks = [...this.state.tasks]
      tasks.push({
        id:Math.random(),
        desc:task.desc,
        estimateAt: task.date,
        doneAt:null
      })    
      this.setState({ tasks, showAddTask:false }, this.filtraPendentes)
  }

  filtraPendentes = () =>{
    let tasksVisiveis = null
    if(this.state.mostraTasksFinalizadas){
      tasksVisiveis = [...this.state.tasks]
    }else{
      const pendente = task => task.doneAt === null
      tasksVisiveis = this.state.tasks.filter(pendente)
    }
    this.setState({tasksVisiveis})
    AsyncStorage.setItem('tasks', JSON.stringify(this.state.tasks))
  }
  /*filtraFinalizadas = () =>{
    let tasksVisiveis = null
    if(this.state.mostraTasksPendentes){
      tasksVisiveis = [...this.state.tasks]
    }else{
      const finalizadas = task => task.doneAt === new Date()
      tasksVisiveis = this.state.tasks.filter(finalizadas)
    }
  }*/
  
  trocaFiltroPendentes = () =>{
    this.setState({mostraTasksFinalizadas: !this.state.mostraTasksFinalizadas},
      this.filtraPendentes)
  }
  /*trocaFiltroFinalizadas = () =>{
    this.setState({mostraTasksPendentes: !this.state.mostraTasksPendentes},
      this.filtraFinalizadas) 
  }*/
  componentDidMount = async () =>{
    const data = await AsyncStorage.getItem('tasks')
    const tasks = JSON.parse(data) || []
    this.setState({tasks}, this.filtraPendentes)
  }
  deleteTask = id =>{
    const tasks = this.state.tasks.filter(task =>task.id!==id)
    this.setState({tasks}, this.filtraPendentes)
  }


  mudaCheck = id => {
    const tasks = this.state.tasks.map(task => {
      if (task.id === id) {
        task = {...task}
        task.doneAt = task.doneAt ? null : new Date();
      }
      return task
    })
    this.setState({tasks}, this.filtraPendentes);
  };

  render() {
    return (
      <View style={styles.container}>
        <AddTask isVisible={this.state.showAddTask}
          onSave={this.adicionaTask}
          onCancel={()=> this.setState({showAddTask:false})} />
        <ImageBackground
          source={require('../../images/imgs/today.jpg')}
          style={styles.background}>
            <View style={{flexDirection:'row'}}>
              <TouchableOpacity onPress={this.trocaFiltroPendentes}>
                <Icon name={this.state.mostraTasksFinalizadas ? "eye" : "eye-slash"} size={20} color={Common.colors.secondary} />
              </TouchableOpacity>
              <Text style={{marginHorizontal:10, color:'white'}}>Filtra pendentes</Text>
              <TouchableOpacity >
                <Icon  size={20} color={'yellow'} />
              </TouchableOpacity>
              <Text style={{marginLeft:10, color:'yellow'}}>Filtra finalizados</Text>

            </View>
          <View style={styles.cabecalho}>
            <Text style={styles.titulo}>Hoje</Text>
            <Text style={styles.subtitulo}>
              {moment()
                .locale('pt-br')
                .format('ddd, D [de] MMMM')}
            </Text>
          </View>
        </ImageBackground>
        <View style={styles.tarefasContainer}>
          <FlatList
            data={this.state.tasksVisiveis}
            keyExtractor={item => `${item.id}`}
            renderItem={({item}) =>
              <Task {...item} mudaCheck={this.mudaCheck} 
              onDelete={this.deleteTask}/>
            }
          />
        </View>
        <ActionButton buttonColor={Common.colors.today}
        onPress={() => {this.setState({showAddTask:true})}}/>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 3,
  },
  cabecalho: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  titulo: {
    fontFamily: Common.fontFamily,
    color: Common.colors.secondary,
    fontSize: 50,
    marginLeft: 20,
    marginBottom: 10,
  },
  subtitulo: {
    fontFamily: Common.fontFamily,
    color: Common.colors.secondary,
  },
  tarefasContainer: {
    flex: 7,
  },
});
