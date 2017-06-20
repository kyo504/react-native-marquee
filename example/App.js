/**
 * @flow
 */
import React from 'react';
import { StyleSheet, View, Button, Text, Animated } from 'react-native';
import MarqueeText from 'react-native-marquee-text';

export default class MarqueeTextSample extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={{ marginVertical: 20 }}>
          <Text>Marquee Text With Loop</Text>
          <MarqueeText
            style={{ fontSize: 24, backgroundColor: 'white' }}
            ref={c => {
              this.ref = c;
            }}
            duration={6000}
            marqueeOnStart
            loop
            marqueeDelay={1000}
            marqueeResetDelay={1000}
          >
            Lorem Ipsum is simply dummy text of the printing and typesetting industry.
          </MarqueeText>
        </View>
        <View style={{ marginVertical: 20 }}>
          <Text>Marquee Text With Controls</Text>
          <MarqueeText
            style={{ fontSize: 16 }}
            ref={c => {
              this.marqueeTextRef = c;
            }}
          >
            Lorem Ipsum is simply dummy text of the printing and typesetting industry.
          </MarqueeText>
          <View style={{ flexDirection: 'row' }}>
            <Button title="Start" onPress={() => this.marqueeTextRef.startAnimation()} />
            <Button title="Stop" onPress={() => this.marqueeTextRef.stopAnimation()} />
          </View>
        </View>
        <View>
          <Text>Short Text</Text>
          <MarqueeText
            style={{ fontSize: 16, width: 150 }}
            ref={c => {
              this.marqueeTextRef2 = c;
            }}
          >
            Lorem Ipsum is simply dummy text of 
          </MarqueeText>
          <View style={{ flexDirection: 'row' }}>
            <Button title="Start" onPress={() => this.marqueeTextRef2.startAnimation()} />
            <Button title="Stop" onPress={() => this.marqueeTextRef2.stopAnimation()} />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
  }
});
