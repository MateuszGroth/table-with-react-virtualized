import React, { useMemo } from 'react';

import { CLASS_NAMES } from './constant';

const Row = props => {
    const className = useMemo(() => {
        let className = CLASS_NAMES.ROW;
        if (props.className) className += ` ${props.className}`;

        return className;
    }, [props]);

    const rowProps = { className };

    return <div {...rowProps}>{props.children}</div>;
};

export default React.memo(Row);
