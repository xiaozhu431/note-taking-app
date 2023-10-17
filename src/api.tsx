import { TNotesListItem } from "./type";
import type { UploadFile } from "antd/es/upload/interface";

export default class NotesAPI {
  static getAllNotes(): TNotesListItem[] {
    const notes = JSON.parse(localStorage.getItem("notesapp-notes") || "[]");

    return notes.sort((a: TNotesListItem, b: TNotesListItem) => {
      return new Date(a.updated) > new Date(b.updated) ? -1 : 1;
    });
  }

  static saveNote(noteToSave: Omit<TNotesListItem, "updated">) {
    const notes = NotesAPI.getAllNotes();
    const existing = notes.find((note) => note.id === noteToSave.id);

    // Edit/Update
    if (existing) {
      existing.title = noteToSave.title;
      existing.body = noteToSave.body;
      existing.updated = new Date().toISOString();
    } else {
      notes.push({
        id: Math.floor(Math.random() * 1000000),
        body: noteToSave.body,
        title: noteToSave.title,
        updated: new Date().toISOString(),
      });
    }

    localStorage.setItem("notesapp-notes", JSON.stringify(notes));
  }

  static deleteNote(id: number) {
    const notes = NotesAPI.getAllNotes();
    const newNotes = notes.filter((note) => note.id != id);

    localStorage.setItem("notesapp-notes", JSON.stringify(newNotes));
  }

  static exportNotes(notesString: string, name?: string) {
    const uri =
      "data:text/csv;charset=utf-8,\ufeff" + encodeURIComponent(notesString);
    const downloadLink = document.createElement("a");
    downloadLink.href = uri;
    downloadLink.download = name ? `${name}.csv` : "temp.csv";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }

  static uploadNotes(file: UploadFile, callback: () => void) {
    const reader = new FileReader();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    reader.readAsText(file);
    reader.onload = function () {
      if (this.result) {
        const res = [];
        const formatData = (this.result as string).split("\r\n");

        for (const [index, value] of formatData.entries()) {
          if (index === 0 || !value) {
            continue;
          }

          const [id, title, body, updated] = value.split(",");
          res.push({
            id,
            title,
            body,
            updated,
          });
        }

        const curNotes = JSON.parse(localStorage.getItem("notesapp-notes") || "[]");
        localStorage.setItem("notesapp-notes", JSON.stringify([...curNotes, ...res]));

        if (callback) {
          callback();
        }
      }
    };
  }
}
