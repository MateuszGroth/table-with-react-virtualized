import React from 'react';

import { CLASS_NAMES } from './constant';
import { mapHeader } from './helper';

const Header = ({ header, isExpandable, CellComponent, RowComponent }) => {
    return (
        <RowComponent className={CLASS_NAMES.HEADER}>
            {isExpandable ? <CellComponent className={CLASS_NAMES.SMALL_CELL}></CellComponent> : ''}
            {mapHeader(header, CellComponent)}
        </RowComponent>
    );
};

export default React.memo(Header);
