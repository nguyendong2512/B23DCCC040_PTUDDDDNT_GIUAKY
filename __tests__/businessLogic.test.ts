import {
  validateFieldName,
  validateFieldPrice,
  validatePhone,
  validateDate,
  validateBookingHours,
  checkScheduleOverlap,
} from '../src/utils/validators';
import { formatCurrency, formatTimeRange, formatTotalCurrency } from '../src/utils/formatters';
import { Booking, Field } from '../src/types';

describe('Midterm FootballFieldApp Business Logic Tests', () => {
  const sampleFields: Field[] = [
    { id: 'f1', name: 'Sân A1', type: '5 người', pricePerHour: 250000, status: 'Hoạt động' },
    { id: 'f2', name: 'Sân A2', type: '5 người', pricePerHour: 300000, status: 'Hoạt động' },
    { id: 'f3', name: 'Sân B1', type: '7 người', pricePerHour: 450000, status: 'Hoạt động' },
    { id: 'f4', name: 'Sân B2', type: '7 người', pricePerHour: 500000, status: 'Bảo trì' },
  ];

  const sampleBookings: Booking[] = [
    {
      id: 'b1',
      fieldId: 'f1',
      customerName: 'Nguyễn Văn An',
      phone: '0912345678',
      date: '28/10/2026',
      startHour: 17,
      hours: 2, // 17h - 19h
    },
    {
      id: 'b2',
      fieldId: 'f1',
      customerName: 'Trần Minh Tuấn',
      phone: '0987654321',
      date: '28/10/2026',
      startHour: 19,
      hours: 1, // 19h - 20h
    },
  ];

  describe('Câu 1 - Định dạng giá tiền', () => {
    it('định dạng đúng "300.000 đ/giờ"', () => {
      expect(formatCurrency(300000)).toBe('300.000 đ/giờ');
      expect(formatCurrency(250000)).toBe('250.000 đ/giờ');
      expect(formatTotalCurrency(600000)).toBe('600.000 đ');
      expect(formatTimeRange(17, 2)).toBe('17:00 - 19:00 (2 giờ)');
    });
  });

  describe('Câu 2 - Kiểm tra dữ liệu sân (Validation)', () => {
    it('tên sân không được để trống', () => {
      expect(validateFieldName('', sampleFields).isValid).toBe(false);
      expect(validateFieldName('   ', sampleFields).isValid).toBe(false);
    });

    it('không được trùng tên sân khác', () => {
      expect(validateFieldName('Sân A1', sampleFields).isValid).toBe(false);
      expect(validateFieldName('sân a1', sampleFields).isValid).toBe(false);
      expect(validateFieldName('Sân C1', sampleFields).isValid).toBe(true);
    });

    it('cho phép giữ nguyên tên khi sửa chính sân đó', () => {
      expect(validateFieldName('Sân A1', sampleFields, 'f1').isValid).toBe(true);
      expect(validateFieldName('Sân A2', sampleFields, 'f1').isValid).toBe(false);
    });

    it('giá thuê là số > 0', () => {
      expect(validateFieldPrice('0').isValid).toBe(false);
      expect(validateFieldPrice('-50000').isValid).toBe(false);
      expect(validateFieldPrice('abc').isValid).toBe(false);
      expect(validateFieldPrice('300000').isValid).toBe(true);
      expect(validateFieldPrice('300000').value).toBe(300000);
    });
  });

  describe('Câu 5 - Kiểm tra số điện thoại và khung giờ hợp lệ', () => {
    it('số điện thoại phải là 10 chữ số, bắt đầu bằng 0', () => {
      expect(validatePhone('0912345678').isValid).toBe(true);
      expect(validatePhone('0398765432').isValid).toBe(true);
      expect(validatePhone('1234567890').isValid).toBe(false);
      expect(validatePhone('091234567').isValid).toBe(false); // 9 chữ số
      expect(validatePhone('09123456789').isValid).toBe(false); // 11 chữ số
      expect(validatePhone('091234abcd').isValid).toBe(false);
    });

    it('ngày phải theo định dạng dd/mm/yyyy', () => {
      expect(validateDate('28/10/2026').isValid).toBe(true);
      expect(validateDate('31/02/2026').isValid).toBe(false); // Tháng 2 không có ngày 31
      expect(validateDate('2026-10-28').isValid).toBe(false);
    });

    it('giờ bắt đầu từ 6 đến 22, số giờ thuê từ 1 đến 3, giờ kết thúc không quá 23h (hỗ trợ 1.5 giờ = 1h30p)', () => {
      expect(validateBookingHours('17', '2').isValid).toBe(true);
      expect(validateBookingHours('17', '1.5').isValid).toBe(true);
      expect(validateBookingHours('5', '2').isValid).toBe(false); // < 6h
      expect(validateBookingHours('23', '1').isValid).toBe(false); // > 22h
      expect(validateBookingHours('17', '0').isValid).toBe(false); // < 1 giờ
      expect(validateBookingHours('17', '4').isValid).toBe(false); // > 3 giờ
      // Giờ kết thúc không quá 23h: 22h thuê 2 giờ = 24h -> không hợp lệ
      expect(validateBookingHours('22', '2').isValid).toBe(false);
      // 22h thuê 1 giờ = 23h -> hợp lệ
      expect(validateBookingHours('22', '1').isValid).toBe(true);
    });
  });

  describe('Câu 5 - Kiểm tra trùng lịch đặt sân (Giao nhau)', () => {
    // Đã có lượt 17h-19h ngày 28/10/2026 trên sân f1
    it('đã có lượt 17h-19h thì không được đặt 18h-20h (trùng lịch)', () => {
      const result = checkScheduleOverlap(
        { fieldId: 'f1', date: '28/10/2026', startHour: 18, hours: 2 },
        sampleBookings
      );
      expect(result.hasOverlap).toBe(true);
    });

    it('đã có lượt 17h-19h thì được đặt 19h-20h (không trùng lịch)', () => {
      const result = checkScheduleOverlap(
        { fieldId: 'f1', date: '28/10/2026', startHour: 19, hours: 1 },
        sampleBookings,
        'b2' // exclude b2 itself to test slot
      );
      expect(result.hasOverlap).toBe(false);
    });

    it('đã có lượt 17h-19h thì được đặt 15h-17h (không trùng lịch)', () => {
      const result = checkScheduleOverlap(
        { fieldId: 'f1', date: '28/10/2026', startHour: 15, hours: 2 },
        sampleBookings
      );
      expect(result.hasOverlap).toBe(false);
    });

    it('đặt khác ngày hoặc khác sân thì không bị tính là trùng lịch', () => {
      // Khác ngày
      const diffDate = checkScheduleOverlap(
        { fieldId: 'f1', date: '29/10/2026', startHour: 17, hours: 2 },
        sampleBookings
      );
      expect(diffDate.hasOverlap).toBe(false);

      // Khác sân
      const diffField = checkScheduleOverlap(
        { fieldId: 'f2', date: '28/10/2026', startHour: 17, hours: 2 },
        sampleBookings
      );
      expect(diffField.hasOverlap).toBe(false);
    });
  });
});
