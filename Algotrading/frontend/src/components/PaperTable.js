import React, { useState } from "react";
import { withStyles, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@material-ui/core'

const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    body: {
        fontSize: 14,
    },
}))(TableCell);
  
const StyledTableRow = withStyles((theme) => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
    },
}))(TableRow);

const PaperTable = (props) => {
    if (props.result) {
        return (
        <TableContainer component={Paper} style={{maxHeight: 350}}>
            <Table aria-label="simple table" stickyHeader>
                <TableHead>
                    <TableRow>
                        {props.titles.map((name) => (
                            <StyledTableCell align="center">{name}</StyledTableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {Object.keys(props.result['Table']).map((row) => (
                        <StyledTableRow key={row[0]}>
                            {props.result['Table'][row].map((column) => (
                                <TableCell>
                                    {!String(column).includes("http") && column}
                                    {String(column).includes("http") && <a target="_blank" href={column}>Link</a>}
                                </TableCell>
                            ))}
                        </StyledTableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
        );
    }
}

export default PaperTable; 