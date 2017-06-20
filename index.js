/**
 * @flow
 */
import React from 'react';
import {
  StyleSheet,
  Animated,
  Text,
  View,
  Button,
  ScrollView,
  NativeModules,
  findNodeHandle,
} from 'react-native';
const { UIManager } = NativeModules;

type Props = {
  duration?: number,
  loop?: boolean,
  marqueeOnStart?: boolean,
  marqueeResetDelay?: number,
  marqueeDelay?: number,
};

type DefaultProps = {
  duration: number,
  loop: boolean,
  marqueeOnStart: boolean,
  marqueeResetDelay: number,
  marqueeDelay: number,
};

type State = {
  animating: boolean
};

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

export default class MarqueeText extends React.PureComponent<DefaultProps, Props, State> {
  props: Props;
  state: State;

  static defaultProps = {
    duration: 3000,
    loop: false,
    marqueeOnStart: false,
    marqueeDelay: 0,
    marqueeResetDelay: 0,
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

  async componentDidMount() {
    await delay(this.props.marqueeDelay);
    await this.calculateMetrics();
    console.log(this.distance, this.contentFits);
    if (!this.contentFits && this.props.marqueeOnStart) {
      this.start();
    }
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

  async resetAnimation() {
    await delay(this.props.marqueeResetDelay);

    this.setState({
      animating: false
    });

    this.startAnimation();
  }

  start() {
    const { duration, loop } = this.props;

    if (!this.state.animating) {
      this.animatedValue.setValue(0);
      this.setState({ animating: true });

      Animated.timing(this.animatedValue, {
        toValue: 1,
        duration: duration
      }).start(({ finished }) => {
        if (finished) {
          if (loop) {
            this.resetAnimation();
          } else {
            this.stop();
          }
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
    const { width, height } = StyleSheet.flatten(style);

    return (
      <View style={{ backgroundColor: 'skyblue', overflow: 'hidden', height, width}}>
        <Text numberOfLines={1} style={style} {...rest}>{children}</Text>
        <Animated.ScrollView
          ref={c => { this.scrollViewRef = c; }}
          style={{
            position: 'absolute',
            top: 0,
            left: positionLeft,
            right: 0,
            bottom: 0,
            zIndex: animating ? 0 : -1
          }}
          contentContainerStyle={[{ backgroundColor: 'green' }]}
          horizontal
          scrollEnabled={false}
        >
          <Text
            ref={c => { this.textRef = c; }}
            numberOfLines={1}
            {...rest}
            style={[style, { width: null }]}
          >
            {children}
          </Text>
        </Animated.ScrollView>
      </View>
    );
  }
}
