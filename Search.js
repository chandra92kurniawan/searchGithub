/**
 * Created by chandra on 17/01/2018.
 */
import React from 'react';
import {View,TextInput,Text,ListView,Linking,TouchableOpacity} from 'react-native';
export default class Search extends React.Component{
    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = { text: '',results:[],
            rowData: ds.cloneWithRows([]),
        };
    }
    getDataGitHub(){
        //console.log(query);
        let q=this.state.text
        return fetch('https://api.github.com/search/repositories?q='+q+'&sort=stars&order=desc',{
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);
                this.setState({rowData: this.state.rowData.cloneWithRows(responseJson.items),})
            })
            .catch((error) => {
                console.error(error);
            });
    }
    renderData=(data)=>{
        return(
            <TouchableOpacity onPress={()=>{
                Linking.canOpenURL(data.html_url).then(supported => {
                    if (supported) {
                        Linking.openURL(data.html_url);
                    } else {
                        console.log('Don\'t know how to open URI: ' + data.html_url);
                    }
                    return false
                });
            }} style={{minHeight:40,margin:10,borderWidth:1,borderColor:'gray',padding:10,backgroundColor:'gray',borderRadius:5}}>
                <Text style={{color:'white'}}>{data.description}</Text>
            </TouchableOpacity>
        )
    }
    render(){
        return(
            <View style={style.container}>
                <View style={{flexDirection:'row',margin:15}}>
                    <TextInput
                        style={{height: 40,width:280,borderColor:'black',borderWidth:1,borderRadius:10,padding:10}}
                        onChangeText={(text) => {
                            this.setState({text});

                        }
                        }
                        value={this.state.text}
                        underlineColorAndroid={'transparent'}
                    />
                    <TouchableOpacity onPress={()=>{
                        this.getDataGitHub();
                    }} style={{height:40,marginLeft:10,borderWidth:1,borderColor:'blue',alignItems:'center',alignContent:'center',justifyContent:'center',padding:10,backgroundColor:'blue'}}>
                        <Text style={{color:'white'}}>Search</Text>
                    </TouchableOpacity>
                </View>
                <ListView
                    dataSource={this.state.rowData}
                    renderRow={this.renderData}
                    enableEmptySections={true}
                />
            </View>
        )
    }
}
const style={
  container:{
      flex:1
  }
};