import React, { useMemo } from 'react';

import { CLASS_NAMES } from './constant';

const Cell = props => {
    const className = useMemo(() => {
        let className = CLASS_NAMES.CELL;
        if (props.className) className += ` ${props.className}`;

        return className;
    }, [props]);

    const cellProps = { className };

    return <div {...cellProps}>{props.children}</div>;
};

export default React.memo(Cell);
