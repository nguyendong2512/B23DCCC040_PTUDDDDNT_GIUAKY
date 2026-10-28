import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Field } from '../types';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { CustomInput } from './CustomInput';
import { CustomButton } from './CustomButton';
import { formatCurrency, formatTotalCurrency } from '../utils/formatters';
import {
  validateBookingHours,
  validateDate,
  validatePhone,
} from '../utils/validators';
import { useApp } from '../context/AppContext';

interface BookingModalProps {
  visible: boolean;
  field: Field;
  onClose: () => void;
  onSuccess: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  visible,
  field,
  onClose,
  onSuccess,
}) => {
  const { addBooking } = useApp();

  // Helper để lấy ngày hôm nay theo dd/mm/yyyy
  const getTodayString = () => {
    const today = new Date();
    const d = String(today.getDate()).padStart(2, '0');
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const y = today.getFullYear();
    return `${d}/${m}/${y}`;
  };

  // State các ô nhập (Mặc định thời gian đặt sân là 1h30p = 1.5 giờ)
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState(getTodayString());
  const [startHour, setStartHour] = useState('17');
  const [hours, setHours] = useState('1.5');

  // State thông báo lỗi inline (Câu 7: ô nhập sai có viền đỏ, lỗi hiển thị ngay dưới ô)
  const [errors, setErrors] = useState<{
    customerName?: string;
    phone?: string;
    date?: string;
    startHour?: string;
    hours?: string;
  }>({});

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form khi modal mở ra (Mặc định thời gian thuê là 1.5 = 1h30p)
  useEffect(() => {
    if (visible) {
      setCustomerName('');
      setPhone('');
      setDate(getTodayString());
      setStartHour('17');
      setHours('1.5');
      setErrors({});
    }
  }, [visible]);

  // Câu 4: Thành tiền (pricePerHour * hours) được tính và hiển thị NGAY KHI NHẬP SỐ GIỜ
  const parsedHours = parseFloat(hours);
  const validHours = !isNaN(parsedHours) && parsedHours > 0 ? parsedHours : 0;
  const calculatedTotal = Math.round(field.pricePerHour * validHours);

  const handleSubmit = async () => {
    const newErrors: typeof errors = {};

    // 1. Kiểm tra Tên khách (bắt buộc)
    if (!customerName.trim()) {
      newErrors.customerName = 'Tên khách hàng không được để trống';
    }

    // 2. Kiểm tra Số điện thoại (10 chữ số, bắt đầu bằng 0)
    const phoneVal = validatePhone(phone);
    if (!phoneVal.isValid) {
      newErrors.phone = phoneVal.error;
    }

    // 3. Kiểm tra Ngày (dd/mm/yyyy)
    const dateVal = validateDate(date);
    if (!dateVal.isValid) {
      newErrors.date = dateVal.error;
    }

    // 4. Kiểm tra giờ bắt đầu (6 - 22) và số giờ thuê (1 - 3), giờ kết thúc <= 23h
    const hoursVal = validateBookingHours(startHour, hours);
    if (!hoursVal.isValid) {
      if (hoursVal.error?.includes('Giờ bắt đầu')) {
        newErrors.startHour = hoursVal.error;
      } else if (hoursVal.error?.includes('Số giờ thuê')) {
        newErrors.hours = hoursVal.error;
      } else {
        newErrors.hours = hoursVal.error;
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    // Tiến hành lưu và kiểm tra trùng lịch (Câu 5)
    setIsSubmitting(true);
    try {
      const result = await addBooking({
        fieldId: field.id,
        customerName: customerName.trim(),
        phone: phone.trim(),
        date: date.trim(),
        startHour: hoursVal.startHour!,
        hours: hoursVal.hours!,
      });

      if (!result.success) {
        // Báo lỗi trùng lịch hoặc lỗi nghiệp vụ bằng Alert
        Alert.alert('Không thể đặt sân', result.message || 'Vui lòng kiểm tra lại thông tin!');
      } else {
        Alert.alert('Thành công', 'Đặt sân thành công!', [
          {
            text: 'OK',
            onPress: () => {
              onSuccess();
              onClose();
            },
          },
        ]);
      }
    } catch {
      Alert.alert('Lỗi', 'Đã xảy ra lỗi không mong muốn khi đặt sân');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.modalOverlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.modalContent}>
          {/* Header Modal */}
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>Đặt sân bóng</Text>
              <Text style={styles.modalSubtitle}>
                {field.name} • {field.type} • {formatCurrency(field.pricePerHour)}
              </Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Body Form cuộn được, không bị che bàn phím */}
          <ScrollView
            style={styles.formScroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Tên khách hàng */}
            <CustomInput
              label="Tên khách hàng"
              required
              placeholder="Nhập họ và tên khách hàng"
              value={customerName}
              onChangeText={text => {
                setCustomerName(text);
                if (errors.customerName) {
                  setErrors(prev => ({ ...prev, customerName: undefined }));
                }
              }}
              error={errors.customerName}
            />

            {/* Số điện thoại (phone-pad) */}
            <CustomInput
              label="Số điện thoại"
              required
              placeholder="0912345678 (10 số, bắt đầu 0)"
              keyboardType="phone-pad"
              maxLength={10}
              value={phone}
              onChangeText={text => {
                setPhone(text);
                if (errors.phone) {
                  setErrors(prev => ({ ...prev, phone: undefined }));
                }
              }}
              error={errors.phone}
            />

            {/* Ngày đặt */}
            <CustomInput
              label="Ngày đặt sân (dd/mm/yyyy)"
              required
              placeholder="Ví dụ: 28/10/2026"
              value={date}
              onChangeText={text => {
                setDate(text);
                if (errors.date) {
                  setErrors(prev => ({ ...prev, date: undefined }));
                }
              }}
              error={errors.date}
            />

            <View style={styles.rowInputs}>
              {/* Giờ bắt đầu (numeric) */}
              <View style={styles.halfInput}>
                <CustomInput
                  label="Giờ bắt đầu (6 - 22)"
                  required
                  placeholder="Ví dụ: 17"
                  keyboardType="numeric"
                  maxLength={2}
                  rightText="giờ"
                  value={startHour}
                  onChangeText={text => {
                    setStartHour(text);
                    if (errors.startHour) {
                      setErrors(prev => ({ ...prev, startHour: undefined }));
                    }
                  }}
                  error={errors.startHour}
                />
              </View>

              {/* Số giờ thuê (numeric) */}
              <View style={styles.halfInput}>
                <CustomInput
                  label="Số giờ thuê (1 - 3)"
                  required
                  placeholder="Ví dụ: 1.5"
                  keyboardType="numeric"
                  maxLength={4}
                  rightText="giờ"
                  value={hours}
                  onChangeText={text => {
                    setHours(text);
                    if (errors.hours) {
                      setErrors(prev => ({ ...prev, hours: undefined }));
                    }
                  }}
                  error={errors.hours}
                />
              </View>
            </View>

            {/* Nút chọn nhanh thời gian thuê */}
            <View style={styles.quickHoursRow}>
              <Text style={styles.quickHoursLabel}>Thời gian:</Text>
              <TouchableOpacity
                activeOpacity={0.7}
                style={[
                  styles.quickHourChip,
                  hours === '1.5' && styles.quickHourChipActive,
                ]}
                onPress={() => {
                  setHours('1.5');
                  if (errors.hours) setErrors(prev => ({ ...prev, hours: undefined }));
                }}
              >
                <Text
                  style={[
                    styles.quickHourChipText,
                    hours === '1.5' && styles.quickHourChipTextActive,
                  ]}
                >
                  ⚡ 1h30p (Mặc định)
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                style={[
                  styles.quickHourChip,
                  hours === '1' && styles.quickHourChipActive,
                ]}
                onPress={() => {
                  setHours('1');
                  if (errors.hours) setErrors(prev => ({ ...prev, hours: undefined }));
                }}
              >
                <Text
                  style={[
                    styles.quickHourChipText,
                    hours === '1' && styles.quickHourChipTextActive,
                  ]}
                >
                  1 giờ
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                style={[
                  styles.quickHourChip,
                  hours === '2' && styles.quickHourChipActive,
                ]}
                onPress={() => {
                  setHours('2');
                  if (errors.hours) setErrors(prev => ({ ...prev, hours: undefined }));
                }}
              >
                <Text
                  style={[
                    styles.quickHourChipText,
                    hours === '2' && styles.quickHourChipTextActive,
                  ]}
                >
                  2 giờ
                </Text>
              </TouchableOpacity>
            </View>

            {/* Câu 4: Khung hiển thị THÀNH TIỀN tính và cập nhật ngay khi nhập số giờ */}
            <View style={styles.totalBox}>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Giá sân:</Text>
                <Text style={styles.totalItemPrice}>
                  {formatCurrency(field.pricePerHour)}
                </Text>
              </View>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Thời gian thuê:</Text>
                <Text style={styles.totalItemHours}>
                  {validHours > 0
                    ? validHours === 1.5
                      ? '1h30p (1.5 giờ)'
                      : validHours % 1 === 0.5
                      ? `${Math.floor(validHours)}h30p`
                      : `${validHours} giờ`
                    : 'Chưa hợp lệ'}
                </Text>
              </View>
              <View style={styles.totalDivider} />
              <View style={styles.totalRowMain}>
                <Text style={styles.totalMainLabel}>Thành tiền:</Text>
                <Text style={styles.totalMainValue}>
                  {formatTotalCurrency(calculatedTotal)}
                </Text>
              </View>
            </View>

            {/* Nút hành động */}
            <View style={styles.actionButtons}>
              <CustomButton
                title="Huỷ bỏ"
                variant="outline"
                onPress={onClose}
                style={styles.cancelBtn}
              />
              <CustomButton
                title="Xác nhận đặt sân"
                variant="primary"
                onPress={handleSubmit}
                loading={isSubmitting}
                style={styles.confirmBtn}
              />
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.modalOverlay,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: spacing.md,
  },
  modalTitle: {
    ...typography.sectionTitle,
    fontSize: 19,
    color: colors.textPrimary,
  },
  modalSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '700',
  },
  formScroll: {
    marginBottom: spacing.sm,
  },
  rowInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  quickHoursRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
    flexWrap: 'wrap',
  },
  quickHoursLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginRight: spacing.xs,
    fontWeight: '600',
  },
  quickHourChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 6,
    marginVertical: 2,
  },
  quickHourChipActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  quickHourChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  quickHourChipTextActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  totalBox: {
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
    padding: spacing.md,
    marginVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.primaryMuted,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  totalLabel: {
    ...typography.bodySecondary,
    color: colors.textSecondary,
  },
  totalItemPrice: {
    ...typography.bodySecondary,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  totalItemHours: {
    ...typography.bodySecondary,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  totalDivider: {
    height: 1,
    backgroundColor: colors.primaryMuted,
    marginVertical: spacing.xs,
  },
  totalRowMain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  totalMainLabel: {
    ...typography.cardTitle,
    fontSize: 16,
    color: colors.primaryDark,
  },
  totalMainValue: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.primary,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  cancelBtn: {
    flex: 1,
    marginRight: spacing.sm,
  },
  confirmBtn: {
    flex: 2,
  },
});
