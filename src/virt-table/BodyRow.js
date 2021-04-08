import React from 'react';

import { CLASS_NAMES } from './constant';
import { processTableRow } from './helper';

import ExpandCell from './ExpandCell';

const BodyRow = props => {
    return (
        <props.RowComponent
            rowData={props.rowData}
            rowId={props.rowId}
            style={props.style}
            className={`${props.isExpanded ? CLASS_NAMES.EXPANDED_ROW : ''}${
                props.rowClassName ? ` ${props.rowClassName}` : ''
            }${props.rowData.className ? ` ${props.row.className}` : ''}${
                props.isBodyFocusable ? ` ${CLASS_NAMES.FOCUSABLE_ROW}` : ''
            }`}
        >
            {!props.isExpandable ? (
                ''
            ) : props.rowData.blockExpand ? (
                <props.CellComponent
                    className={`${CLASS_NAMES.SMALL_CELL}${
                        props.focusedCellId === 0 ? ` ${CLASS_NAMES.FOCUS_CELL}` : ''
                    }`}
                ></props.CellComponent>
            ) : (
                <ExpandCell
                    CellComponent={props.CellComponent}
                    isExpanded={props.isExpanded}
                    handleExpandToggle={props.handleExpandToggle}
                    isFocused={props.focusedCellId === 0}
                    rowId={props.rowId}
                />
            )}
            {processTableRow(
                props.rowData,
                props.rowId,
                props.header,
                props.isExpandable,
                props.focusedCellId,
                props.CellComponent
            )}
        </props.RowComponent>
    );
};

export default React.memo(BodyRow);
