import AsyncStorage from '@react-native-async-storage/async-storage';
import { Booking, Field } from '../types';

const FIELDS_STORAGE_KEY = '@football_app_fields';
const BOOKINGS_STORAGE_KEY = '@football_app_bookings';

export const INITIAL_FIELDS: Field[] = [
  {
    id: 'field_1',
    name: 'Sân A1',
    type: '5 người',
    pricePerHour: 250000,
    status: 'Hoạt động',
  },
  {
    id: 'field_2',
    name: 'Sân A2',
    type: '5 người',
    pricePerHour: 300000,
    status: 'Hoạt động',
  },
  {
    id: 'field_3',
    name: 'Sân B1',
    type: '7 người',
    pricePerHour: 450000,
    status: 'Hoạt động',
  },
  {
    id: 'field_4',
    name: 'Sân B2',
    type: '7 người',
    pricePerHour: 500000,
    status: 'Bảo trì',
  },
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'booking_1',
    fieldId: 'field_1',
    customerName: 'Nguyễn Văn An',
    phone: '0912345678',
    date: '28/10/2026',
    startHour: 17,
    hours: 2,
  },
  {
    id: 'booking_2',
    fieldId: 'field_1',
    customerName: 'Trần Minh Tuấn',
    phone: '0987654321',
    date: '28/10/2026',
    startHour: 19,
    hours: 1,
  },
  {
    id: 'booking_3',
    fieldId: 'field_2',
    customerName: 'Lê Hoàng Nam',
    phone: '0901234567',
    date: '29/10/2026',
    startHour: 18,
    hours: 2,
  },
];

/**
 * Load danh sách sân từ AsyncStorage. Nếu chưa có thì khởi tạo sẵn 4 sân mẫu.
 */
export const loadFieldsFromStorage = async (): Promise<Field[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(FIELDS_STORAGE_KEY);
    if (jsonValue !== null) {
      const parsed = JSON.parse(jsonValue);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
    // Lần chạy đầu tiên: khởi tạo sẵn ít nhất 4 sân
    await AsyncStorage.setItem(FIELDS_STORAGE_KEY, JSON.stringify(INITIAL_FIELDS));
    return INITIAL_FIELDS;
  } catch (e) {
    console.error('Lỗi khi đọc danh sách sân từ storage:', e);
    return INITIAL_FIELDS;
  }
};

/**
 * Lưu danh sách sân vào AsyncStorage
 */
export const saveFieldsToStorage = async (fields: Field[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(FIELDS_STORAGE_KEY, JSON.stringify(fields));
  } catch (e) {
    console.error('Lỗi khi lưu danh sách sân vào storage:', e);
  }
};

/**
 * Load danh sách lượt đặt từ AsyncStorage. Nếu chưa có thì khởi tạo sẵn 3 lượt đặt mẫu.
 */
export const loadBookingsFromStorage = async (): Promise<Booking[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(BOOKINGS_STORAGE_KEY);
    if (jsonValue !== null) {
      const parsed = JSON.parse(jsonValue);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
    // Lần chạy đầu tiên: khởi tạo sẵn ít nhất 3 lượt đặt mẫu
    await AsyncStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(INITIAL_BOOKINGS));
    return INITIAL_BOOKINGS;
  } catch (e) {
    console.error('Lỗi khi đọc danh sách đặt sân từ storage:', e);
    return INITIAL_BOOKINGS;
  }
};

/**
 * Lưu danh sách lượt đặt vào AsyncStorage
 */
export const saveBookingsToStorage = async (bookings: Booking[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(bookings));
  } catch (e) {
    console.error('Lỗi khi lưu danh sách đặt sân vào storage:', e);
  }
};
