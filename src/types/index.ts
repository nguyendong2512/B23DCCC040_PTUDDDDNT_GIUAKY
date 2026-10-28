export type FieldType = '5 người' | '7 người';
export type FieldStatus = 'Hoạt động' | 'Bảo trì';

export interface Field {
  id: string;
  name: string;
  type: FieldType;
  pricePerHour: number;
  status: FieldStatus;
}

export interface Booking {
  id: string;
  fieldId: string;
  customerName: string;
  phone: string;
  date: string; // dd/mm/yyyy
  startHour: number; // 6 - 22
  hours: number; // 1 - 3
}

export type RootStackParamList = {
  FieldList: undefined;
  FieldForm: { field?: Field } | undefined;
  FieldDetail: { fieldId: string };
};
