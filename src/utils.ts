import { TNotesListItemShow } from "./type";

const formatDateToString = (val: Date) => {
  return val.toISOString();
};

export const getFormatNotesData = (notes: TNotesListItemShow[]) => {
  const notesArrayData = [];

  for (const note of notes) {
    const item = [note?.id, note?.title, note?.body, formatDateToString(note?.updated)];
    notesArrayData.push(item);
  }

  notesArrayData.unshift(['id', '标题', '内容', '更新时间']);

  const formatData = notesArrayData
    .map(res => res.join(','))
    .join(',\n');

  return formatData;
};