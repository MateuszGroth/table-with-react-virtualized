import React from 'react';

import { CLASS_NAMES } from './constant';
import { processTableRow } from './helper';

import ExpandCell from './ExpandCell';

const BodyRow = props => {
    return (
        <props.RowComponent
            row={props.row}
            i={props.i}
            className={`${props.isExpanded ? CLASS_NAMES.EXPANDED_ROW : ''} ${props.rowClassName || ''}`}
        >
            {!props.isExpandable ? (
                ''
            ) : props.row.blockExpand ? (
                <props.CellComponent className={CLASS_NAMES.SMALL_CELL}></props.CellComponent>
            ) : (
                <ExpandCell
                    CellComponent={props.CellComponent}
                    isExpanded={props.isExpanded}
                    handleExpandToggle={props.handleExpandToggle}
                />
            )}
            {processTableRow(props.row, props.header, props.CellComponent)}
        </props.RowComponent>
    );
};

export default React.memo(BodyRow);
