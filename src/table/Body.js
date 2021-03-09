import React from 'react';

import { CLASS_NAMES, DEFAULT_NO_DATA_MESSAGE } from './constant';

import BodyRow from './BodyRow';
import BodyParentRow from './BodyParentRow';

const Body = ({
    header,
    data,
    CellComponent,
    RowComponent,
    isExpandable,
    hideMessage = false,
    noDataMessage = DEFAULT_NO_DATA_MESSAGE
}) => {
    return (
        <div className={CLASS_NAMES.BODY}>
            {header.length && data.length ? (
                data.map((row, i) => {
                    if (row.cells.length > header.length) {
                        console.error('Table Component: Invalid Table data');
                        return null;
                    }
                    const rowProps = { key: i, row, i, RowComponent, CellComponent, header };
                    if (isExpandable) {
                        return <BodyParentRow {...rowProps} />;
                    }
                    return <BodyRow {...rowProps} />;
                })
            ) : hideMessage == null ? (
                <div className={CLASS_NAMES.NO_DATA_ROW}>{noDataMessage}</div>
            ) : (
                ''
            )}
        </div>
    );
};

export default React.memo(Body);
