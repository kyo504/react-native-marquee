import React, { Ref, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  findNodeHandle,
  NativeModules,
  PixelRatio,
  ScrollView,
  StyleSheet,
  Text,
  TextProps,
  View,
} from 'react-native';

const { UIManager } = NativeModules;

export interface MarqueeTextProps extends TextProps {
  /**
   * A flag whether to start marquee animation right after render
   */
  marqueeOnStart?: boolean;
  /**
   * Speed calculated as pixels/second
   */
  speed?: number;
  /**
   * A flag whether to loop marquee animation or not
   */
  loop?: boolean;
  /**
   * Duration to delay the animation after render, in milliseconds
   */
  delay?: number;
  /**
   * A callback for when the marquee finishes animation and stops
   */
  onMarqueeComplete?: () => void;
}

export interface MarqueeTextHandles {
  start: () => void;
  stop: () => void;
}

function wait(duration: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(resolve, duration);
  });
}

const createAnimation = (
  animatedValue: Animated.Value,
  config: {
    toValue: number;
    duration: number;
    loop: boolean;
    delay: number;
  },
): Animated.CompositeAnimation => {
  const baseAnimation = Animated.timing(animatedValue, {
    easing: Easing.linear,
    useNativeDriver: true,
    ...config,
  });

  if (config.loop) {
    return Animated.loop(Animated.sequence([baseAnimation, Animated.delay(1000)]));
  }

  return baseAnimation;
};

const MarqueeText = (props: MarqueeTextProps, ref: Ref<MarqueeTextHandles>): JSX.Element => {
  const {
    style,
    marqueeOnStart = true,
    speed = 1,
    loop = true,
    delay = 0,
    onMarqueeComplete,
    children,
    ...restProps
  } = props;

  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState(false);

  const containerWidth = useRef<number | null>(null);
  const marqueeTextWidth = useRef<number | null>(null);
  const animatedValue = useRef<Animated.Value>(new Animated.Value(0));
  const textRef = useRef<typeof Animated.Text & Text>(null);
  const containerRef = useRef<ScrollView>(null);
  const animation = useRef<Animated.CompositeAnimation>();
  const config = useRef<{
    marqueeOnStart: boolean;
    speed: number;
    loop: boolean;
    delay: number;
  }>({
    marqueeOnStart,
    speed,
    loop,
    delay,
  });

  const stopAnimation = useCallback(() => {
    animation.current?.reset();
    setIsAnimating(false);
    invalidateMetrics();
  }, []);

  const startAnimation = useCallback(async (): Promise<void> => {
    setIsAnimating(true);

    await wait(100);

    await calculateMetrics();

    if (!containerWidth.current || !marqueeTextWidth.current) {
      return;
    }

    const distance = marqueeTextWidth.current - containerWidth.current;
    if (distance < 0) {
      return;
    }

    animation.current = createAnimation(animatedValue.current, {
      ...config.current,
      toValue: -distance,
      duration: PixelRatio.getPixelSizeForLayoutSize(marqueeTextWidth.current) / config.current.speed,
    });

    animation.current.start((): void => {
      setIsAnimating(false);
      onMarqueeComplete?.();
    });
  }, [onMarqueeComplete]);

  useImperativeHandle(ref, () => {
    return {
      start: () => {
        startAnimation();
      },
      stop: () => {
        stopAnimation();
      },
    };
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!config.current.marqueeOnStart) {
      return;
    }

    stopAnimation();
    startAnimation();
  }, [children, startAnimation, stopAnimation]);

  const calculateMetrics = async (): Promise<void> => {
    try {
      if (!containerRef.current || !textRef.current) {
        return;
      }

      const measureWidth = (component: ScrollView | Text): Promise<number> =>
        new Promise(resolve => {
          UIManager.measure(findNodeHandle(component), (x: number, y: number, w: number) => {
            return resolve(w);
          });
        });

      const [wrapperWidth, textWidth] = await Promise.all([
        measureWidth(containerRef.current),
        measureWidth(textRef.current),
      ]);

      containerWidth.current = wrapperWidth;
      marqueeTextWidth.current = textWidth;
    } catch (error) {
      // console.warn(error);
    }
  };

  // Null distance is the special value to allow recalculation
  const invalidateMetrics = () => {
    containerWidth.current = null;
    marqueeTextWidth.current = null;
  };

  const { width, height } = StyleSheet.flatten(style || {});

  return (
    <>
      {!isMounted ? null : (
        <View style={[styles.container, { width, height }]}>
          <Text numberOfLines={1} {...restProps} style={[style, { opacity: isAnimating ? 0 : 1 }]}>
            {children}
          </Text>
          <ScrollView
            ref={containerRef}
            style={StyleSheet.absoluteFillObject}
            showsHorizontalScrollIndicator={false}
            horizontal={true}
            scrollEnabled={false}
            onContentSizeChange={calculateMetrics}
          >
            <Animated.Text
              ref={textRef}
              numberOfLines={1}
              {...restProps}
              style={[
                style,
                {
                  transform: [{ translateX: animatedValue.current }],
                  opacity: isAnimating ? 1 : 0,
                  width: '100%',
                },
              ]}
            >
              {children}
            </Animated.Text>
          </ScrollView>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
});

export default React.forwardRef(MarqueeText);
