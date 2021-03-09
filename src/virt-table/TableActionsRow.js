import React from 'react';
import { CLASS_NAMES } from './constant';

const TableActionsRow = props => {
    return (
        <div className={`${CLASS_NAMES.ACTIONS_ROW}${props.className ? ` ${props.className}` : ''}`}>
            {props.children}
        </div>
    );
};

export default TableActionsRow;
