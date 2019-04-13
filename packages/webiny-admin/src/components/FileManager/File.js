// @flow
import React from "react";
import { css } from "emotion";
import { ReactComponent as Checked } from "./icons/round-check_box-24px.svg";

import { ReactComponent as InfoIcon } from "./icons/round-info-24px.svg";
import { ReactComponent as Details } from "./icons/round-description-24px.svg";
import { Menu, MenuItem } from "webiny-ui/Menu";
import { Ripple } from "webiny-ui/Ripple";
import { ListItemGraphic } from "webiny-ui/List";
import LazyLoad from "react-lazy-load";

const COMPONENT_WIDTH = 200;
const COMPONENT_HEIGHT = 200;

const styles = css({
    display: "inline-block",
    float: "left",
    position: "relative",
    zIndex: 1,
    margin: 10,
    cursor: "pointer",
    width: "100%",
    maxWidth: COMPONENT_WIDTH,
    border: "1px solid var(--mdc-theme-on-background)",
    borderRadius: 2,
    "> .body": {
        width: COMPONENT_WIDTH,
        height: COMPONENT_HEIGHT,
        overflow: "hidden",
        "--icon-color": "var(--mdc-theme-on-background)",
        "&:hover": {
            "--icon-color": "var(--mdc-theme-secondary)"
        },
        ".checkedIcon": {
            color: "var(--mdc-theme-secondary)",
            position: "absolute",
            top: 4,
            left: 4,
            zIndex: 11
        },
        ".infoIcon": {
            color: "var(--icon-color)",
            position: "absolute",
            top: 4,
            right: 4,
            zIndex: 10
        },
        ".filePreview": {
            textAlign: "center",
            position: "relative",
            backgroundColor: "#fff",
            width: "100%",
            height: "100%",
            ".clickableArea": {
                position: "absolute",
                top: 30,
                left: 0,
                width: "100%",
                height: 170,
                zIndex: 2
            }
        }
    },
    "> .label": {
        padding: "15px 10px",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        fontSize: "0.8rem",
        color: "var(--mdc-theme-on-surface)",
        backgroundColor: "var(--mdc-theme-on-background)"
    }
});

type Props = {
    file: Object,
    selected: boolean,
    uploadFile: Function,
    onSelect: Function,
    onClick: Function,
    options: ?Array<{ label: string, onClick: (file: Object) => void }>
};

function renderViewDetails({ MenuItem, MenuItemIcon, showFileDetails }) {
    return (
        <MenuItem onClick={showFileDetails}>
            <MenuItemIcon>
                <Details />
            </MenuItemIcon>
            Details
        </MenuItem>
    );
}

export default React.memo(
    function File(props: Props) {
        const {
            file,
            selected,
            onSelect,
            children,
            uploadFile,
            showFileDetails,
            options = []
        } = props;

        const menu = [renderViewDetails, ...options];
        return (
            <div className={styles}>
                <div className={"body"}>
                    <div className={"checkedIcon"} onClick={onSelect}>
                        {selected ? <Checked /> : null}
                    </div>
                    <div className={"infoIcon"}>
                        <Menu handle={<InfoIcon />}>
                            {menu.map((item, index) => (
                                <React.Fragment key={index}>
                                    {item({
                                        file,
                                        MenuItem,
                                        MenuItemIcon: ListItemGraphic,
                                        uploadFile,
                                        showFileDetails
                                    })}
                                </React.Fragment>
                            ))}
                        </Menu>
                    </div>
                    <LazyLoad height={200} offsetVertical={300}>
                        <Ripple>
                            <div className={"filePreview"}>
                                <div className="clickableArea" onClick={onSelect} />
                                {children}
                            </div>
                        </Ripple>
                    </LazyLoad>
                </div>
                <div className={"label"}>{file.name}</div>
            </div>
        );
    },
    (prev, next) => {
        if (prev.selected !== next.selected) {
            return false;
        }

        return true;
    }
);
