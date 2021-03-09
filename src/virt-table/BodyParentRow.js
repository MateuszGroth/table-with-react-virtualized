import React, { useState, useEffect } from 'react';

import BodyRow from './BodyRow';

import { CLASS_NAMES } from './constant';

const BodyParentRow = props => {
    const [isExpanded, setIsExpanded] = useState(props.rowData.isExpanded);
    const handleExpandToggle = ev => {
        // ev.stopPropagation();
        // ev.preventDefault();

        setIsExpanded(prevState => {
            props.rowData.isExpanded = !prevState;
            return props.rowData.isExpanded;
        });
        props.handleExpandRow(props.rowId);
    };

    useEffect(() => {
        // passing the expand toggle function to the rowData obj so it could be toggled with keydown events
        // it is not the clearest way, but most efficient, because the `clearer` ways would require
        // procesing the data so each row has unique id and keeping expandable row ids in the state at HOC
        props.rowData.toggleExpand = handleExpandToggle;
    });

    useEffect(() => {
        if (props.rowData == null && isExpanded) {
            return setIsExpanded(false);
        }

        if (!!props.rowData.isExpanded !== !!isExpanded) {
            return setIsExpanded(!!props.rowData.isExpanded);
        }
    }, [props.rowData.isExpanded, isExpanded, props.rowData]);
    const isChildrenFocused = props.focusedChildrenRowId != null;
    return (
        <div className={CLASS_NAMES.PARENT_ROW_WRAP} style={props.style}>
            <BodyRow
                {...{ ...props, style: {} }}
                isExpandable={true}
                isExpanded={isExpanded}
                handleExpandToggle={handleExpandToggle}
                rowClassName={props.rowClassName}
                focusedCellId={isChildrenFocused ? null : props.focusedCellId}
            />
            {isExpanded ? (
                <div className={CLASS_NAMES.CHILDREN_CONT}>
                    {props.rowData.children.map((childrenRowData, childrenrowId) => {
                        childrenRowData.parent = props.rowData;
                        childrenRowData.parentRowId = props.rowId;
                        const isCurrentChildrenFocused = childrenrowId === props.focusedChildrenRowId;
                        return (
                            <BodyRow
                                key={childrenrowId}
                                rowId={childrenrowId}
                                parentRowId={props.rowId}
                                // subtract 1 from focusedCellId because chilren rows have isExpandable == null
                                // so cells are shifted compared to parent rows
                                // example: if parent is focused on the 4th cell (focusedCellId = 4)
                                // but it has 1st cell appended to it - expand cell
                                // under 4th cell there is a children cell with id 3
                                // because they start appearing from the 2nd parent row cell
                                focusedCellId={isCurrentChildrenFocused ? props.focusedCellId - 1 : null}
                                rowData={childrenRowData}
                                header={props.header}
                                RowComponent={props.RowComponent}
                                CellComponent={props.CellComponent}
                                rowClassName={CLASS_NAMES.CHILDREN_ROW}
                            />
                        );
                    })}
                </div>
            ) : (
                ''
            )}
        </div>
    );
};

export default React.memo(BodyParentRow);
