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
  findNodeHandle
} from 'react-native';
const { UIManager } = NativeModules;

type Props = {
  duration?: number,
  loop?: boolean,
  marqueeOnStart?: boolean,
  marqueeResetDelay?: number,
  marqueeDelay?: number
};

type DefaultProps = {
  duration: number,
  loop: boolean,
  marqueeOnStart: boolean,
  marqueeResetDelay: number,
  marqueeDelay: number
};

type State = {
  animating: boolean,
  distance: number
};

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

export default class MarqueeText extends React.PureComponent<DefaultProps, Props, State> {
  props: Props;
  state: State;

  static defaultProps = {
    duration: 3000,
    loop: false,
    marqueeOnStart: false,
    marqueeDelay: 200,
    marqueeResetDelay: 0
  };

  constructor(props) {
    super(props);

    this.animatedValue = new Animated.Value(0);
    this.contentFits = true;
    this.textRef = null;
    this.scrollViewRef = null;

    this.state = {
      animating: false,
      distance: 0
    };
  }

  async componentDidMount() {
    await delay(200);
    if (!this.contentFits && this.props.marqueeOnStart) {
      this.start();
    }
  }

  componentWillReceiveProps(nextProps) {
    const { children } = this.props;
    if (this.props.children !== nextProps.children) {
      this.stopAnimation();
    }
  }

  async componentWillUpdate() {
    await delay(200)
    this.calculateMetrics();
    if (this.props.marqueeOnStart) {
      this.startAnimation(this.props.marqueeDelay);
    }
  }

  componentWillUnmount() {
    if (this.state.animating) {
      this.stop();
    }
  }

  startAnimation(delay) {
    if (this.state.animating || this.contentFits) {
      return;
    }

    this.start(delay);
  }

  stopAnimation() {
    this.stop();
  }

  async resetAnimation() {
    await delay(this.props.marqueeResetDelay);

    this.setState({
      animating: false
    });

    this.startAnimation(this.props.marqueeDelay);
  }

  async start(timeDelay) {
    const { duration, loop } = this.props;

    if (!this.state.animating) {
      this.animatedValue.setValue(0);
      this.setState({ animating: true });

      await delay(timeDelay);

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
    const distance = await this.calculateDistance();
    this.contentFits = !this.shouldAnimate(distance);

    this.setState({ distance });

    console.log(`Distance: ${distance}, contentFits: ${this.contentFits}`);
  }

  async calculateDistance() {
    const asyncMethod = function(node) {
      return new Promise(resolve => {
        UIManager.measure(findNodeHandle(node), function(x, y, w, h, ox, oy) {
          // console.log('Width: ' + w);
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
      outputRange: [0, -this.state.distance]
    });
    const { width, height } = StyleSheet.flatten(style);

    return (
      <View style={{ backgroundColor: 'skyblue', overflow: 'hidden', height, width }}>
        <ScrollView
          ref={c => {
            this.scrollViewRef = c;
          }}
          contentContainerStyle={[{ backgroundColor: 'green' }]}
          showsHorizontalScrollIndicator={false}
          horizontal
          scrollEnabled={false}
          onContentSizeChange={(width, height) => this.calculateMetrics()}
        >
          <Animated.Text
            ref={c => {
              this.textRef = c;
            }}
            numberOfLines={1}
            {...rest}
            style={[style, { left: positionLeft, width: null }]}
          >
            {children}
          </Animated.Text>
        </ScrollView>
        {!animating
          ? <Text
              numberOfLines={1}
              style={[
                {
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'white'
                },
                style
              ]}
              {...rest}
            >
              {children}
            </Text>
          : null}
      </View>
    );
  }
}
