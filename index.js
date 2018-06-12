/**
 * @flow
 */
import React, { PureComponent } from 'react';
import {
  StyleSheet,
  Animated,
  Easing,
  Text,
  View,
  ScrollView,
  NativeModules,
  findNodeHandle,
} from 'react-native';
import type { StyleObj } from '../../node_modules/react-native/Libraries/StyleSheet/StyleSheetTypes';

const { UIManager } = NativeModules;

type Props = {
  /**
   * style
   */
  style?: StyleObj,
  /**
   * Number of milliseconds until animation finishes from start.
   */
  duration?: number,
  /**
   * Easing function to define animation curve.
   */
  easing?: Function,
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
  onMarqueeComplete?: Function,
  /**
   * Text passed
   */
  children: string,
  /**
   * Set this truen if you want to use native driver
   */
  useNativeDriver?: boolean,
};

type DefaultProps = {
  style: StyleObj,
  duration: number,
  easing: Function,
  loop: boolean,
  marqueeOnStart: boolean,
  marqueeResetDelay: number,
  marqueeDelay: number,
  onMarqueeComplete: Function,
};

type State = {
  animating: boolean,
};

export default class MarqueeText extends PureComponent<DefaultProps, Props, State> {
  props: Props;
  state: State;

  distance: ?number;
  contentFits: boolean;
  animatedValue: Object;
  textRef: ?Text;
  containerRef: ?ScrollView;
  timer: ?number;

  static defaultProps = {
    style: {},
    duration: 3000,
    easing: Easing.inOut(Easing.ease),
    loop: false,
    marqueeOnStart: false,
    marqueeDelay: 0,
    marqueeResetDelay: 0,
    onMarqueeComplete: () => {},
    useNativeDriver: true,
  };

  constructor(props: Props) {
    super(props);

    this.animatedValue = new Animated.Value(0);
    this.contentFits = false;
    this.distance = null;
    this.textRef = null;
    this.containerRef = null;

    this.state = {
      animating: false,
    };

    this.invalidateMetrics();
  }

  componentDidMount() {
    const { marqueeDelay } = this.props;
    if (this.props.marqueeOnStart) {
      this.startAnimation(marqueeDelay);
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    if (this.props.children !== nextProps.children) {
      this.invalidateMetrics();
      this.resetAnimation();
    }
  }

  componentWillUnmount() {
    if (this.state.animating) {
      this.stopAnimation();
    }
    this.clearTimeout();
  }

  startAnimation(timeDelay: number) {
    if (this.state.animating) {
      return;
    }

    this.start(timeDelay);
  }

  stopAnimation() {
    this.stop();
  }

  /**
   * Resets the marquee and restarts it after `marqueeDelay` millisecons.
   */
  resetAnimation() {
    const { marqueeDelay } = this.props
    const marqueeResetDelay = Math.max(100, this.props.marqueeResetDelay);
    this.setTimeout(() => {
      this.animatedValue.setValue(0);
      this.setState({ animating: false }, () => {
        this.startAnimation(marqueeDelay)
      });
    }, marqueeResetDelay)
  }

  start(timeDelay: number) {
    const { duration, easing, loop, onMarqueeComplete, useNativeDriver } = this.props;

    const callback = () => {
      this.setState({ animating: true });

      this.setTimeout(() => {
        this.calculateMetrics();

        if (!this.contentFits) {
          Animated.timing(this.animatedValue, {
            toValue: -this.distance,
            duration: duration,
            easing: easing,
            useNativeDriver,
          }).start(({ finished }) => {
            if (finished) {
              if (loop) {
                this.resetAnimation();
              } else {
                this.stop();
                onMarqueeComplete();
              }
            }
          });
        }
      }, 100);
    };

    this.setTimeout(callback, timeDelay);
  }

  stop() {
    this.animatedValue.setValue(0);
    this.setState({ animating: false });
  }

  shouldAnimate(distance: number) {
    return distance > 0;
  }

  async calculateMetrics() {
    try {
      const measureWidth = node =>
        new Promise(resolve => {
          UIManager.measure(findNodeHandle(node), (x, y, w) => {
            // console.log('Width: ' + w);
            return resolve(w);
          });
        });

      const [containerWidth, textWidth] = await Promise.all([
        measureWidth(this.containerRef),
        measureWidth(this.textRef),
      ]);

      this.distance = textWidth - containerWidth;
      this.contentFits = !this.shouldAnimate(this.distance);

      return [];
      // console.log(`distance: ${this.distance}, contentFits: ${this.contentFits}`);
    } catch (error) {
      console.warn(error);
    }
  }

  invalidateMetrics() {
    // Null distance is the special value to allow recalculation
    this.distance = null;
    // Assume the marquee does not fit until calculations show otherwise
    this.contentFits = false;
  }

  /**
   * Clears the timer
   */
  clearTimeout() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
      // console.log("Currently running timeout is cleared!!!");
    }
  }

  /**
   * Starts a new timer
    */
  setTimeout(fn: Function, time: number = 0) {
    this.clearTimeout();
    this.timer = setTimeout(fn, time);
  }

  render() {
    const { children, style, ...rest } = this.props;
    const { animating } = this.state;
    const { width, height } = StyleSheet.flatten(style);

    return (
      <View style={[styles.container, { width, height }]}>
        <Text numberOfLines={1} {...rest} style={[ style, { opacity: animating ? 0 : 1 }]}>
          {children}
        </Text>
        <ScrollView
          ref={c => (this.containerRef = c)}
          style={StyleSheet.absoluteFillObject}
          display={animating ? 'flex' : 'none'}
          showsHorizontalScrollIndicator={false}
          horizontal
          scrollEnabled={false}
          onContentSizeChange={() => this.calculateMetrics()}
        >
          <Animated.Text
            ref={c => (this.textRef = c)}
            numberOfLines={1}
            {...rest}
            style={[style, { transform: [{ translateX: this.animatedValue }], width: null }]}
          >
            {children}
          </Animated.Text>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
});
