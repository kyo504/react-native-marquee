import React from 'react';
import {
  StyleSheet,
  Animated,
  Text,
  View,
  Button,
  ScrollView,
  NativeModules,
  findNodeHandle
} from 'react-native';
const { UIManager } = NativeModules;

type Props = {
  duration: number,
  loop: boolean,
  autostart: boolean
};

type DefaultProps = {
  duration: number,
  loop: boolean,
  autostart: boolean
};

type State = {
  animating: boolean
};

class MarqueeText extends React.PureComponent<DefaultProps, Props, State> {
  props: Props;
  state: State;

  static defaultProps = {
    duration: 3000,
    loop: true,
    autostart: false
  };

  constructor() {
    super();

    this.animatedValue = new Animated.Value(0);

    this.state = {
      animating: false
    };

    this.distance = 0;
    this.contentFits = true;
    this.textRef = null;
    this.scrollViewRef = null;
  }

  componentDidMount() {
    setTimeout(() => {
      this.calculateMetrics();
    }, 0);
  }

  componentDidUpdate() {
    setTimeout(() => {
      this.calculateMetrics();
    }, 0);
  }

  componentWillUnmount() {
    if (this.state.animating) {
      this.stop();
    }
  }

  startAnimation() {
    if (this.state.animating || this.contentFits) {
      return;
    }

    this.start();
  }

  stopAnimation() {
    this.stop();
  }

  resetAnimation() {
    this.setState({
      animating: false
    });

    this.startAnimation();
  }

  start() {
    if (!this.state.animating) {
      this.animatedValue.setValue(0);
      this.setState({ animating: true }, () => {
        if (this.state.animating) {
          Animated.timing(this.animatedValue, {
            toValue: 1,
            duration: this.props.duration
          }).start(({ finished }) => {
            if (finished) {
              if (this.props.loop) {
                this.resetAnimation();
              } else {
                this.stop();
              }
            }
          });
        }
      });
    }
  }

  stop() {
    this.animatedValue.setValue(0);
    this.setState({ animating: false });
  }

  shouldAnimate(distance) {
    return distance > 0;
  }

  async calculateMetrics() {
    this.distance = await this.calculateDistance();
    this.contentFits = !this.shouldAnimate(this.distance);

    console.log(`Distance: ${this.distance}, contentFits: ${this.contentFits}`);
  }

  async calculateDistance() {
    const asyncMethod = function(node) {
      return new Promise(resolve => {
        UIManager.measure(findNodeHandle(node), function(x, y, w, h, ox, oy) {
          console.log('Width: ' + w);
          return resolve(w);
        });
      });
    };

    const results = await Promise.all([asyncMethod(this.scrollViewRef), asyncMethod(this.textRef)]);
    return results[1] - results[0];
  }

  render() {
    const { children, style, ...rest } = this.props;
    const { animating } = this.state;
    const positionLeft = this.animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -this.distance]
    });

    return (
      <View style={{ backgroundColor: 'skyblue', overflow: 'hidden' }}>
        <Animated.ScrollView
          ref={c => {
            this.scrollViewRef = c;
          }}
          style={{
            position: 'absolute',
            top: 0,
            left: positionLeft,
            right: 0,
            bottom: 0
          }}
          contentContainerStyle={[{ backgroundColor: 'green' }]}
          horizontal
          scrollEnabled={false}
        >
          <Text
            ref={c => {
              this.textRef = c;
            }}
            style={style}
            numberOfLines={1}
            {...rest}
          >
            {children}
          </Text>
        </Animated.ScrollView>
        <Text
          numberOfLines={1}
          {...rest}
          style={[style, { backgroundColor: 'yellow', zIndex: animating ? -1 : 0 }]}
        >
          {children}
        </Text>
      </View>
    );
  }
}

export default class MarqueeTextSample extends React.Component {
  render() {
    return (
      <View style={styles.container}>
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
        <MarqueeText
          style={{ fontSize: 16 }}
          ref={c => {
            this.marqueeTextRef2 = c;
          }}
        >
          Lorem Ipsum is simplyaaa
        </MarqueeText>
        <View style={{ flexDirection: 'row' }}>
          <Button title="Start" onPress={() => this.marqueeTextRef2.startAnimation()} />
          <Button title="Stop" onPress={() => this.marqueeTextRef2.stopAnimation()} />
        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
