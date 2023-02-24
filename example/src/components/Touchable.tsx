import type { ForwardRefRenderFunction, PropsWithChildren } from 'react';
import { forwardRef } from 'react';
import type {
  GestureResponderEvent,
  PressableProps,
  PressableStateCallbackType,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native';
import { Pressable } from 'react-native';
import { useDebouncedCallback } from 'use-debounce';

export interface TouchableProps extends Omit<PressableProps, 'style'> {
  style?: StyleProp<ViewStyle>;
  activeOpacity?: number;
  waitTime?: number;
}

const Touchable: ForwardRefRenderFunction<View, PropsWithChildren<TouchableProps>> = (
  { style, activeOpacity = 0.5, children, onPress, waitTime = 500, ...restProps },
  ref,
) => {
  const handlePress = useDebouncedCallback(
    (event: GestureResponderEvent) => {
      onPress?.(event);
    },
    waitTime,
    { leading: true, trailing: false },
  );

  return (
    <Pressable
      ref={ref}
      style={({ pressed }: PressableStateCallbackType): StyleProp<ViewStyle> => [
        {
          opacity: pressed ? activeOpacity : 1,
        },
        style,
      ]}
      onPress={handlePress}
      {...restProps}>
      {children}
    </Pressable>
  );
};

export default forwardRef(Touchable);
