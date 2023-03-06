# react-native-marquee

A pure JavaScript marquee text component for react native.

## Installation

```
npm install --save react-native-marquee
or
yarn add react-native-marquee
```

## Usage

```Javascript
import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import MarqueeText from 'react-native-marquee';

export default class MarqueeTextSample extends Component {
  render() {
    return (
      <View style={styles.container}>
        <MarqueeText
          style={{ fontSize: 24 }}
          speed={1}
          marqueeOnStart={true}
          loop={true}
          delay={1000}
        >
          Lorem Ipsum is simply dummy text of the printing and typesetting industry and typesetting industry.
        </MarqueeText>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
});
```

## Properties

MarqueeText component basically inherits TextProps and the followings are additional ones: 

| Prop              | Type     | Optional | Default | Description
|-------------------|----------|----------|---------| -----------
| marqueeOnStart    | boolean  | true     | true    | A flag whether to start marquee animation right after render
| speed             | number   | true     | 1       | Speed calculated as pixels/second
| loop              | boolean  | true     | true    | A flag whether to loop marquee animation or not
| delay             | number   | true     | 0       | Duration to delay the animation after render, in milliseconds
| onMarqueeComplete | function | true     | void    | A callback for when the marquee finishes animation and stops
| consecutive       | boolean  | true     | false   | A flag to enable consecutive mode that imitates the default behavior of HTML marquee element. Does not take effect if loop is false

## Methods

These methods are optional, you can use the isOpen property instead

| Prop    | Params | Description      |
|:--------|:------:|:----------------:|
| start   |   -    | Start animation  |
| stop    |   -    | Stop animation   |

## Contribution

Do you have any idea or want to change something? Just open an issue. Contributions are always welcome.

## Lisence

[MIT Lisence](https://opensource.org/licenses/MIT)
