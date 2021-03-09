import React from 'react';

import { CLASS_NAMES } from './constant';

const Row = props => {
    const rowProps = {};
    let className = CLASS_NAMES.ROW;
    if (props.className) className += ` ${props.className}`;

    rowProps.className = className;
    Object.entries(props).forEach(([key, value]) => {
        if (['className', 'rowData', 'rowId', 'children'].includes(key)) {
            return;
        }

        if (typeof value === 'function') {
            return (rowProps[key] = value);
        }

        if (key === 'style') {
            return (rowProps[key] = value);
        }

        rowProps[key] = '' + value;
    });

    return <div {...rowProps}>{props.children}</div>;
};

export default React.memo(Row);
