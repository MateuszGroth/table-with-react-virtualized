import React, { useState, Fragment } from 'react';

import BodyRow from './BodyRow';

import { CLASS_NAMES } from './constant';

const BodyParentRow = props => {
    const [isExpanded, setIsExpanded] = useState(props.row.isExpanded);
    const handleExpandToggle = () => {
        setIsExpanded(prevState => {
            props.row.isExpanded = !prevState;
            return props.row.isExpanded;
        });
    };
    return (
        <Fragment>
            <BodyRow
                {...props}
                isExpandable={true}
                isExpanded={isExpanded}
                handleExpandToggle={handleExpandToggle}
                rowClassName={props.i % 2 === 0 ? CLASS_NAMES.EVEN_ROW : ''}
            />
            {isExpanded ? (
                <div className={CLASS_NAMES.CHILDREN_CONT}>
                    {props.row.children.map((row, i) => (
                        <BodyRow
                            key={i}
                            i={i}
                            row={row}
                            header={props.header}
                            RowComponent={props.RowComponent}
                            CellComponent={props.CellComponent}
                            rowClassName={CLASS_NAMES.CHILDREN_ROW}
                        />
                    ))}
                </div>
            ) : (
                ''
            )}
        </Fragment>
    );
};

export default React.memo(BodyParentRow);
