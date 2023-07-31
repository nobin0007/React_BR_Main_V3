import React, { useMemo, useState } from 'react';
import MaterialReactTable from 'material-react-table';
import {
    Autocomplete,
    Box,
    Button,
    Checkbox,
    FormControlLabel,
    Grid,
    Radio,
    RadioGroup,
    TextField,
    Slider,
    Select,
    MenuItem,
    IconButton,
    Tooltip
} from "@mui/material";
const data = [
    {

        name: {
            firstName: 'John',

            lastName: 'Doe',

        },

        address: '261 Erdman Ford',

        city: 'East Daphne',

        state: 'Kentucky',

    },

    {

        name: {

            firstName: 'Jane',

            lastName: 'Doe',

        },

        address: '769 Dominic Grove',

        city: 'Columbus',

        state: 'Ohio',

    },

    {

        name: {

            firstName: 'Joe',

            lastName: 'Doe',

        },

        address: '566 Brakus Inlet',

        city: 'South Linda',

        state: 'West Virginia',

    },

    {

        name: {

            firstName: 'Kevin',

            lastName: 'Vandy',

        },

        address: '722 Emie Stream',

        city: 'Lincoln',

        state: 'Nebraska',

    },

    {

        name: {

            firstName: 'Joshua',

            lastName: 'Rolluffs',

        },

        address: '32188 Larkin Turnpike',

        city: 'Charleston',

        state: 'South Carolina',

    },
    {

        name: {

            firstName: 'Joshua',

            lastName: 'Rolluffs',

        },

        address: '32188 Larkin Turnpike',

        city: 'Charleston',

        state: 'South Carolina',

    },
    {

        name: {

            firstName: 'Joshua',

            lastName: 'Rolluffs',

        },

        address: '32188 Larkin Turnpike',

        city: 'Charleston',

        state: 'South Carolina',

    },
    {

        name: {

            firstName: 'Joshua',

            lastName: 'Rolluffs',

        },

        address: '32188 Larkin Turnpike',

        city: 'Charleston',

        state: 'South Carolina',

    },
    {

        name: {

            firstName: 'Joshua',

            lastName: 'Rolluffs',

        },

        address: '32188 Larkin Turnpike',

        city: 'Charleston',

        state: 'South Carolina',

    },
    {

        name: {

            firstName: 'Joshua',

            lastName: 'Rolluffs',

        },

        address: '32188 Larkin Turnpike',

        city: 'Charleston',

        state: 'South Carolina',

    },
    {

        name: {

            firstName: 'Joshua',

            lastName: 'Rolluffs',

        },

        address: '32188 Larkin Turnpike',

        city: 'Charleston',

        state: 'South Carolina',

    },
    {

        name: {

            firstName: 'Joshua',

            lastName: 'Rolluffs',

        },

        address: '32188 Larkin Turnpike',

        city: 'Charleston',

        state: 'South Carolina',

    },
    {

        name: {

            firstName: 'Joshua',

            lastName: 'Rolluffs',

        },

        address: '32188 Larkin Turnpike',

        city: 'Charleston',

        state: 'South Carolina',

    },
    {

        name: {

            firstName: 'Joshua',

            lastName: 'Rolluffs',

        },

        address: '32188 Larkin Turnpike',

        city: 'Charleston',

        state: 'South Carolina',

    },
    {

        name: {

            firstName: 'Joshua',

            lastName: 'Rolluffs',

        },

        address: '32188 Larkin Turnpike',

        city: 'Charleston',

        state: 'South Carolina',

    },
    {

        name: {

            firstName: 'Joshua',

            lastName: 'Rolluffs',

        },

        address: '32188 Larkin Turnpike',

        city: 'Charleston',

        state: 'South Carolina',

    },
    {

        name: {

            firstName: 'Joshua',

            lastName: 'Rolluffs',

        },

        address: '32188 Larkin Turnpike',

        city: 'Charleston',

        state: 'South Carolina',

    },
    {

        name: {

            firstName: 'Joshua',

            lastName: 'Rolluffs',

        },

        address: '32188 Larkin Turnpike',

        city: 'Charleston',

        state: 'South Carolina',

    },
    {

        name: {

            firstName: 'Joshua',

            lastName: 'Rolluffs',

        },

        address: '32188 Larkin Turnpike',

        city: 'Charleston',

        state: 'South Carolina',

    },
    {

        name: {

            firstName: 'Joshua',

            lastName: 'Rolluffs',

        },

        address: '32188 Larkin Turnpike',

        city: 'Charleston',

        state: 'South Carolina',

    },
    {

        name: {

            firstName: 'Joshua',

            lastName: 'Rolluffs',

        },

        address: '32188 Larkin Turnpike',

        city: 'Charleston',

        state: 'South Carolina',

    },

];

const TestMRT = () => {

    const columns = [

        {
            accessorKey: 'name.firstName', //access nested data with dot notation
            header: 'First Name',
            // Edit: ({ cell, column, table }) => (
            //     <TextField sx={{ width: '100%' }} InputProps={{ style: { fontSize: 12 }, disableUnderline: true }}
            //         variant="standard" size="small" />)
        },
        {
            accessorKey: 'name.lastName',
            header: 'Last Name',
            // Edit: ({ cell, column, table }) => (
            //     <TextField sx={{ width: '100%' }} InputProps={{ style: { fontSize: 12 }, disableUnderline: true }}
            //         variant="standard" size="small" />
            //     ),
        },

        {
            accessorKey: 'address', //normal accessorKey
            header: 'Address',
            Cell: ({ cell }) => {

                return (<TextField sx={{ width: '100%' }} defaultValue={cell.getValue()} InputProps={{ style: { fontSize: 12 }, disableUnderline: true }} inputRef={node => {
                    // console.log(node);
                    if (node) {
                        node.value = cell.getValue()
                    }
                }}
                    variant="standard" size="small" />)

            }
        },

        {
            accessorKey: 'city',
            header: 'City',
        },

        {
            accessorKey: 'state',
            header: 'State',
        },
    ];



    const [tableData, setTableData] = useState(() => data);


    const handleSaveCell = (cell, value) => {

        //if using flat data and simple accessorKeys/ids, you can just do a simple assignment here

        tableData[cell.row.index][cell.column.id] = value;
        tableData[2][cell.column.id] = value;


        //send/receive api updates here

        setTableData([...tableData]); //re-render with new data

    };

    const rupom = () => {
        console.log(tableData);

        tableData.splice(1, 1);
        console.log(tableData);

        tableData[0].address = "rupom";
        setTableData([...tableData]);
    }

    return (
        <>
            <MaterialReactTable

                columns={columns}

                data={tableData}

                // editingMode="table"

                // enableEditing

                muiTableBodyCellEditTextFieldProps={({ cell }) => ({

                    //onBlur is more efficient, but could use onChange instead

                    onBlur: (event) => {

                        handleSaveCell(cell, event.target.value);

                    },

                    variant: 'outlined',

                })}

            />
            <button onClick={rupom}>rupom</button>

        </>


    );

};


export default TestMRT;