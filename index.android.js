/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Animated,
  Image,
  Alert
} from 'react-native';

import Enemy from './app/components/Enemy';

var deviceWidth = Dimensions.get('window').width;

export default class react_native_basic_game extends Component {
  
  constructor (props){
    super(props);
      this.state = this.getInitialState();
  }

  getInitialState(){
    return {
        movePlayerVal: new Animated.Value(40),
        playerSide: 'left',
        points: 0,

        moveEnemyVal: new Animated.Value(0),
        enemyStartposX: 0,
        enemySide: 'left',
        enemySpeed: 4200,

        gameOver: false
      };
  }

  render() {
    return (
      <Image source={require('./app/img/background.jpg')} style={styles.container}>

        <View style={{ flex: 1, alignItems: 'center', marginTop: 80}}>
          <View style={styles.points}>
            <Text style={{ fontWeight: 'bold', fontSize: 40}}>{this.state.points}</Text>
          </View>
        </View>  

        <Animated.Image source={require('./app/img/car.png')}
        style={{height: 100,
          width: 100,
          position: 'absolute',
          zIndex: 1,
          bottom: 120,
          resizeMode: 'stretch',
          transform: [
            { translateX: this.state.movePlayerVal }
          ]}}>
        </Animated.Image>

        <Enemy
          enemyImg={require('./app/img/enemy1.png')}
          enemyStartposX={this.state.enemyStartposX}
          moveEnemyVal={this.state.moveEnemyVal}  
        ></Enemy>

        <View style={styles.controls}>
            <Text style={styles.left} onPress={ () => this.movePlayer('left')}>{'<--'}</Text>
            <Text style={styles.right} onPress={ () => this.movePlayer('right')}>{'-->'}</Text>
        </View>

      </Image>
    );
  }

  getRandomEnemy() {
    return './app/img/enemy'+ Math.floor(Math.random() * 2)+ '.png';
  }
  movePlayer(direction){
    if(direction == 'right'){
      this.setState({playerSide: 'right'});

      Animated.spring(
        this.state.movePlayerVal,
        {
          toValue: Dimensions.get('window').width -140,
          tension: 120,
        }
      ).start();
    } else if(direction == 'left'){
      this.setState({playerSide: 'left'});
      Animated.spring(
        this.state.movePlayerVal,
        {
          toValue: 40,
          tension: 120,
        }
      ).start();
    }
  }

  componentDidMount(){
    this.animateEnemy();
  }

  animateEnemy(){
    this.state.moveEnemyVal.setValue(-100);
    var windowH = Dimensions.get('window').height;

    var r = Math.floor(Math.random() *2) + 1;
    if(r==2){
      r=40;
      this.setState({
        enemySide: 'left'
      })
    }else{
      r=Dimensions.get('window').width - 140;
      this.setState({
        enemySide: 'right'
      })
    }

    this.setState({enemyStartposX: r})

    var refresh;
    refresh = setInterval( ()=> {
      if(this.state.moveEnemyVal._value > windowH - 280
        && this.state.moveEnemyVal._value < windowH - 180
        && this.state.playerSide == this.state.enemySide
      ){
        clearInterval(refresh)
        this.setState({gameOver: true});
        this.gameOver();
      }
    }, 50);

    setInterval( ()=> {
      this.setState({enemySpeed: this.state.enemySpeed -50})
    }, 20000);

    Animated.timing(
      this.state.moveEnemyVal,
      {
        toValue: Dimensions.get('window').height,
        duration: this.state.enemySpeed
      }
    ).start(event => {
      if(event.finished && this.state.gameOver == false){
        clearInterval(refresh);
        this.setState({points: ++this.state.points});
        this.animateEnemy();
      }
    });
  }

  gameOver(){
    Alert.alert(
      'Game Over',
      'Looser!',
      [
        {text: 'OK', onPress: () => this.resetGame()},
      ],
      { cancelable: false }
    )
  }

  resetGame(){
    this.setState(this.getInitialState());
    this.animateEnemy();
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    resizeMode: 'cover',
    width: deviceWidth,
    height: deviceWidth / 2
  },
  controls: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 30
  },
  right: {
    flex: 1,
    color: '#fff',
    margin: 0,
    fontSize: 60,
    fontWeight: 'bold',
    textAlign: 'left',
    marginLeft: 35
  },
  left: {
    flex: 1,
    color: '#fff',
    fontSize: 60,
    fontWeight: 'bold',
    textAlign: 'right'
  },
  points: {
    width: 80,
    height: 80,
    backgroundColor: "#fff",
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

AppRegistry.registerComponent('react_native_basic_game', () => react_native_basic_game);
