import React, { Component } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity
} from "react-native";
import { Badge } from "react-native-elements";
import { Ionicons, Octicons, AntDesign, FontAwesome } from "@expo/vector-icons";
import { createStackNavigator } from "react-navigation";
import showContact from "../Controlers/getContacts";
import _ from "lodash";

export default class GetContact extends Component {
  state = {
    contacts: [],
    index: 0,
    loading: true,
    alpha: 0,
    alphasArray: []
  };

  componentDidMount() {
    showContact().then(contact => {
      const alphasArray = _.uniq(contact.map(item => item.firstChar));
      this.setState({
        contacts: contact,
        loading: false,
        alphasArray: alphasArray,
        alpha: alphasArray[0]
      });
    });
  }

  // Needed only to console.log 'alpha'

  // componentDidUpdate() {
  //   console.log(this.state.alphasArray);
  // }

  keyUp = () => {
    if (this.state.index === 0) {
      this.setState({
        index: this.state.contacts.length - 1,
        alpha: this.state.contacts[
          this.state.contacts.length - 1
        ].name.charCodeAt(0)
      });
    } else {
      this.setState({
        index: this.state.index - 1,
        alpha: this.state.contacts[this.state.index - 1].name.charCodeAt(0)
      });
    }
  };

  keyLongUp = () => {
    const unicodeArray = this.state.alphasArray;
    let currentIndex = unicodeArray.indexOf(this.state.alpha);
    let factor = currentIndex > 0 ? currentIndex : unicodeArray.length;

    let nextVal = unicodeArray[factor - 1];
    const index = this.state.contacts.findIndex(
      contact => contact.firstChar === nextVal
    );
    this.setState({
      index: index,
      alpha: nextVal
    });
  };

  keyDown = () => {
    if (this.state.index === this.state.contacts.length - 1) {
      this.setState({
        index: 0,
        alpha: this.state.contacts[0].name.charCodeAt(0)
      });
    } else {
      this.setState({
        index: this.state.index + 1,
        alpha: this.state.contacts[this.state.index + 1].name.charCodeAt(0)
      });
    }
  };

  keyLongDown = () => {
    const unicodeArray = this.state.alphasArray;
    let currentIndex = unicodeArray.indexOf(this.state.alpha);
    let nextVal = unicodeArray[currentIndex + 1];

    if (currentIndex === unicodeArray.length - 1) {
      this.setState({
        index: 0,
        alpha: unicodeArray[0]
      });
    } else {
      const index = this.state.contacts.findIndex(
        contact => contact.firstChar === nextVal
      );

      this.setState({
        index: index,
        alpha: nextVal
      });
    }
    // console.log(this.state.index, this.state.alpha);
  };

  render() {
    const { navigate } = this.props.navigation;

    return (
      <View style={styles.container}>
        <View style={styles.topBottom}>
          <FontAwesome
            accessible={true}
            accessibilityLabel="UP"
            accessibilityHint="click to see the previous number"
            name="caret-up"
            onPress={this.keyUp}
            onLongPress={this.keyLongUp}
            style={styles.upIcon}
          />
        </View>

        <Badge
          containerStyle={{
            backgroundColor: "green"
          }}
          onPress={() => {
            this.props.screenProps.passState(
              this.state.contacts[this.state.index]
            );
            navigate("Home");
          }}
        >
          <Text style={{ fontSize: 25 }}>
            {this.state.loading
              ? "loading...."
              : this.state.contacts[this.state.index].name}
          </Text>
          <Text style={{ fontSize: 25 }}>
            {this.state.loading
              ? "loading...."
              : this.state.contacts[this.state.index].number}
          </Text>
        </Badge>

        <View style={styles.topBottom}>
          <FontAwesome
            accessible={true}
            accessibilityLabel="Down"
            accessibilityHint="click to see the next number"
            name="caret-down"
            onPress={this.keyDown}
            onLongPress={this.keyLongDown}
            style={styles.downIcon}
          />
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  topBottom: {
    height: "40%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f0f0"
  },
  center: {
    height: "20%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f0f0"
  },
  upIcon: {
    fontSize: 350,
    marginBottom: 35
  },
  downIcon: {
    fontSize: 350
  }
});
