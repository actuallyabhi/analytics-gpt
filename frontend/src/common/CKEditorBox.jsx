import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import React from "react";

const API_URL = "https://api.beyondexams.org/api/v1";
const UPLOAD_ENDPOINT = "image_upload";

function uploadAdapter(loader) {
  return {
    upload: () => {
      return new Promise((resolve, reject) => {
        const body = new FormData();
        loader.file.then((file) => {
          body.append("files", file);
          // let headers = new Headers();
          // headers.append("Origin", "http://localhost:3000");
          fetch(`${API_URL}/${UPLOAD_ENDPOINT}`, {
            method: "post",
            body: body,
            // mode: "no-cors"
          })
            .then((res) => res.json())
            .then((res) => {
              resolve({
                default: `${res.default}`,
              });
            })
            .catch((err) => {
              reject(err);
              console.error(err);
            });
        });
      });
    },
  };
}
function uploadPlugin(editor) {
  editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
    return uploadAdapter(loader);
  };
}

const CKEditorBox = ({ placeholder, data, setData, onChange }) => {
  return (
    <CKEditor
      editor={ClassicEditor}
      config={{
        extraPlugins: [uploadPlugin],
        placeholder,
      }}
      data={data}
      onChange={(event, editor) => {
        if (typeof onChange === "function") {
          onChange(event, editor);
        }
        setData(editor.getData());
      }}
    />
  );
};

export default CKEditorBox;
