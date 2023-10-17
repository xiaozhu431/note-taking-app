import { useCallback, useEffect, useRef, useState } from "react";
import { Modal, message } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { TNotesListItemShow } from "./type";
import NotesAPI from "./api";
import React from "react";
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
import { getFormatNotesData } from "./utils";

const useApp = () => {
  const [notes, setNotes] = useState<Array<TNotesListItemShow>>([]);
  const [activeNote, setActiveNote] = useState<TNotesListItemShow>();
  const noteTitleRef = useRef<HTMLInputElement>(null);
  const noteBodyRef = useRef<HTMLTextAreaElement>(null);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [modal, modalContextHolder] = Modal.useModal();
  const [messageApi, messageContextHolder] = message.useMessage();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const upLoadProps: UploadProps = {
    beforeUpload: (file) => {
      if (!file.type.includes('csv')) {
        messageApi.open({
          type: 'warning',
          content: '仅支持读取csv格式',
        });
      } else {
        setFileList([file]);
      }
      return false;
    },
    onChange: () => {
      if (fileList.length) {
        NotesAPI.uploadNotes(fileList[0], _refreshNotes);
        messageApi.open({
          type: 'success',
          content: '导入成功',
        });
      }
    },
    fileList,
    showUploadList: false,
  };

  useEffect(() => {
    _refreshNotes();
  }, []);
  
  const onNoteSelect = useCallback(
    (noteId: number) => {
      return () => {
        setIsEdit(false);
        const selectedNote = notes.find((note) => note.id === noteId);
        selectedNote && _setActiveNote(selectedNote);
      }
    },
    [notes],
  );

  const onNoteAdd = useCallback(
    () => {
      const newNote = {
        id: -1,
        title: "新建笔记",
        body: "开始记录...",
      };

      NotesAPI.saveNote(newNote);
      setIsEdit(true);
      _refreshNotes();
    },
    [],
  );

  const onNoteDelete = useCallback(
    () => {
      modal.confirm({
        title: '删除',
        icon: <ExclamationCircleOutlined />,
        content: '确定删除',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          NotesAPI.deleteNote((activeNote as TNotesListItemShow)?.id);
          setIsEdit(false);
          messageApi.open({
            type: 'success',
            content: '删除成功',
          });
          _refreshNotes();
        },
      });
    },
    [activeNote],
  );
  const onNoteEdit = useCallback(
    () => {
      setIsEdit(true);
    },
    [],
  );
  const onNoteSave = useCallback(
    () => {
      const updatedTitle = (noteTitleRef.current as HTMLInputElement).value.trim();
      const updatedBody = (noteBodyRef.current as HTMLTextAreaElement).value.trim();
      NotesAPI.saveNote({
        id: (activeNote as TNotesListItemShow).id,
        title: updatedTitle,
        body: updatedBody,
      });
      setIsEdit(false);
      messageApi.open({
        type: 'success',
        content: '保存成功',
      });
      _refreshNotes();      
    },
    [activeNote],
  );

  const onNoteExport = useCallback(
    () => {
      const data = getFormatNotesData(notes);
      console.log(data);
      NotesAPI.exportNotes(data);
      
    },
    [notes],
  );

  function _setActiveNote(note: TNotesListItemShow) {
    setActiveNote(note);
    (noteTitleRef.current as HTMLInputElement).value = note?.title;
    (noteBodyRef.current as HTMLTextAreaElement).value = note?.body;
  }

  function _refreshNotes() {
    const notes = NotesAPI
      .getAllNotes()
      .map(note => ({
        ...note,
        updated: new Date(note.updated),
      }));
    setNotes(notes);

    if (notes.length > 0) {
      _setActiveNote(notes[0]);
    }
  }

  return {
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
  };
};
export default useApp;