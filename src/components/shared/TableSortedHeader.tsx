import { createStyles, makeStyles, TableCell, TableHead, TableRow, TableSortLabel, Theme } from '@material-ui/core';
import React from 'react';
import { Order } from '../../types';

export interface HeadCell {
    disablePadding: boolean;
    id: string;
    label: string;
    numeric: boolean;
}

interface TableSortedHeaderProps {
    onRequestSort: (event: React.MouseEvent<unknown>, property: string) => void;
    order: Order;
    orderBy: string;
    headCells: HeadCell[];
    deleteRowCell?: boolean;
    totalCell?: string;
}

const TableSortedHeader: React.FC<TableSortedHeaderProps> = (props) => {
    const { order, orderBy, onRequestSort, headCells, deleteRowCell, totalCell } = props;

    const classes = useStyles();

    const createSortHandler = (property: string) => (event: React.MouseEvent<unknown>) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                    {deleteRowCell &&
                        <TableCell className={classes.deleteCell} >
                            
                        </TableCell>}
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={'justify'}
                        padding={headCell.disablePadding ? 'none' : 'default'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <span className={classes.visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </span>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
                {totalCell &&                
                <TableCell
                    key={'total'}
                    align={'right'}
                    padding={'default'}
                    sortDirection={order}
                >
                    <TableSortLabel
                        active={orderBy === 'total'}
                        direction={orderBy === 'total' ? order : 'asc'}
                        onClick={createSortHandler('total')}
                    >
                        {totalCell}
                        {orderBy === 'total' ? (
                            <span className={classes.visuallyHidden}>
                                {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                            </span>
                        ) : null}
                    </TableSortLabel>
                </TableCell>
                }
            </TableRow>
        </TableHead>
    );
};

export default TableSortedHeader;

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        visuallyHidden: {
            border: 0,
            clip: 'rect(0 0 0 0)',
            height: 1,
            margin: -1,
            overflow: 'hidden',
            padding: 0,
            position: 'absolute',
            top: 20,
            width: 1,
        },
        buttonContainer: {
            paddingLeft: '26px',
            paddingRight: '1px',
            width: '140px'
        },
        deleteCell: {
            width: 30,
        }
    }),
);