import { Booking, Field } from '../types';

/**
 * Kiểm tra tên sân có hợp lệ và không trùng lặp
 */
export const validateFieldName = (
  name: string,
  existingFields: Field[],
  currentFieldId?: string
): { isValid: boolean; error?: string } => {
  const trimmed = name.trim();
  if (!trimmed) {
    return { isValid: false, error: 'Tên sân không được để trống' };
  }

  const isDuplicate = existingFields.some(
    field =>
      field.id !== currentFieldId &&
      field.name.trim().toLowerCase() === trimmed.toLowerCase()
  );

  if (isDuplicate) {
    return { isValid: false, error: 'Tên sân đã tồn tại, vui lòng nhập tên khác' };
  }

  return { isValid: true };
};

/**
 * Kiểm tra giá thuê theo giờ (> 0)
 */
export const validateFieldPrice = (
  priceStr: string
): { isValid: boolean; error?: string; value?: number } => {
  const trimmed = priceStr.trim();
  if (!trimmed) {
    return { isValid: false, error: 'Giá thuê không được để trống' };
  }

  const numericValue = Number(trimmed);
  if (isNaN(numericValue) || numericValue <= 0) {
    return { isValid: false, error: 'Giá thuê phải là số lớn hơn 0' };
  }

  return { isValid: true, value: numericValue };
};

/**
 * Kiểm tra số điện thoại (10 chữ số, bắt đầu bằng 0)
 */
export const validatePhone = (phone: string): { isValid: boolean; error?: string } => {
  const trimmed = phone.trim();
  if (!trimmed) {
    return { isValid: false, error: 'Số điện thoại không được để trống' };
  }
  const phoneRegex = /^0[0-9]{9}$/;
  if (!phoneRegex.test(trimmed)) {
    return {
      isValid: false,
      error: 'Số điện thoại phải gồm 10 chữ số và bắt đầu bằng số 0',
    };
  }
  return { isValid: true };
};

/**
 * Kiểm tra định dạng ngày dd/mm/yyyy
 */
export const validateDate = (dateStr: string): { isValid: boolean; error?: string } => {
  const trimmed = dateStr.trim();
  if (!trimmed) {
    return { isValid: false, error: 'Ngày đặt không được để trống' };
  }

  const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  const match = trimmed.match(dateRegex);
  if (!match) {
    return { isValid: false, error: 'Ngày phải đúng định dạng dd/mm/yyyy (ví dụ: 28/10/2026)' };
  }

  const day = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);
  const year = parseInt(match[3], 10);

  if (month < 1 || month > 12) {
    return { isValid: false, error: 'Tháng không hợp lệ (từ 01 đến 12)' };
  }

  const daysInMonth = new Date(year, month, 0).getDate();
  if (day < 1 || day > daysInMonth) {
    return { isValid: false, error: `Ngày không hợp lệ trong tháng ${month} (từ 01 đến ${daysInMonth})` };
  }

  if (year < 2020 || year > 2100) {
    return { isValid: false, error: 'Năm không hợp lệ' };
  }

  return { isValid: true };
};

/**
 * Kiểm tra giờ bắt đầu (6 đến 22) và số giờ thuê (1 đến 3), giờ kết thúc <= 23h
 */
export const validateBookingHours = (
  startHourStr: string,
  hoursStr: string
): { isValid: boolean; error?: string; startHour?: number; hours?: number } => {
  const startHour = parseFloat(startHourStr);
  const hours = parseFloat(hoursStr);

  if (isNaN(startHour) || startHour < 6 || startHour > 22) {
    return {
      isValid: false,
      error: 'Giờ bắt đầu phải là số từ 6 đến 22',
    };
  }

  if (isNaN(hours) || hours < 1 || hours > 3) {
    return {
      isValid: false,
      error: 'Số giờ thuê phải từ 1 đến 3 giờ (ví dụ: 1.5 là 1h30p)',
    };
  }

  if (startHour + hours > 23) {
    return {
      isValid: false,
      error: `Giờ kết thúc (${startHour + hours}h) không được vượt quá 23h`,
    };
  }

  return { isValid: true, startHour, hours };
};

/**
 * Kiểm tra trùng lịch đặt sân:
 * Cùng sân, cùng ngày và khung giờ giao nhau với lượt đặt đã có.
 * startA < endB && startB < endA
 */
export const checkScheduleOverlap = (
  newBooking: {
    fieldId: string;
    date: string;
    startHour: number;
    hours: number;
  },
  existingBookings: Booking[],
  excludeBookingId?: string
): { hasOverlap: boolean; conflictingBooking?: Booking } => {
  const newStart = newBooking.startHour;
  const newEnd = newBooking.startHour + newBooking.hours;
  const newDate = newBooking.date.trim();

  for (const existing of existingBookings) {
    if (excludeBookingId && existing.id === excludeBookingId) {
      continue;
    }

    if (
      existing.fieldId === newBooking.fieldId &&
      existing.date.trim() === newDate
    ) {
      const existingStart = existing.startHour;
      const existingEnd = existing.startHour + existing.hours;

      // Điều kiện giao nhau: newStart < existingEnd && existingStart < newEnd
      if (newStart < existingEnd && existingStart < newEnd) {
        return {
          hasOverlap: true,
          conflictingBooking: existing,
        };
      }
    }
  }

  return { hasOverlap: false };
};
