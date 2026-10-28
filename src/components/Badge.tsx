import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { FieldStatus } from '../types';

interface BadgeProps {
  status: FieldStatus;
  size?: 'small' | 'medium';
}

export const Badge: React.FC<BadgeProps> = ({ status, size = 'medium' }) => {
  const isActive = status === 'Hoạt động';

  return (
    <View
      style={[
        styles.badge,
        size === 'small' ? styles.badgeSmall : styles.badgeMedium,
        isActive ? styles.activeBadge : styles.maintenanceBadge,
      ]}
    >
      <View
        style={[
          styles.dot,
          isActive ? styles.activeDot : styles.maintenanceDot,
        ]}
      />
      <Text
        style={[
          styles.text,
          size === 'small' ? styles.textSmall : styles.textMedium,
          isActive ? styles.activeText : styles.maintenanceText,
        ]}
      >
        {status}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: 20,
    borderWidth: 1,
  },
  badgeMedium: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  badgeSmall: {
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  activeBadge: {
    backgroundColor: colors.statusActiveBg,
    borderColor: colors.statusActive,
  },
  maintenanceBadge: {
    backgroundColor: colors.statusMaintenanceBg,
    borderColor: colors.statusMaintenance,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 6,
  },
  activeDot: {
    backgroundColor: colors.statusActiveDot,
  },
  maintenanceDot: {
    backgroundColor: colors.statusMaintenanceDot,
  },
  text: {
    fontWeight: '700',
  },
  textMedium: {
    fontSize: 12,
  },
  textSmall: {
    fontSize: 11,
  },
  activeText: {
    color: colors.statusActiveText,
  },
  maintenanceText: {
    color: colors.statusMaintenanceText,
  },
});
