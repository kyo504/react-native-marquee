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
  /**
   * Number of milliseconds until animation finishes from start.
   */
  duration?: number,
  /**
   * Set this true when animation repeats.
   */
  loop?: boolean,
  /**
   * Set this true while waiting for new data from a refresh.
   */
  marqueeOnStart?: boolean,
  /**
   * Number of milliseconds to wait before resetting the marquee position after it finishes.
   */
  marqueeResetDelay?: number,
  /**
   * Number of milliseconds to wait before starting or restarting marquee.
   */
  marqueeDelay?: number,
  /**
   * Callback function for when the marquee completes its animation
   */
  onMarqueeComplete?: () => void
};

type DefaultProps = {
  duration: number,
  loop: boolean,
  marqueeOnStart: boolean,
  marqueeResetDelay: number,
  marqueeDelay: number
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
    marqueeResetDelay: 0
  };

  constructor(props) {
    super(props);

    this.animatedValue = new Animated.Value(0);
    this.textRef = null;
    this.scrollViewRef = null;

    this.state = {
      animating: false
    };

    this.invalidateMetrics();
  }

  async componentDidMount() {
    await delay(0);
    if (this.props.marqueeOnStart) {
      this.start();
    }
  }

  componentWillReceiveProps(nextProps) {
    const { children } = this.props;
    if (this.props.children !== nextProps.children) {
      this.invalidateMetrics();
      this.stopAnimation();
    }
  }

  async componentWillUpdate(prevProps, prevState) {
    if (this.distance === null) {
      this.calculateMetrics();
    }

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

  async start(timeDelay = this.props.marqueeDelay) {
    const { duration, loop, onMarqueeComplete } = this.props;

    if (this.contentFits) {
      return;
    } else if (!this.state.animating) {
      this.animatedValue.setValue(0);

      await delay(timeDelay);
      await this.calculateMetrics();

      if (!this.contentFits) {
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
              onMarqueeComplete && onMarqueeComplete();
            }
          }
        });
      }
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
          // console.log('Width: ' + w);
          return resolve(w);
        });
      });
    };

    const results = await Promise.all([asyncMethod(this.scrollViewRef), asyncMethod(this.textRef)]);
    return Math.floor(results[1] - results[0]);
  }

  invalidateMetrics() {
    // Null distance is the special value to allow recalculation
    this.distance = null;
    // Assume the marquee does not fit until calculations show otherwise
    this.contentFits = false;
  }

  render() {
    const { children, style, ...rest } = this.props;
    const { animating } = this.state;
    const positionLeft = this.animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -this.distance]
    });
    const { width, height } = style ? StyleSheet.flatten(style) : {};

    return (
      <View style={[styles.container, { width, height }]}>
        <ScrollView
          ref={c => {
            this.scrollViewRef = c;
          }}
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
          ? <Text numberOfLines={1} style={[styles.overlayText, style]} {...rest}>
              {children}
            </Text>
          : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden'
  },
  overlayText: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'white'
  }
});
