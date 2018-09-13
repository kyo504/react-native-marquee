declare module 'react-native-marquee' {
  import React from 'react';
  import { EasingFunction, StyleProp, TextStyle } from 'react-native';

  export interface IMarqueeTextProps {
    /**
     * style
     */
    style?: StyleProp<TextStyle>;
    /**
     * Number of milliseconds until animation finishes from start.
     */
    duration?: number;
    /**
     * Easing function to define animation curve.
     */
    easing?: EasingFunction;
    /**
     * Set this true when animation repeats.
     */
    loop?: boolean;
    /**
     * Set this true while waiting for new data from a refresh.
     */
    marqueeOnStart?: boolean;
    /**
     * Number of milliseconds to wait before resetting the marquee position after it finishes.
     */
    marqueeResetDelay?: number;
    /**
     * Number of milliseconds to wait before starting or restarting marquee.
     */
    marqueeDelay?: number;
    /**
     * Callback function for when the marquee completes its animation
     */
    onMarqueeComplete?: () => void;
    /**
     * Text passed
     */
    children: string;
    /**
     * Set this truen if you want to use native driver
     */
    useNativeDriver?: boolean;
  }


  export class MarqueeText extends React.Component<IMarqueeTextProps> {}
}
