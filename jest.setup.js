/* eslint-disable no-undef */
import React from 'react';

const mockStorage: Record<string, string> = {};

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn((key: string) => Promise.resolve(mockStorage[key] || null)),
  setItem: jest.fn((key: string, value: string) => {
    mockStorage[key] = value;
    return Promise.resolve();
  }),
  removeItem: jest.fn((key: string) => {
    delete mockStorage[key];
    return Promise.resolve();
  }),
  clear: jest.fn(() => {
    Object.keys(mockStorage).forEach(k => delete mockStorage[k]);
    return Promise.resolve();
  }),
}));

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => {
  const ReactActual = require('react');
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  const SafeAreaInsetsContext = ReactActual.createContext(inset);

  return {
    SafeAreaProvider: ({ children }: any) => children,
    SafeAreaConsumer: ({ children }: any) => children(inset),
    SafeAreaView: ({ children }: any) => children,
    SafeAreaInsetsContext,
    useSafeAreaInsets: () => inset,
  };
});

// Mock react-native-screens
jest.mock('react-native-screens', () => {
  const ReactActual = require('react');
  const View = require('react-native').View;
  return {
    enableScreens: jest.fn(),
    screensEnabled: () => true,
    compatibilityFlags: {
      usesNewAndroidHeaderHeightImplementation: false,
    },
    Screen: (props: any) => ReactActual.createElement(View, props),
    ScreenContainer: (props: any) => ReactActual.createElement(View, props),
    ScreenStack: (props: any) => ReactActual.createElement(View, props),
    ScreenStackItem: (props: any) => ReactActual.createElement(View, props),
    ScreenStackHeaderConfig: (props: any) => ReactActual.createElement(View, props),
    ScreenStackHeaderSubview: (props: any) => ReactActual.createElement(View, props),
    SearchBar: (props: any) => ReactActual.createElement(View, props),
  };
});
