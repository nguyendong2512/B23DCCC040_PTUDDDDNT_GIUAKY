import { StyleSheet } from 'react-native';
import { colors } from './colors';

export const typography = StyleSheet.create({
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  cardSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  body: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.textPrimary,
  },
  bodySecondary: {
    fontSize: 13,
    fontWeight: '400',
    color: colors.textSecondary,
  },
  caption: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textMuted,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textInverse,
  },
  errorText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.borderError,
  },
});
