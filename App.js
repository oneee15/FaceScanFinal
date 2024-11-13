import React from 'react';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, IconRegistry, Layout, Text } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Onboard, Scanner, Output, Details } from './src';

const Stack = createNativeStackNavigator();

export default () => (
  <>
    <IconRegistry icons={EvaIconsPack} />
    <ApplicationProvider {...eva} theme={eva.light}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Onboard">
          <Stack.Screen name="Onboard" component={Onboard} options={{ headerShown: false }} />
          <Stack.Screen name="Scanner" component={Scanner} options={{ headerShown: false }} />
          <Stack.Screen name="Result" component={Output} options={{ headerShown: false }} />
          <Stack.Screen name="Details" component={Details} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </ApplicationProvider>
  </>
);