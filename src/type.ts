export type TNotesListItem = {
  id: number;
  body: string;
  title: string;
  updated: string;
};
export type TNotesListItemShow = Omit<TNotesListItem , 'updated'> & {
  updated: Date;
};
