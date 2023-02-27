import React, { useRef, useState } from 'react';
import { Switch, Text, TouchableOpacity, View } from 'react-native';
import type { MarqueeTextHandles } from 'react-native-marquee';
import MarqueeText, { MarqueeTextProps } from 'react-native-marquee';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../components/Button';
import styles from './styles';

const sampleText = 'Lorem Ipsum is simply dummy text of the printing and typesetting industry';

const HomeScreen = () => {
  const [config, setConfig] = useState<Partial<MarqueeTextProps>>({
    marqueeOnStart: true,
    speed: 1,
    loop: true,
    delay: 0,
    consecutive: false,
  });
  const marqueeRef = useRef<MarqueeTextHandles>(null);

  const increaseSpeed = () => {
    setConfig(prev => ({ ...prev, speed: Math.min((prev.speed ?? 1.0) + 0.1, 2.0) }));
  };

  const decreaseSpeed = () => {
    setConfig(prev => ({ ...prev, speed: Math.max((prev.speed ?? 1.0) - 0.1, 0.1) }));
  };

  const increaseDelay = () => {
    setConfig(prev => ({ ...prev, delay: Math.min((prev.delay ?? 0) + 100, 2000) }));
  };

  const decreaseDelay = () => {
    setConfig(prev => ({ ...prev, delay: Math.max((prev.delay ?? 0) - 100, 0) }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.label}>Marquee Text Sample</Text>

      <View style={styles.marqueeWrapper}>
        <MarqueeText key={JSON.stringify(config)} ref={marqueeRef} style={styles.text} {...config}>
          {sampleText}
        </MarqueeText>
      </View>

      <View>
        <Text style={styles.label}>Options</Text>

        <View style={styles.itemContainer}>
          <Text style={styles.itemText}>Marquee on start</Text>
          <Switch
            value={config.marqueeOnStart}
            onValueChange={v => setConfig(prev => ({ ...prev, marqueeOnStart: v }))}
          />
        </View>

        <View style={styles.itemContainer}>
          <Text style={styles.itemText}>Consecutive mode</Text>
          <Switch value={config.consecutive} onValueChange={v => setConfig(prev => ({ ...prev, consecutive: v }))} />
        </View>

        <View style={styles.itemContainer}>
          <Text style={styles.itemText}>Loop</Text>
          <Switch value={config.loop} onValueChange={v => setConfig(prev => ({ ...prev, loop: v }))} />
        </View>

        <View style={styles.itemContainer}>
          <Text style={styles.itemText}>Speed</Text>

          <View style={styles.control}>
            <TouchableOpacity style={styles.arrow} onPress={increaseSpeed}>
              <Text>{'▲'}</Text>
            </TouchableOpacity>
            <Text style={styles.controlText}>{`${config.speed?.toFixed(1)}`}</Text>
            <TouchableOpacity style={styles.arrow} onPress={decreaseSpeed}>
              <Text>{'▼'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.itemContainer}>
          <Text style={styles.itemText}>Delay</Text>

          <View style={styles.control}>
            <TouchableOpacity style={styles.arrow} onPress={increaseDelay}>
              <Text>{'▲'}</Text>
            </TouchableOpacity>
            <Text style={styles.controlText}>{config.delay}</Text>
            <TouchableOpacity style={styles.arrow} onPress={decreaseDelay}>
              <Text>{'▼'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Button style={styles.button} onPress={() => marqueeRef.current?.start()}>
            Start
          </Button>
          <Button style={styles.button} onPress={() => marqueeRef.current?.stop()}>
            Stop
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
