import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, FieldType, FieldStatus } from '../types';
import { useApp } from '../context/AppContext';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { CustomInput } from '../components/CustomInput';
import { CustomButton } from '../components/CustomButton';
import { validateFieldName, validateFieldPrice } from '../utils/validators';

type Props = NativeStackScreenProps<RootStackParamList, 'FieldForm'>;

export const FieldFormScreen: React.FC<Props> = ({ navigation, route }) => {
  const { fields, addField, updateField } = useApp();
  const editField = route.params?.field;
  const isEditing = !!editField;

  // Câu 2: Cùng một form cho cả thêm và sửa; khi sửa, các ô được điền sẵn dữ liệu cũ
  const [name, setName] = useState(editField ? editField.name : '');
  const [type, setType] = useState<FieldType>(editField ? editField.type : '5 người');
  const [pricePerHour, setPricePerHour] = useState(
    editField ? editField.pricePerHour.toString() : '300000'
  );
  const [status, setStatus] = useState<FieldStatus>(
    editField ? editField.status : 'Hoạt động'
  );

  // Câu 2 & 7: Thông báo lỗi hiển thị ngay dưới ô nhập, ô nhập sai có viền đỏ
  const [nameError, setNameError] = useState<string | undefined>();
  const [priceError, setPriceError] = useState<string | undefined>();
  const [isSaving, setIsSaving] = useState(false);

  // Đổi title của header theo chế độ Thêm / Sửa
  useEffect(() => {
    navigation.setOptions({
      title: isEditing ? 'Chỉnh sửa thông tin sân' : 'Thêm sân bóng mới',
    });
  }, [navigation, isEditing]);

  const handleSave = async () => {
    // 1. Kiểm tra Tên sân: không trống và không trùng tên sân khác
    const nameValidation = validateFieldName(name, fields, editField?.id);
    setNameError(nameValidation.error);

    // 2. Kiểm tra Giá thuê: là số > 0
    const priceValidation = validateFieldPrice(pricePerHour);
    setPriceError(priceValidation.error);

    if (!nameValidation.isValid || !priceValidation.isValid) {
      return;
    }

    setIsSaving(true);
    try {
      if (isEditing && editField) {
        await updateField({
          id: editField.id,
          name: name.trim(),
          type,
          pricePerHour: priceValidation.value!,
          status,
        });
        Alert.alert('Thành công', 'Đã cập nhật thông tin sân!', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      } else {
        await addField({
          name: name.trim(),
          type,
          pricePerHour: priceValidation.value!,
          status,
        });
        Alert.alert('Thành công', 'Đã thêm sân bóng mới thành công!', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      }
    } catch {
      Alert.alert('Lỗi', 'Không thể lưu thông tin sân, vui lòng thử lại');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
      {/* Câu 7: KeyboardAvoidingView và ScrollView để bàn phím không che ô nhập */}
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.cardForm}>
            {/* Tên sân */}
            <CustomInput
              label="Tên sân"
              required
              placeholder="Ví dụ: Sân A1, Sân B2..."
              value={name}
              onChangeText={text => {
                setName(text);
                if (nameError) setNameError(undefined);
              }}
              error={nameError}
            />

            {/* Câu 2: Chọn loại sân bằng nút bấm (không bắt buộc dùng Picker) */}
            <View style={styles.fieldSection}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>Loại sân</Text>
                <Text style={styles.requiredMark}> *</Text>
              </View>
              <View style={styles.buttonGroup}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={[
                    styles.optionButton,
                    type === '5 người' && styles.optionButtonActive,
                  ]}
                  onPress={() => setType('5 người')}
                >
                  <Text
                    style={[
                      styles.optionButtonText,
                      type === '5 người' && styles.optionButtonTextActive,
                    ]}
                  >
                    ⚽ Sân 5 người
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.7}
                  style={[
                    styles.optionButton,
                    type === '7 người' && styles.optionButtonActive,
                  ]}
                  onPress={() => setType('7 người')}
                >
                  <Text
                    style={[
                      styles.optionButtonText,
                      type === '7 người' && styles.optionButtonTextActive,
                    ]}
                  >
                    🏟️ Sân 7 người
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Giá thuê mỗi giờ */}
            <CustomInput
              label="Giá thuê mỗi giờ (VNĐ)"
              required
              placeholder="Ví dụ: 300000"
              keyboardType="numeric"
              rightText="đ/giờ"
              value={pricePerHour}
              onChangeText={text => {
                setPricePerHour(text);
                if (priceError) setPriceError(undefined);
              }}
              error={priceError}
            />

            {/* Câu 2: Chọn trạng thái bằng nút bấm (xanh cho Hoạt động, cam cho Bảo trì) */}
            <View style={styles.fieldSection}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>Trạng thái hoạt động</Text>
                <Text style={styles.requiredMark}> *</Text>
              </View>
              <View style={styles.buttonGroup}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={[
                    styles.statusOptionButton,
                    status === 'Hoạt động' && styles.statusActiveActive,
                  ]}
                  onPress={() => setStatus('Hoạt động')}
                >
                  <View
                    style={[
                      styles.statusDot,
                      {
                        backgroundColor:
                          status === 'Hoạt động'
                            ? colors.statusActiveDot
                            : colors.textMuted,
                      },
                    ]}
                  />
                  <Text
                    style={[
                      styles.statusOptionText,
                      status === 'Hoạt động' && styles.statusActiveText,
                    ]}
                  >
                    Hoạt động
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.7}
                  style={[
                    styles.statusOptionButton,
                    status === 'Bảo trì' && styles.statusMaintenanceActive,
                  ]}
                  onPress={() => setStatus('Bảo trì')}
                >
                  <View
                    style={[
                      styles.statusDot,
                      {
                        backgroundColor:
                          status === 'Bảo trì'
                            ? colors.statusMaintenanceDot
                            : colors.textMuted,
                      },
                    ]}
                  />
                  <Text
                    style={[
                      styles.statusOptionText,
                      status === 'Bảo trì' && styles.statusMaintenanceText,
                    ]}
                  >
                    Bảo trì
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Nút Submit */}
            <View style={styles.buttonContainer}>
              <CustomButton
                title={isEditing ? 'Lưu thay đổi' : 'Thêm sân bóng'}
                variant="primary"
                size="large"
                onPress={handleSave}
                loading={isSaving}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  cardForm: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 3,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  fieldSection: {
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
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  optionButton: {
    flex: 1,
    height: 48,
    backgroundColor: colors.surfaceSubtle,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  optionButtonActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  optionButtonText: {
    ...typography.bodySecondary,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  optionButtonTextActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  statusOptionButton: {
    flex: 1,
    flexDirection: 'row',
    height: 48,
    backgroundColor: colors.surfaceSubtle,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  statusActiveActive: {
    backgroundColor: colors.statusActiveBg,
    borderColor: colors.statusActive,
  },
  statusMaintenanceActive: {
    backgroundColor: colors.statusMaintenanceBg,
    borderColor: colors.statusMaintenance,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusOptionText: {
    ...typography.bodySecondary,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  statusActiveText: {
    color: colors.statusActiveText,
    fontWeight: '700',
  },
  statusMaintenanceText: {
    color: colors.statusMaintenanceText,
    fontWeight: '700',
  },
  buttonContainer: {
    marginTop: spacing.lg,
  },
});
