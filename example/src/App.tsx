import React, { Component } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import MarqueeText, { MarqueeTextHandles } from 'react-native-marquee';

interface IState {
  text: string;
}

export default class MarqueeTextSample extends Component<{}, IState> {
  private marqueeTextRef0 = React.createRef<MarqueeTextHandles>();
  private marqueeTextRef1 = React.createRef<MarqueeTextHandles>();
  private marqueeTextRef2 = React.createRef<MarqueeTextHandles>();

  state: IState = {
    text: 'Resets the marquee and restarts it',
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.itemContainer}>
          <Text>Basic sample(with default options)</Text>

          <MarqueeText style={styles.text}>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry and typesetting industry.
          </MarqueeText>
        </View>

        <View style={styles.itemContainer}>
          <Text>Basic sample</Text>

          <MarqueeText style={styles.text} speed={0.1} delay={1000}>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry and typesetting industry.
          </MarqueeText>
        </View>

        <View style={styles.itemContainer}>
          <Text>Marquee On Start</Text>
          <MarqueeText style={{ fontSize: 24 }} speed={0.5} marqueeOnStart={true} loop={true} delay={1000}>
            {this.state.text}
          </MarqueeText>
          <View style={{ flexDirection: 'row' }}>
            <Button title="Change Text" onPress={() => this.setState({ text: 'Lorem Ipsum is simply dummy' })} />
          </View>
        </View>

        <View style={styles.itemContainer}>
          <Text>Marquee Text With Controls</Text>
          <MarqueeText ref={this.marqueeTextRef0}>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry.
          </MarqueeText>
          <View style={{ flexDirection: 'row' }}>
            <Button title="Start" onPress={() => this.marqueeTextRef0.current?.start()} />
            <Button title="Stop" onPress={() => this.marqueeTextRef0.current?.stop()} />
          </View>
        </View>

        <View style={styles.itemContainer}>
          <Text>Marquee Text With Controls</Text>
          <MarqueeText style={{ fontSize: 20 }} ref={this.marqueeTextRef1}>
            Lorem Ipsum is simply dummy text of
          </MarqueeText>
          <View style={{ flexDirection: 'row' }}>
            <Button title="Start" onPress={() => this.marqueeTextRef1.current?.start()} />
            <Button title="Stop" onPress={() => this.marqueeTextRef1.current?.stop()} />
          </View>
        </View>

        <View style={styles.itemContainer}>
          <Text>Fixed Text Width</Text>
          <MarqueeText style={{ fontSize: 16, width: 150 }} ref={this.marqueeTextRef2}>
            Lorem Ipsum is simply dummy text of
          </MarqueeText>
          <View style={{ flexDirection: 'row' }}>
            <Button title="Start" onPress={() => this.marqueeTextRef2.current?.start()} />
            <Button title="Stop" onPress={() => this.marqueeTextRef2.current?.stop()} />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },

  itemContainer: {
    marginVertical: 20,
  },

  text: {
    fontSize: 24,
  },
});
