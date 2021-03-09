import React, { useState, useEffect } from 'react';

import Cell from './Cell';
import Row from './Row';

import { CLASS_NAMES, HEADER_ATTRIBUTES } from './constant';

const getTableRowComponent = rowComponent => {
    if (rowComponent != null) {
        return rowComponent;
    }

    return Row;
};
const getTableCellComponent = cellComponent => {
    if (cellComponent != null) {
        return cellComponent;
    }

    return Cell;
};

const isAttributeProvided = (obj, attrName) => obj[attrName] != null;

const mapHeader = (header, CellComponent) => {
    return header.map((head, i) => {
        if (typeof head !== 'object') {
            return (
                <CellComponent key={i} className={CLASS_NAMES.HEADER_CELL}>
                    {head}
                </CellComponent>
            );
        }

        let className = CLASS_NAMES.HEADER_CELL;
        if (head.className) className += ` ${head.className}`;

        return (
            <CellComponent key={i} className={className}>
                {head.cellValue}
            </CellComponent>
        );
    });
};

const processTableRow = (row, header, CellComponent) =>
    row.cells.map((cellData, cellId) => {
        if (isAttributeProvided(header[cellId], HEADER_ATTRIBUTES.COLUMN_FORMATTER)) {
            return header[cellId][HEADER_ATTRIBUTES.COLUMN_FORMATTER](cellData, row, cellId);
        }
        if (isAttributeProvided(header[cellId], HEADER_ATTRIBUTES.COLUMN_VALUE_FORMATTER)) {
            const columnClassName = header[cellId][HEADER_ATTRIBUTES.COLUMN_CLASSNAME] || '';
            return (
                <CellComponent key={cellId} className={columnClassName}>
                    {header[cellId][HEADER_ATTRIBUTES.COLUMN_VALUE_FORMATTER](cellData, row, cellId)}
                </CellComponent>
            );
        }

        const tableCellProps = { key: cellId };

        const classNameArr = [];
        if (isAttributeProvided(header[cellId], HEADER_ATTRIBUTES.COLUMN_CLASSNAME)) {
            classNameArr.push(header[cellId][HEADER_ATTRIBUTES.COLUMN_CLASSNAME]);
        }
        if (typeof cellData === 'object' && cellData.className) {
            classNameArr.push(cellData.className);
        }

        if (classNameArr.length) {
            tableCellProps.className = classNameArr.join(' ');
        }

        if (typeof cellData !== 'object') {
            return <CellComponent {...tableCellProps}>{cellData}</CellComponent>;
        }

        return <CellComponent {...tableCellProps}>{cellData.cellValue}</CellComponent>;
    });

const useResizeObserver = ref => {
    const [dimensions, setDimensions] = useState(null);

    useEffect(() => {
        const referenceNode = ref.current;
        const resizeObserver = new ResizeObserver(entries => {
            setDimensions(entries[0].contentRect);
        });

        resizeObserver.observe(referenceNode);

        return () => {
            if (!referenceNode) {
                return;
            }
            resizeObserver.unobserve(referenceNode);
        };
    }, [ref]);
    return dimensions;
};

export {
    useResizeObserver,
    mapHeader,
    getTableRowComponent,
    isAttributeProvided,
    getTableCellComponent,
    processTableRow
};
