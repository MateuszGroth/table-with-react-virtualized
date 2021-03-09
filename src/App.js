import { useState, Fragment } from 'react';
import './App.scss';
import dataJSON from './data';
import TableOld from './Table';
import Table, {
    SearchBar,
    TableActionsRow,
    TableToolkitProvider,
    ExportPanel,
    TimeRangeSelector
} from './VirtTableTwo';

const header = [
    {
        cellValue: 'Pierwszy',
        // sortable: false,
        colId: 'test'
    },
    'Drugi',
    {
        cellValue: 'Trzeci'
    },
    {
        cellValue: 'Czwarty'
    },
    {
        cellValue: 'Piąty'
    },
    {
        cellValue: 'Szósty',
        columnWidth: 50
    },
    {
        cellValue: 'Siódmy'
    },
    {
        cellValue: 'Ósmy'
    },
    {
        cellValue: 'Dziewiąty'
    },
    {
        cellValue: 'Dziesiąty'
    }
];
// console.log(dataJSON);
let dataCopy1 = [];
let a = 0;
for (let i = 0; i < 1; i++) {
    dataCopy1 = [...dataCopy1, ...dataJSON.data];
}
let dataCopy = JSON.parse(JSON.stringify(dataCopy1));

let flag = true;
let start = new Date();
let end = new Date();

const getFormatterDate = date => `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

dataCopy.forEach(row => {
    row.cells[7].cellValue = `10.12.144.${a}`;
    row.cells[8].cellValue = a++;
    let tmpDate = new Date(start);
    tmpDate.setDate(start.getDate() - a);
    row.cells[9].cellValue = getFormatterDate(tmpDate);
    row.timestamp = tmpDate.getTime();
});

function App() {
    const [data, setData] = useState(dataCopy);
    const [initialStartDate, setDate] = useState(null);
    const [sort, setSort] = useState(true);
    const [filter, setFilter] = useState('8');
    return (
        <div className="table-cont">
            {/* <TableOld header={header} data={data} isExpandable={true} /> */}

            {/* ! Basic */}
            {/* <Table header={header} data={data} /> */}

            {/* ! Expandable */}
            {/* <Table
                header={header}
                data={data}
                isExpandable={true}
                onCellClick={(event, data) => {
                    console.log(data);
                }}
                onCellContextMenu={(event, data) => {
                    event.preventDefault();
                    console.log(data);
                }}
            /> */}

            {/* ! Clickable */}
            {/* <Table
                header={header}
                data={data}
                isExpandable={true}
                onCellClick={(event, data) => {
                    console.log(data);
                    // alert(`row id: ` + data.rowId + `, cell id :` + data.cellId);
                }}
                onCellContextMenu={(event, data) => {
                    event.preventDefault();
                    console.log(data);
                }}
            /> */}

            {/* ! Sortable */}
            {/* <TableToolkitProvider
                header={header}
                data={data}
                initialSortBy={0}
                initialSortDir="desc"
                isSortable={true}
                isExpandable={true}
                onCellClick={(event, data) => {
                    console.log(data);
                }}
                onCellContextMenu={(event, data) => {
                    event.preventDefault();
                    console.log(data);
                }}
            >
                {toolkitProps => (
                    <Fragment>
                        <Table {...toolkitProps} />
                    </Fragment>
                )}
            </TableToolkitProvider> */}

            {/* ! Exportable */}
            {/* <TableToolkitProvider
                header={header}
                data={data}
                initialSortBy={0}
                initialSortDir="desc"
                isSortable={true}
                // isExpandable={true}
                // isExportable={true}
                onCellClick={(event, data) => {
                    console.log(data);
                }}
                onCellContextMenu={(event, data) => {
                    event.preventDefault();
                    console.log(data);
                }}
            >
                {toolkitProps => (
                    <Fragment>
                        <TableActionsRow>
                            <ExportPanel {...toolkitProps} />
                        </TableActionsRow>
                        <Table {...toolkitProps} />
                    </Fragment>
                )}
            </TableToolkitProvider> */}

            {/* ! All */}
            <TableToolkitProvider
                header={header}
                data={data}
                initialSortBy={0}
                initialSortDir="desc"
                isSortable={sort}
                isExpandable={true}
                isExportable={true}
                isFilterEnabled={true}
                isTimeRangeSelectorEnabled={true}
                initialStartDate={initialStartDate}
                initialEndDate={end}
                // minDate={new Date().setDate(new Date().getDate() - 10)}
                // maxDate={new Date().setDate(new Date().getDate() + 1)}
                initialFilterText={filter}
                filterPlaceholder={'Search by all columns'}
                filterClassName="filter--wide"
                onFilterChange={filterText => {
                    console.log('filter change:', filterText);
                }}
                onDateChange={(startDate, endDate) => {
                    console.log('date change:', startDate, endDate);
                }}
                onCellContextMenu={(event, data) => {
                    console.log(data);
                }}
            >
                {toolkitProps => (
                    <Fragment>
                        <TableActionsRow>
                            <SearchBar {...toolkitProps} />
                            <TimeRangeSelector {...toolkitProps} />
                            <ExportPanel {...toolkitProps} />
                        </TableActionsRow>
                        <Table {...toolkitProps} />
                    </Fragment>
                )}
            </TableToolkitProvider>

            {/* <TableToolkitProvider
                header={header}
                data={data}
                initialSortBy={0}
                initialSortDir="desc"
                isSortable={true}
                isExpandable={true}
                isExportable={true}
                isFilterEnabled={true}
                initialFilterText={'8'}
                onCellClick={(event, data) => {
                    console.log(data);
                }}
                onCellContextMenu={(event, data) => {
                    event.preventDefault();
                    console.log(data);
                }}
            >
                {toolkitProps => (
                    <Fragment>
                        <button
                            className="btn"
                            onClick={() => {
                                setData(flag ? ((flag = false), dataJSON.data) : ((flag = true), dataCopy));
                            }}
                        >
                            Test
                        </button>
                        <TableActionsRow>
                            <SearchBar {...toolkitProps} />
                            <ExportPanel {...toolkitProps} />
                        </TableActionsRow>
                        <Table {...toolkitProps} />
                    </Fragment>
                )} */}
            {/* </TableToolkitProvider> */}
        </div>
    );
}

export default App;
