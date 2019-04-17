// @flow
import React, { useReducer } from "react";
import { css } from "emotion";
import { ImageEditorDialog } from "webiny-ui/ImageUpload";
import dataURLtoBlob from "dataurl-to-blob";
import { Image } from "webiny-app/components";
import { Tooltip } from "webiny-ui/Tooltip";
import { IconButton } from "webiny-ui/Button";
import { ReactComponent as EditIcon } from "./icons/edit.svg";
import { Keys } from "webiny-admin/components/FileManager/useKeys";

const styles = css({
    maxHeight: 200,
    maxWidth: 200,
    width: "auto",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translateX(-50%) translateY(-50%)"
});

function toDataUrl(url) {
    return new Promise(resolve => {
        const xhr = new window.XMLHttpRequest();
        xhr.onload = function() {
            const reader = new window.FileReader();
            reader.onloadend = function() {
                resolve(reader.result);
            };
            reader.readAsDataURL(xhr.response);
        };
        xhr.open("GET", url);
        xhr.responseType = "blob";
        xhr.send();
    });
}

const initialState = { showImageEditor: false, dataUrl: null };
const reducer = (state, action) => {
    const next = { ...state };

    switch (action.type) {
        case "setDataUrl":
            next.dataUrl = action.dataUrl;
            next.showImageEditor = true;
            break;
        case "hideImageEditor":
            next.dataUrl = null;
            next.showImageEditor = false;
            break;
    }

    return next;
};

function EditAction(props) {
    const { file, uploadFile } = props;
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <>
            <Tooltip content={<span>Edit image</span>} placement={"bottom"}>
                <IconButton
                    icon={<EditIcon style={{ margin: "0 8px 0 0" }} />}
                    onClick={async () => {
                        dispatch({ type: "setDataUrl", dataUrl: await toDataUrl(file.src) });
                    }}
                />
            </Tooltip>
            <Keys zIndex={3} enabled={state.dataUrl}>
                <ImageEditorDialog
                    open={state.showImageEditor}
                    src={state.dataUrl}
                    onClose={() => dispatch({ type: "hideImageEditor" })}
                    onAccept={src => {
                        const blob = dataURLtoBlob(src);
                        blob.name = file.name;
                        uploadFile(blob);
                        dispatch({ type: "hideImageEditor" });
                    }}
                />
            </Keys>
        </>
    );
}

export default {
    name: "file-manager-file-type-image",
    type: "file-manager-file-type",
    types: ["image/jpeg", "image/jpg", "image/gif", "image/png"],
    render: function render({ file }) {
        return (
            <Image className={styles} src={file.src} alt={file.name} transform={{ width: 300 }} />
        );
    },
    fileDetails: {
        actions: [EditAction]
    }
};
