import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { Booking, Field } from '../types';
import {
  loadBookingsFromStorage,
  loadFieldsFromStorage,
  saveBookingsToStorage,
  saveFieldsToStorage,
} from '../services/storage';
import { checkScheduleOverlap } from '../utils/validators';

interface AppContextType {
  fields: Field[];
  bookings: Booking[];
  isLoading: boolean;
  activeFieldsCount: number;
  totalFieldsCount: number;
  addField: (fieldData: Omit<Field, 'id'>) => Promise<Field>;
  updateField: (field: Field) => Promise<void>;
  deleteField: (fieldId: string) => Promise<{ success: boolean; message?: string }>;
  addBooking: (
    bookingData: Omit<Booking, 'id'>
  ) => Promise<{ success: boolean; message?: string; booking?: Booking }>;
  cancelBooking: (bookingId: string) => Promise<void>;
  getFieldById: (fieldId: string) => Field | undefined;
  getBookingsForField: (fieldId: string) => Booking[];
  reloadFromStorage: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [fields, setFields] = useState<Field[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Khởi tạo và đọc dữ liệu từ AsyncStorage khi mở ứng dụng
  useEffect(() => {
    const initData = async () => {
      setIsLoading(true);
      try {
        const storedFields = await loadFieldsFromStorage();
        const storedBookings = await loadBookingsFromStorage();
        setFields(storedFields);
        setBookings(storedBookings);
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu khởi tạo:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initData();
  }, []);

  // Tính số lượng sân hoạt động / tổng số sân
  const activeFieldsCount = useMemo(() => {
    return fields.filter(f => f.status === 'Hoạt động').length;
  }, [fields]);

  const totalFieldsCount = fields.length;

  // Thêm sân mới
  const addField = async (fieldData: Omit<Field, 'id'>): Promise<Field> => {
    const newField: Field = {
      ...fieldData,
      id: 'field_' + Date.now().toString(),
    };
    const updated = [newField, ...fields];
    setFields(updated);
    await saveFieldsToStorage(updated);
    return newField;
  };

  // Cập nhật thông tin sân
  const updateField = async (updatedField: Field): Promise<void> => {
    const updated = fields.map(f => (f.id === updatedField.id ? updatedField : f));
    setFields(updated);
    await saveFieldsToStorage(updated);
  };

  // Xoá sân (Kiểm tra xem sân có lượt đặt nào không)
  const deleteField = async (
    fieldId: string
  ): Promise<{ success: boolean; message?: string }> => {
    const hasBookings = bookings.some(b => b.fieldId === fieldId);
    if (hasBookings) {
      return {
        success: false,
        message: 'Không thể xoá sân này vì đang có lượt đặt!',
      };
    }

    const updated = fields.filter(f => f.id !== fieldId);
    setFields(updated);
    await saveFieldsToStorage(updated);
    return { success: true };
  };

  // Thêm lượt đặt sân (có kiểm tra trùng lịch)
  const addBooking = async (
    bookingData: Omit<Booking, 'id'>
  ): Promise<{ success: boolean; message?: string; booking?: Booking }> => {
    // 1. Kiểm tra trạng thái sân: không cho đặt sân đang bảo trì
    const targetField = fields.find(f => f.id === bookingData.fieldId);
    if (!targetField) {
      return { success: false, message: 'Sân không tồn tại!' };
    }
    if (targetField.status === 'Bảo trì') {
      return { success: false, message: 'Sân đang bảo trì, không thể đặt sân!' };
    }

    // 2. Kiểm tra trùng lịch: cùng sân, cùng ngày và khung giờ giao nhau
    const overlapResult = checkScheduleOverlap(
      {
        fieldId: bookingData.fieldId,
        date: bookingData.date,
        startHour: bookingData.startHour,
        hours: bookingData.hours,
      },
      bookings
    );

    if (overlapResult.hasOverlap && overlapResult.conflictingBooking) {
      const conflict = overlapResult.conflictingBooking;
      const conflictEnd = conflict.startHour + conflict.hours;
      return {
        success: false,
        message: `Trùng lịch! Khung giờ này đã được đặt bởi khách "${conflict.customerName}" (${conflict.startHour}h:00 - ${conflictEnd}h:00).`,
      };
    }

    // 3. Tạo lượt đặt mới và lưu
    const newBooking: Booking = {
      ...bookingData,
      id: 'booking_' + Date.now().toString(),
    };
    const updated = [newBooking, ...bookings];
    setBookings(updated);
    await saveBookingsToStorage(updated);
    return { success: true, booking: newBooking };
  };

  // Huỷ lượt đặt sân
  const cancelBooking = async (bookingId: string): Promise<void> => {
    const updated = bookings.filter(b => b.id !== bookingId);
    setBookings(updated);
    await saveBookingsToStorage(updated);
  };

  // Lấy chi tiết sân theo id
  const getFieldById = (fieldId: string): Field | undefined => {
    return fields.find(f => f.id === fieldId);
  };

  // Lấy danh sách lượt đặt theo sân
  const getBookingsForField = (fieldId: string): Booking[] => {
    return bookings.filter(b => b.fieldId === fieldId);
  };

  const reloadFromStorage = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const storedFields = await loadFieldsFromStorage();
      const storedBookings = await loadBookingsFromStorage();
      setFields(storedFields);
      setBookings(storedBookings);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppContext.Provider
      value={{
        fields,
        bookings,
        isLoading,
        activeFieldsCount,
        totalFieldsCount,
        addField,
        updateField,
        deleteField,
        addBooking,
        cancelBooking,
        getFieldById,
        getBookingsForField,
        reloadFromStorage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
