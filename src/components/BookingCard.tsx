import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Booking } from '../types';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { formatTimeRange, formatTotalCurrency } from '../utils/formatters';

interface BookingCardProps {
  booking: Booking;
  pricePerHour: number;
  onCancel: (bookingId: string) => void;
}

export const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  pricePerHour,
  onCancel,
}) => {
  const totalPrice = pricePerHour * booking.hours;

  const handleCancel = () => {
    // Câu 5: Có thể huỷ một lượt đặt, có hỏi xác nhận
    Alert.alert(
      'Huỷ lượt đặt sân',
      `Bạn có chắc chắn muốn huỷ lượt đặt của "${booking.customerName}" vào ngày ${booking.date} (${booking.startHour}h - ${booking.startHour + booking.hours}h) không?`,
      [
        { text: 'Không', style: 'cancel' },
        {
          text: 'Đồng ý huỷ',
          style: 'destructive',
          onPress: () => onCancel(booking.id),
        },
      ]
    );
  };

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.customerInfo}>
          <Text style={styles.customerName}>{booking.customerName}</Text>
          <Text style={styles.phoneText}>📞 {booking.phone}</Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.6}
          onPress={handleCancel}
          style={styles.cancelButton}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={styles.cancelButtonText}>Huỷ đặt</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.detailsBox}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>📅 Ngày đá</Text>
          <Text style={styles.detailValue}>{booking.date}</Text>
        </View>

        <View style={styles.detailDivider} />

        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>⏰ Khung giờ</Text>
          <Text style={styles.detailValue}>
            {formatTimeRange(booking.startHour, booking.hours)}
          </Text>
        </View>

        <View style={styles.detailDivider} />

        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>💵 Thành tiền</Text>
          <Text style={styles.totalPriceText}>
            {formatTotalCurrency(totalPrice)}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing.md,
    marginVertical: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    ...typography.cardTitle,
    fontSize: 16,
    color: colors.textPrimary,
  },
  phoneText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  cancelButton: {
    backgroundColor: colors.dangerBg,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  cancelButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.danger,
  },
  detailsBox: {
    backgroundColor: colors.surfaceSubtle,
    borderRadius: 8,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 3,
  },
  detailLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  detailValue: {
    ...typography.bodySecondary,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  totalPriceText: {
    ...typography.bodySecondary,
    fontWeight: '700',
    color: colors.primary,
  },
  detailDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 3,
  },
});
