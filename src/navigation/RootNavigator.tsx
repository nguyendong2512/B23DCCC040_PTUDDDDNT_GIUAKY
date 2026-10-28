import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { FieldListScreen } from '../screens/FieldListScreen';
import { FieldFormScreen } from '../screens/FieldFormScreen';
import { FieldDetailScreen } from '../screens/FieldDetailScreen';
import { colors } from '../theme/colors';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="FieldList"
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.surface,
          },
          headerTintColor: colors.primary,
          headerTitleStyle: {
            fontWeight: '700',
            color: colors.textPrimary,
            fontSize: 18,
          },
          headerShadowVisible: false,
          animation: 'slide_from_right',
          contentStyle: {
            backgroundColor: colors.background,
          },
        }}
      >
        <Stack.Screen
          name="FieldList"
          component={FieldListScreen}
          options={{
            headerShown: false, // FieldListScreen có header tùy biến đẹp mắt hiển thị thống kê 3/4 sân
          }}
        />
        <Stack.Screen
          name="FieldForm"
          component={FieldFormScreen}
          options={{
            title: 'Thông tin sân bóng',
            headerBackTitle: 'Quay lại',
          }}
        />
        <Stack.Screen
          name="FieldDetail"
          component={FieldDetailScreen}
          options={{
            title: 'Chi tiết sân bóng',
            headerBackTitle: 'Danh sách',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
