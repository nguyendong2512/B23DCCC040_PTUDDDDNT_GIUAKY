import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { useApp } from '../context/AppContext';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { formatCurrency } from '../utils/formatters';
import { Badge } from '../components/Badge';
import { BookingCard } from '../components/BookingCard';
import { BookingModal } from '../components/BookingModal';
import { CustomButton } from '../components/CustomButton';
import { EmptyState } from '../components/EmptyState';

type Props = NativeStackScreenProps<RootStackParamList, 'FieldDetail'>;

export const FieldDetailScreen: React.FC<Props> = ({ route }) => {
  const { fieldId } = route.params;
  const { getFieldById, getBookingsForField, cancelBooking } = useApp();

  const field = getFieldById(fieldId);
  const bookings = getBookingsForField(fieldId);

  const [modalVisible, setModalVisible] = useState(false);

  if (!field) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <EmptyState
          icon="❓"
          title="Không tìm thấy sân"
          message="Sân bóng này không tồn tại hoặc đã bị xoá."
        />
      </SafeAreaView>
    );
  }

  const isMaintenance = field.status === 'Bảo trì';

  const handleOpenBookingModal = () => {
    // Câu 4: Không cho đặt sân đang Bảo trì: nút bị vô hiệu hoá
    if (isMaintenance) {
      Alert.alert(
        'Sân đang bảo trì',
        'Sân này hiện đang bảo trì nên không thể nhận lịch đặt sân mới.'
      );
      return;
    }
    setModalVisible(true);
  };

  const renderHeader = () => (
    <View style={styles.headerSection}>
      {/* Thông tin sân bóng */}
      <View style={styles.fieldInfoCard}>
        <View style={styles.fieldTitleRow}>
          <View style={styles.nameTypeWrapper}>
            <Text style={styles.fieldName}>{field.name}</Text>
            <View style={styles.typeTag}>
              <Text style={styles.typeText}>Sân {field.type}</Text>
            </View>
          </View>
          {/* Nhãn màu: xanh cho Hoạt động, cam cho Bảo trì */}
          <Badge status={field.status} />
        </View>

        <View style={styles.divider} />

        <View style={styles.fieldStatsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Giá thuê sân</Text>
            <Text style={styles.statValue}>{formatCurrency(field.pricePerHour)}</Text>
          </View>

          <View style={styles.statVerticalDivider} />

          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Lượt đặt hiện tại</Text>
            <Text style={styles.statBookingsCount}>
              {bookings.length} lượt đặt
            </Text>
          </View>
        </View>

        {isMaintenance && (
          <View style={styles.maintenanceWarning}>
            <Text style={styles.warningIcon}>⚠️</Text>
            <Text style={styles.warningText}>
              Sân đang trong giai đoạn bảo dưỡng. Tính năng đặt sân tạm thời bị khoá.
            </Text>
          </View>
        )}
      </View>

      {/* Tiêu đề danh sách lượt đặt */}
      <View style={styles.bookingListHeader}>
        <Text style={styles.bookingListTitle}>
          Lịch đặt sân ({bookings.length})
        </Text>
        <Text style={styles.bookingListSub}>
          Danh sách các khung giờ đã được khách đặt
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
      <FlatList
        data={bookings}
        keyExtractor={item => item.id}
        ListHeaderComponent={renderHeader}
        renderItem={({ item }) => (
          <View style={styles.bookingItemWrapper}>
            <BookingCard
              booking={item}
              pricePerHour={field.pricePerHour}
              onCancel={cancelBooking}
            />
          </View>
        )}
        ListEmptyComponent={
          <EmptyState
            icon="📅"
            title="Chưa có lượt đặt nào"
            message={`Sân "${field.name}" hiện chưa có lịch đặt nào. Nhấn nút "Đặt sân" bên dưới để thêm lượt đặt mới.`}
          />
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Thanh nút bấm đặt sân cố định ở phía dưới */}
      <View style={styles.bottomBar}>
        {/* Câu 4: Không cho đặt sân đang Bảo trì: nút bị vô hiệu hoá */}
        <CustomButton
          title={
            isMaintenance
              ? '⛔ Sân đang bảo trì - Không thể đặt'
              : '⚡ Đặt sân này ngay'
          }
          variant={isMaintenance ? 'secondary' : 'primary'}
          size="large"
          disabled={isMaintenance}
          onPress={handleOpenBookingModal}
          style={styles.bookButton}
        />
      </View>

      {/* Modal đặt sân */}
      <BookingModal
        visible={modalVisible}
        field={field}
        onClose={() => setModalVisible(false)}
        onSuccess={() => {}}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    paddingBottom: 90, // Chừa khoảng trống cho thanh nút dưới đáy
  },
  headerSection: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  fieldInfoCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 3,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    marginBottom: spacing.md,
  },
  fieldTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nameTypeWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: spacing.sm,
  },
  fieldName: {
    ...typography.cardTitle,
    fontSize: 20,
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
  fieldStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  statValue: {
    ...typography.price,
    fontSize: 16,
  },
  statBookingsCount: {
    ...typography.body,
    fontWeight: '700',
    color: colors.primaryDark,
    fontSize: 15,
  },
  statVerticalDivider: {
    width: 1,
    height: 36,
    backgroundColor: colors.border,
  },
  maintenanceWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.statusMaintenanceBg,
    borderColor: colors.statusMaintenance,
    borderWidth: 1,
    borderRadius: 10,
    padding: spacing.md,
    marginTop: spacing.md,
  },
  warningIcon: {
    fontSize: 16,
    marginRight: spacing.xs,
  },
  warningText: {
    ...typography.bodySecondary,
    fontSize: 12,
    color: colors.statusMaintenanceText,
    flex: 1,
  },
  bookingListHeader: {
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  bookingListTitle: {
    ...typography.sectionTitle,
    fontSize: 17,
    color: colors.textPrimary,
  },
  bookingListSub: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  bookingItemWrapper: {
    paddingHorizontal: spacing.lg,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    elevation: 8,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  bookButton: {
    width: '100%',
  },
});
