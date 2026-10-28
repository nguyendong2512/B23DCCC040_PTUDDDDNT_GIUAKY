import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

interface CustomInputProps extends TextInputProps {
  label: string;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
  rightText?: string;
  required?: boolean;
}

export const CustomInput: React.FC<CustomInputProps> = ({
  label,
  error,
  containerStyle,
  rightText,
  required,
  ...inputProps
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const hasError = !!error;

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        {required && <Text style={styles.requiredMark}> *</Text>}
      </View>

      <View
        style={[
          styles.inputWrapper,
          isFocused && styles.inputFocused,
          hasError && styles.inputError,
        ]}
      >
        <TextInput
          style={styles.input}
          placeholderTextColor={colors.textMuted}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...inputProps}
        />
        {rightText ? <Text style={styles.rightText}>{rightText}</Text> : null}
      </View>

      {hasError ? (
        <View style={styles.errorRow}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  label: {
    ...typography.label,
    color: colors.textPrimary,
  },
  requiredMark: {
    color: colors.danger,
    fontWeight: '700',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: spacing.md,
    height: 48,
  },
  inputFocused: {
    borderColor: colors.primary,
    backgroundColor: colors.surfaceSubtle,
  },
  inputError: {
    borderColor: colors.borderError,
    backgroundColor: '#FFF5F5',
  },
  input: {
    flex: 1,
    height: '100%',
    ...typography.body,
    color: colors.textPrimary,
    paddingVertical: 0,
  },
  rightText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '600',
    marginLeft: spacing.xs,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    paddingHorizontal: 2,
  },
  errorIcon: {
    fontSize: 11,
    marginRight: 4,
  },
  errorText: {
    ...typography.errorText,
    flex: 1,
  },
});
