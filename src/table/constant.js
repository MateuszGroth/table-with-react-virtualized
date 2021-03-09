const CLASS_NAMES = {
    EXPAND_CELL: `r-table__expand-cell`,
    SMALL_CELL: `r-table__cell--sm`,
    HEADER: `r-table__header`,
    HEADER_CELL: `r-table__cell--head`,
    CELL: `r-table__cell`,
    ROW: `r-table__row`,
    NO_DATA_ROW: `r-table__row--nodata`,
    BODY: `r-table__body`,
    CHILDREN_ROW: 'r-table__children-row',
    CHILDREN_CONT: 'r-table__children-cont',
    EVEN_ROW: `r-table__row--even`,
    EXPANDED_ROW: `r-table__row--expanded`
};

const HEADER_ATTRIBUTES = {
    COLUMN_CLASSNAME: 'columnClassName',
    COLUMN_FORMATTER: 'columnFormatter',
    COLUMN_VALUE_FORMATTER: 'columnValueFormatter'
};

const DEFAULT_NO_DATA_MESSAGE = 'No data to display';

export { CLASS_NAMES, HEADER_ATTRIBUTES, DEFAULT_NO_DATA_MESSAGE };
