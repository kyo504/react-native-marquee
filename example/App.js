/**
 * @flow
 */
import React from 'react';
import { StyleSheet, View, Button, Text, Animated } from 'react-native';
import MarqueeText from 'react-native-marquee';

export default class MarqueeTextSample extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      text: 'Resets the marquee and restarts it after `marqueeDelay` millisecons.',
    };
  }

  render() {
    return (
      <View style={styles.container}>

          <MarqueeText
            style={{ fontSize: 24 }}
            duration={3000}
            marqueeOnStart
            loop
            marqueeDelay={1000}
            marqueeResetDelay={1000}
          >
            Lorem Ipsum is simply dummy text of the printing and typesetting industry and typesetting industry.
          </MarqueeText>
        </View>
        <View style={{ marginVertical: 20 }}>
          <Text>Marquee On Start</Text>
          <MarqueeText
            style={{ fontSize: 24 }}
            duration={3000}
            marqueeOnStart
            loop
            marqueeDelay={1000}
            marqueeResetDelay={1000}
          >
            {this.state.text}
          </MarqueeText>
          <View style={{ flexDirection: 'row' }}>
            <Button
              title="Change Text"
              onPress={() => this.setState({ text: 'Lorem Ipsum is simply dummy' })}
            />
          </View>
        </View>
        <View style={{ marginVertical: 20 }}>
          <Text>Marquee Text With Controls</Text>
          <MarqueeText ref={c => (this.marqueeTextRef0 = c)}>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry.
          </MarqueeText>
          <View style={{ flexDirection: 'row' }}>
            <Button title="Start" onPress={() => this.marqueeTextRef0.startAnimation()} />
            <Button title="Stop" onPress={() => this.marqueeTextRef0.stopAnimation()} />
          </View>
        </View>
        <View style={{ marginVertical: 20 }}>
          <Text>Marquee Text With Controls</Text>
          <MarqueeText style={{ fontSize: 20 }} ref={c => (this.marqueeTextRef = c)}>
            Lorem Ipsum is simply dummy text of
          </MarqueeText>
          <View style={{ flexDirection: 'row' }}>
            <Button title="Start" onPress={() => this.marqueeTextRef.startAnimation()} />
            <Button title="Stop" onPress={() => this.marqueeTextRef.stopAnimation()} />
          </View>
        </View>
        <View>
          <Text>Fixed Text Width</Text>
          <MarqueeText style={{ fontSize: 16, width: 150 }} ref={c => (this.marqueeTextRef2 = c)}>
            Lorem Ipsum is simply dummy text of
          </MarqueeText>
          <View style={{ flexDirection: 'row' }}>
            <Button title="Start" onPress={() => this.marqueeTextRef2.startAnimation()} />
            <Button title="Stop" onPress={() => this.marqueeTextRef2.stopAnimation()} />
          </View>
        </View>
        <Text style={{ backgroundColor: 'red' }}>Lorem Ipsum is simply dummy text of</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
});
