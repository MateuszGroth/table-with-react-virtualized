import React from 'react';

/**
 * Appends onClick, onContextMenu callbacks to cell component when provided
 * @param {Object} onCellClick
 * @param {Object} onCellContextMenu
 * @param {Object} CellComponent
 * @return {Object} CellComponent
 */
const TableBodyCellComponentWrapper = (onCellClick, onCellContextMenu, isBodyFocusable, CellComponent) => props => {
    if (!isBodyFocusable) {
        return <CellComponent {...props} />;
    }
    const newCellProps = { ...props };

    const eventData = {
        rowData: props.rowData,
        rowId: props.rowId,
        cellData: props.cellData,
        cellId: props.cellId
    };
    const isChildren = !props.isExpandCell && props.rowData.parentRowId != null && props.rowData.parent != null;
    if (isChildren) {
        eventData.parentRowId = props.rowData.parentRowId;
        eventData.parentRowData = props.rowData.parent;
    }

    if (onCellClick) {
        newCellProps.onMouseDown = event => {
            // do not fire onClick events when mouse down is triggered by context menu
            const isContextMenu = event.button === 2 || event.which === 3;
            if (isContextMenu) {
                return;
            }
            // using onMouseDown because focus functionality is messed up with onClick
            if (props.onMouseDown) {
                props.onMouseDown(event);
            }
            onCellClick(event, eventData, props.isExpandCell, isChildren);
        };
    }
    if (onCellContextMenu) {
        newCellProps.onContextMenu = event => onCellContextMenu(event, eventData, props.isExpandCell, isChildren);
    }

    return <CellComponent {...newCellProps} />;
};

export default TableBodyCellComponentWrapper;
