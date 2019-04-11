// @flow
import React, { useState } from "react";
import type { FilesRules } from "react-butterfiles";
import FileManagerView from "./FileManager/FileManagerView";

type Props = {
    onChange: Function,
    selection: FilesRules,
    children: ({ showFileManger: Function }) => React.Node
};

function FileManager({ onChange, selection, children }: Props) {
    const [show, setShow] = useState(false);

    return (
        <>
            {show && (
                <FileManagerView
                    onChange={onChange}
                    selection={selection}
                    onClose={() => setShow(false)}
                />
            )}
            {children({
                showFileManager: () => setShow(true)
            })}
        </>
    );
}

export { FileManager };
