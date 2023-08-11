import { TextType } from '../../../types/types/text.type';

export interface ColumnMetaData {
  key: string;
  label: string;
  defaultValue?: string;
  isDisable?: boolean;
  className?: string;
  hint?: string;
  type?: TextType;
}

// default tabular data format - [{key1: value1, key2: value2}]
export type RowData = Record<string, string>;

export type TabularData = Array<RowData>;
