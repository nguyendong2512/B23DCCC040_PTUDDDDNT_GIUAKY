import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Field } from '../types';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { formatCurrency } from '../utils/formatters';
import { Badge } from './Badge';
import { useApp } from '../context/AppContext';

interface FieldCardProps {
  field: Field;
  onPress: () => void;
  onEdit: () => void;
}

export const FieldCard: React.FC<FieldCardProps> = ({ field, onPress, onEdit }) => {
  const { deleteField } = useApp();

  const handleDelete = () => {
    // Câu 3: Hỏi xác nhận trước khi xoá
    Alert.alert(
      'Xác nhận xoá',
      `Bạn có chắc chắn muốn xoá "${field.name}" không?`,
      [
        { text: 'Huỷ', style: 'cancel' },
        {
          text: 'Xoá',
          style: 'destructive',
          onPress: async () => {
            const result = await deleteField(field.id);
            if (!result.success) {
              // Câu 3: Không cho xoá sân đang có lượt đặt, báo lỗi bằng Alert
              Alert.alert('Không thể xoá', result.message || 'Không thể xoá sân này!');
            }
          },
        },
      ]
    );
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={styles.cardContainer}
    >
      {/* Header dòng thẻ: Tên sân và Badge trạng thái */}
      <View style={styles.headerRow}>
        <View style={styles.titleArea}>
          <Text style={styles.fieldName}>{field.name}</Text>
          <View style={styles.typeTag}>
            <Text style={styles.typeText}>Sân {field.type}</Text>
          </View>
        </View>
        {/* Câu 1: Nhãn màu xanh cho Hoạt động, cam cho Bảo trì */}
        <Badge status={field.status} />
      </View>

      <View style={styles.divider} />

      {/* Thông tin giá thuê & Nút thao tác */}
      <View style={styles.footerRow}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Giá thuê:</Text>
          {/* Câu 1: Định dạng 300.000 đ/giờ */}
          <Text style={styles.priceValue}>{formatCurrency(field.pricePerHour)}</Text>
        </View>

        <View style={styles.actionButtonsRow}>
          {/* Nút Đặt sân / Chi tiết */}
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.bookCardButton}
            onPress={onPress}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.bookCardButtonText}>⚡ Đặt sân</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.6}
            style={styles.editButton}
            onPress={onEdit}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.editButtonText}>Sửa</Text>
          </TouchableOpacity>

          {/* Câu 3: Nút xoá trên mỗi dòng */}
          <TouchableOpacity
            activeOpacity={0.6}
            style={styles.deleteButton}
            onPress={handleDelete}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.deleteButtonText}>Xoá</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: spacing.lg,
    marginHorizontal: spacing.lg,
    marginVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    // Android Elevation
    elevation: 3,
    // iOS Shadow
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleArea: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: spacing.sm,
  },
  fieldName: {
    ...typography.cardTitle,
    fontSize: 18,
    color: colors.textPrimary,
    marginRight: spacing.sm,
  },
  typeTag: {
    backgroundColor: colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  typeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceContainer: {
    flexDirection: 'column',
  },
  priceLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  priceValue: {
    ...typography.price,
    fontSize: 16,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bookCardButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: colors.primary,
    marginRight: spacing.xs,
  },
  bookCardButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textInverse,
  },
  editButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: colors.primaryLight,
    borderWidth: 1,
    borderColor: colors.primaryMuted,
    marginRight: spacing.sm,
  },
  editButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
  deleteButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: colors.dangerBg,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  deleteButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.danger,
  },
});
