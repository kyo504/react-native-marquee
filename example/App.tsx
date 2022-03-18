import React, { Component } from 'react';
import { StyleSheet, View, Button, Text } from 'react-native';
import MarqueeText from 'react-native-marquee';

interface IState {
  text: string;
}

export default class MarqueeTextSample extends Component<{}, IState> {
  private marqueeTextRef0 = React.createRef<MarqueeText>();
  private marqueeTextRef1 = React.createRef<MarqueeText>();
  private marqueeTextRef2 = React.createRef<MarqueeText>();

  state: IState = {
    text: 'Resets the marquee and restarts it after `marqueeDelay` milliseconds.',
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={{ marginVertical: 20 }}>
          <MarqueeText
            style={{ fontSize: 24 }}
            duration={3000}
            marqueeOnStart={true}
            loop={true}
            marqueeDelay={1000}
            marqueeResetDelay={1000}
          >
            Lorem Ipsum is simply dummy text of the printing and typesetting industry and
            typesetting industry.
          </MarqueeText>
        </View>
        <View style={{ marginVertical: 20 }}>
          <Text>Marquee On Start</Text>
          <MarqueeText
            style={{ fontSize: 24 }}
            duration={3000}
            marqueeOnStart={true}
            loop={true}
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
          <MarqueeText ref={this.marqueeTextRef0}>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry.
          </MarqueeText>
          <View style={{ flexDirection: 'row' }}>
            <Button title="Start" onPress={() => this.marqueeTextRef0.current?.startAnimation()} />
            <Button title="Stop" onPress={() => this.marqueeTextRef0.current?.stopAnimation()} />
          </View>
        </View>
        <View style={{ marginVertical: 20 }}>
          <Text>Marquee Text With Controls</Text>
          <MarqueeText style={{ fontSize: 20 }} ref={this.marqueeTextRef1}>
            Lorem Ipsum is simply dummy text of
          </MarqueeText>
          <View style={{ flexDirection: 'row' }}>
            <Button title="Start" onPress={() => this.marqueeTextRef1.current?.startAnimation()} />
            <Button title="Stop" onPress={() => this.marqueeTextRef1.current?.stopAnimation()} />
          </View>
        </View>
        <View style={{ marginVertical: 20 }}>
          <Text>Fixed Text Width</Text>
          <MarqueeText style={{ fontSize: 16, width: 150 }} ref={this.marqueeTextRef2}>
            Lorem Ipsum is simply dummy text of
          </MarqueeText>
          <View style={{ flexDirection: 'row' }}>
            <Button title="Start" onPress={() => this.marqueeTextRef2.current?.startAnimation()} />
            <Button title="Stop" onPress={() => this.marqueeTextRef2.current?.stopAnimation()} />
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
