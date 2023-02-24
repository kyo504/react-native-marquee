import Touchable from './Touchable';
import type { ReactNode } from 'react';
import React, { isValidElement } from 'react';
import type { PressableProps, StyleProp, TextStyle, ViewStyle } from 'react-native';
import { StyleSheet, Text } from 'react-native';

export interface ButtonProps extends Omit<PressableProps, 'style'> {
  /**
   * Style for the button container
   */
  style?: StyleProp<ViewStyle>;
  /**
   * Style for the button text
   */
  labelStyle?: StyleProp<TextStyle>;
  /**
   * Whether to show a loading indicator
   */
  isLoading?: boolean;
  /**
   * Make the label text uppercased
   */
  uppercase?: boolean;
  /**
   * Label text or any element of the button.
   */
  children?: string | ReactNode;
}

const Button = ({ style, labelStyle, children, onPress, uppercase = false, disabled, ...restProps }: ButtonProps) => {
  return (
    <Touchable style={[styles.container, style]} onPress={onPress} disabled={disabled} {...restProps}>
      {isValidElement(children) ? (
        children
      ) : (
        <Text
          style={[styles.buttonText, uppercase && styles.uppercaseLabel, disabled && { opacity: 0.4 }, labelStyle]}
          numberOfLines={1}>
          {children}
        </Text>
      )}
    </Touchable>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 48,
    minWidth: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 26,
  },
  buttonText: {
    fontSize: 18,
    color: 'black',
  },
  uppercaseLabel: {
    textTransform: 'uppercase',
  },
  gradient: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
});

export default Button;
