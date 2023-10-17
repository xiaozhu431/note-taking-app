import React from "react";
import { Upload } from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import "./App.css";
import { TNotesListItemShow } from "./type";
import { MAX_BODY_LENGTH } from "./const";
import useApp from "./useApp";

function App() {
  const {
    notes,
    activeNote,
    noteTitleRef,
    noteBodyRef,
    isEdit,
    modalContextHolder,
    messageContextHolder,
    upLoadProps,
    onNoteSelect,
    onNoteAdd,
    onNoteDelete,
    onNoteEdit,
    onNoteSave,
    onNoteExport,
  } = useApp();

  return (
    <div className="notes__wrapper">
      <div className="notes__sidebar">
        <button
          className="notes__add"
          type="button"
          onClick={onNoteAdd}
        >
          添加新的笔记 📒
        </button>
        <Upload {...upLoadProps} className="upload__wrapper">
          <button
            className="notes__import"
            type="button"
          >
            导入笔记 📒
          </button>
        </Upload>
        <button
          className="notes__export"
          type="button"
          disabled={notes?.length === 0}
          onClick={onNoteExport}
        >
          导出笔记 📒
        </button>
        <div className="notes__list">
          {notes.map(({ id, title, body, updated }: TNotesListItemShow) => {
            return (
              <div
                key={id}
                className={`notes__list-item ${
                  activeNote?.id === id ? "notes__list-item--selected" : ""
                }`}
                data-note-id={`${id}`}
                onClick={onNoteSelect(id)}
              >
                <div className="notes__small-title">{title}</div>
                <div className="notes__small-body">
                  {body?.substring(0, MAX_BODY_LENGTH)}
                  {body?.length > MAX_BODY_LENGTH ? "..." : ""}
                </div>
                <div className="notes__small-updated">
                  {updated?.toLocaleString(undefined, {
                    dateStyle: "full",
                    timeStyle: "short",
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div
        className="notes__preview"
        style={{ visibility: notes?.length > 0 ? "visible" : "hidden" }}
      >
        <div  className="notes__operation">
          <button
            className="notes__edit"
            type="button"
            onClick={onNoteEdit}
          >
            <EditOutlined />编辑笔记
          </button>
          <button
            className="notes__save"
            type="button"
            disabled={!isEdit}
            onClick={onNoteSave}
          >
            <DeleteOutlined />保存笔记
          </button>
          <button
            className="notes__delete"
            type="button"
            onClick={onNoteDelete}
          >
            <DeleteOutlined />删除笔记
          </button>
        </div>
        <input
          className="notes__title"
          type="text"
          placeholder="新笔记..."
          ref={noteTitleRef}
          disabled={!isEdit}
        />
        <textarea
          className="notes__body"
          ref={noteBodyRef}
          disabled={!isEdit}
        />
      </div>
      {modalContextHolder}
      {messageContextHolder}
    </div>
  );
}

export default App;
