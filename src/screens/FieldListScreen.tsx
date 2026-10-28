import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList, Field } from '../types';
import { useApp } from '../context/AppContext';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { FieldCard } from '../components/FieldCard';
import { EmptyState } from '../components/EmptyState';
import { CustomButton } from '../components/CustomButton';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'FieldList'>;

export const FieldListScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { fields, isLoading, activeFieldsCount, totalFieldsCount } = useApp();

  const handleAddField = () => {
    // Câu 2: Nút "+ Thêm sân" mở màn hình form (dùng Stack Navigation)
    navigation.navigate('FieldForm', undefined);
  };

  const handleEditField = (field: Field) => {
    navigation.navigate('FieldForm', { field });
  };

  const handleViewDetail = (field: Field) => {
    // Câu 4: Nhấn vào một sân để mở màn hình Chi tiết
    navigation.navigate('FieldDetail', { fieldId: field.id });
  };

  // Câu 1: Đầu màn hình hiển thị số sân đang hoạt động trên tổng số sân, ví dụ "3/4 sân hoạt động"
  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.topBar}>
        <View>
          <Text style={styles.appTitle}>Quản Lý Sân Bóng</Text>
          <Text style={styles.appSubtitle}>Hệ thống đặt sân & điều phối</Text>
        </View>

        {/* Nút + Thêm sân */}
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.addHeaderButton}
          onPress={handleAddField}
        >
          <Text style={styles.addHeaderButtonIcon}>＋</Text>
          <Text style={styles.addHeaderButtonText}>Thêm sân</Text>
        </TouchableOpacity>
      </View>

      {/* Card thống kê trạng thái hoạt động */}
      <View style={styles.statsCard}>
        <View style={styles.statsContent}>
          <View style={styles.statsIconBox}>
            <Text style={styles.statsIcon}>⚽</Text>
          </View>
          <View style={styles.statsTextBox}>
            <Text style={styles.statsTitle}>Tình trạng sân bãi</Text>
            {/* Câu 1: Hiển thị ví dụ "3/4 sân hoạt động" */}
            <Text style={styles.statsCountHighlight}>
              {activeFieldsCount}/{totalFieldsCount} sân hoạt động
            </Text>
          </View>
        </View>

        {/* Thanh tiến độ trực quan */}
        <View style={styles.progressBarBg}>
          <View
            style={[
              styles.progressBarFill,
              {
                width:
                  totalFieldsCount > 0
                    ? `${(activeFieldsCount / totalFieldsCount) * 100}%`
                    : '0%',
              },
            ]}
          />
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Danh sách sân ({totalFieldsCount})</Text>
        <Text style={styles.sectionHint}>Nhấn vào sân để xem chi tiết & đặt lịch</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" />

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
        </View>
      ) : (
        <FlatList
          data={fields}
          keyExtractor={item => item.id}
          ListHeaderComponent={renderHeader}
          renderItem={({ item }) => (
            <FieldCard
              field={item}
              onPress={() => handleViewDetail(item)}
              onEdit={() => handleEditField(item)}
            />
          )}
          // Câu 7: Trạng thái danh sách rỗng
          ListEmptyComponent={
            <EmptyState
              icon="🏟️"
              title="Chưa có sân bóng nào"
              message="Hiện tại cụm sân chưa có sân nào trong danh sách. Hãy thêm sân mới để bắt đầu quản lý!"
              action={
                <CustomButton
                  title="+ Thêm sân bóng mới"
                  variant="primary"
                  onPress={handleAddField}
                />
              }
            />
          }
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    paddingBottom: spacing.xxl,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...typography.bodySecondary,
    marginTop: spacing.sm,
    color: colors.textSecondary,
  },
  headerContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xs,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  appTitle: {
    ...typography.headerTitle,
    fontSize: 22,
    color: colors.textPrimary,
  },
  appSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  addHeaderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: 10,
    elevation: 2,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  addHeaderButtonIcon: {
    color: colors.textInverse,
    fontSize: 16,
    fontWeight: '700',
    marginRight: 4,
  },
  addHeaderButtonText: {
    color: colors.textInverse,
    fontWeight: '700',
    fontSize: 14,
  },
  statsCard: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    marginBottom: spacing.md,
  },
  statsContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  statsIconBox: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  statsIcon: {
    fontSize: 22,
  },
  statsTextBox: {
    flex: 1,
  },
  statsTitle: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  statsCountHighlight: {
    ...typography.sectionTitle,
    fontSize: 18,
    color: colors.primaryDark,
    marginTop: 2,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  sectionHeader: {
    marginTop: spacing.xs,
    marginBottom: spacing.xs,
  },
  sectionTitle: {
    ...typography.sectionTitle,
    fontSize: 17,
    color: colors.textPrimary,
  },
  sectionHint: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
