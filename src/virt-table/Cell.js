import React from 'react';

import { CLASS_NAMES } from './constant';

const Cell = props => {
    const cellProps = {};

    let className = CLASS_NAMES.CELL;
    if (props.className) className += ` ${props.className}`;
    cellProps.className = className;

    Object.entries(props).forEach(([key, value]) => {
        if (['className', 'rowData', 'rowId', 'children', `cellData`, 'cellId', 'isExpandCell'].includes(key)) {
            return;
        }

        if (typeof value === 'function') {
            return (cellProps[key] = value);
        }

        if (key === 'style') {
            return (cellProps[key] = value);
        }

        cellProps[key] = '' + value;
    });

    return <div {...cellProps}>{props.children}</div>;
};

export default React.memo(Cell);
