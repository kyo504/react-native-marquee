import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { MainStackParamList } from '../navigators/types';
import HomeScreen from '../screens/HomeScreen';

const Stack = createNativeStackNavigator<MainStackParamList>();

const MainStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={'Home'} component={HomeScreen} />
    </Stack.Navigator>
  );
};

export default MainStack;
