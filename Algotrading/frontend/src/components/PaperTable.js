import React, { useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress } from '@material-ui/core'

export default function PaperTable({result, titles}) {
    if (result) {
        return (
        <TableContainer component={Paper} style={{maxHeight: 350}}>
            <Table aria-label="simple table" stickyHeader>
                <TableHead>
                    <TableRow>
                        {titles.map((name) => (
                            <TableCell align="center">{name}</TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {Object.keys(result['Table']).map((row) => (
                        <TableRow>
                            {result['Table'][row].map((column) => (
                                <TableCell>
                                    {!String(column).includes("http") && column}
                                    {String(column).includes("http") && <a target="_blank" href={column}>Link</a>}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
        );
    }
}