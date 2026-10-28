import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  StyleProp,
  View,
} from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'outlineDanger' | 'outline';
type ButtonSize = 'small' | 'medium' | 'large';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  icon?: React.ReactNode;
}

export const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
  icon,
}) => {
  const getContainerStyle = (): StyleProp<ViewStyle> => {
    const list: ViewStyle[] = [styles.baseButton];

    // Size
    if (size === 'small') list.push(styles.sizeSmall);
    else if (size === 'large') list.push(styles.sizeLarge);
    else list.push(styles.sizeMedium);

    // Variant
    if (variant === 'primary') list.push(styles.primaryButton);
    else if (variant === 'secondary') list.push(styles.secondaryButton);
    else if (variant === 'danger') list.push(styles.dangerButton);
    else if (variant === 'outlineDanger') list.push(styles.outlineDangerButton);
    else if (variant === 'outline') list.push(styles.outlineButton);

    // Disabled
    if (disabled) {
      list.push(styles.disabledButton);
    }

    return list;
  };

  const getTextStyle = (): StyleProp<TextStyle> => {
    const list: TextStyle[] = [styles.baseText];

    if (size === 'small') list.push(styles.textSmall);
    else if (size === 'large') list.push(styles.textLarge);

    if (variant === 'primary' || variant === 'danger') {
      list.push(styles.textLight);
    } else if (variant === 'secondary') {
      list.push(styles.textPrimaryColor);
    } else if (variant === 'outlineDanger') {
      list.push(styles.textDangerColor);
    } else if (variant === 'outline') {
      list.push(styles.textDark);
    }

    if (disabled) {
      list.push(styles.disabledText);
    }

    return list;
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      disabled={disabled || loading}
      style={[getContainerStyle(), style]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' || variant === 'danger' ? colors.textInverse : colors.primary}
        />
      ) : (
        <View style={styles.contentRow}>
          {icon ? <View style={styles.iconWrapper}>{icon}</View> : null}
          <Text style={[getTextStyle(), textStyle]}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  baseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    marginRight: spacing.xs,
  },
  sizeSmall: {
    paddingVertical: 6,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
  },
  sizeMedium: {
    paddingVertical: 12,
    paddingHorizontal: spacing.lg,
    borderRadius: 10,
  },
  sizeLarge: {
    paddingVertical: 15,
    paddingHorizontal: spacing.xl,
    borderRadius: 12,
  },
  // Variants
  primaryButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primaryDark,
  },
  secondaryButton: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primaryMuted,
  },
  dangerButton: {
    backgroundColor: colors.danger,
    borderColor: colors.dangerDark,
  },
  outlineDangerButton: {
    backgroundColor: colors.surface,
    borderColor: colors.danger,
  },
  outlineButton: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  disabledButton: {
    backgroundColor: colors.disabledBg,
    borderColor: colors.disabledBorder,
    opacity: 0.65,
  },
  // Text Styles
  baseText: {
    ...typography.buttonText,
  },
  textSmall: {
    fontSize: 13,
  },
  textLarge: {
    fontSize: 16,
    fontWeight: '700',
  },
  textLight: {
    color: colors.textInverse,
  },
  textDark: {
    color: colors.textPrimary,
  },
  textPrimaryColor: {
    color: colors.primary,
  },
  textDangerColor: {
    color: colors.danger,
  },
  disabledText: {
    color: colors.disabledText,
  },
});
