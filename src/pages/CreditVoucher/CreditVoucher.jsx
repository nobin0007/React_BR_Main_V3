import React from 'react';
import axios from 'axios';
import { useState, useEffect, useCallback, useRef } from 'react';
import * as _ from 'lodash';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import produce from "immer";
import {
    Autocomplete,
    Box,
    Button,
    Checkbox,
    FormControlLabel,
    FormControl,
    FormLabel,
    Grid,
    Radio,
    RadioGroup,
    TextField,
    Typography,
    Slider,
    Select,
    MenuItem,
    Modal,
    IconButton,
    Tooltip,
    Stack
} from "@mui/material";
import { Delete, Edit } from '@mui/icons-material';

import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';


import { useForm, Controller } from "react-hook-form";
import './CreditVoucher.css';

// material table
import MaterialReactTable, { MRT_ColumnDef } from 'material-react-table';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

import Popper from "@material-ui/core/Popper";

import AttachmentLoader from '../../components/AttachmentLoader';

import { useStateContext } from '../../contexts/ContextProvider';
// import muiStyleCustom from '../muiStyleCustom';
import { redirect, useNavigate } from 'react-router-dom';

//----[loading 10 dummy empty rows on load]----//
const emptyRows = [
    { accountHead: { Name: "", AccountsId: "" }, controlAccName: { Name: "", id: "" }, project: { Name: "", Code: "", ProjectId: "" }, particulars: "", credit: "", name: { Name: "", TableName: "", Id: "" } },

    { accountHead: { Name: "", AccountsId: "" }, controlAccName: { Name: "", id: "" }, project: { Name: "", Code: "", ProjectId: "" }, particulars: "", credit: "", name: { Name: "", TableName: "", Id: "" } },

    { accountHead: { Name: "", AccountsId: "" }, controlAccName: { Name: "", id: "" }, project: { Name: "", Code: "", ProjectId: "" }, particulars: "", credit: "", name: { Name: "", TableName: "", Id: "" } },

    { accountHead: { Name: "", AccountsId: "" }, controlAccName: { Name: "", id: "" }, project: { Name: "", Code: "", ProjectId: "" }, particulars: "", credit: "", name: { Name: "", TableName: "", Id: "" } },

    { accountHead: { Name: "", AccountsId: "" }, controlAccName: { Name: "", id: "" }, project: { Name: "", Code: "", ProjectId: "" }, particulars: "", credit: "", name: { Name: "", TableName: "", Id: "" } },

    { accountHead: { Name: "", AccountsId: "" }, controlAccName: { Name: "", id: "" }, project: { Name: "", Code: "", ProjectId: "" }, particulars: "", credit: "", name: { Name: "", TableName: "", Id: "" } },

    { accountHead: { Name: "", AccountsId: "" }, controlAccName: { Name: "", id: "" }, project: { Name: "", Code: "", ProjectId: "" }, particulars: "", credit: "", name: { Name: "", TableName: "", Id: "" } },

    { accountHead: { Name: "", AccountsId: "" }, controlAccName: { Name: "", id: "" }, project: { Name: "", Code: "", ProjectId: "" }, particulars: "", credit: "", name: { Name: "", TableName: "", Id: "" } },

    { accountHead: { Name: "", AccountsId: "" }, controlAccName: { Name: "", id: "" }, project: { Name: "", Code: "", ProjectId: "" }, particulars: "", credit: "", name: { Name: "", TableName: "", Id: "" } },

    { accountHead: { Name: "", AccountsId: "" }, controlAccName: { Name: "", id: "" }, project: { Name: "", Code: "", ProjectId: "" }, particulars: "", credit: "", name: { Name: "", TableName: "", Id: "" } },

    // { accountHead: "", controlAccName: "", project: "", particulars: "", debit: "", credit: "", name: "" },
    // { accountHead: "", controlAccName: "", project: "", particulars: "", debit: "", credit: "", name: "" },
    // { accountHead: "", controlAccName: "", project: "", particulars: "", debit: "", credit: "", name: "" },
    // { accountHead: "", controlAccName: "", project: "", particulars: "", debit: "", credit: "", name: "" },
    // { accountHead: "", controlAccName: "", project: "", particulars: "", debit: "", credit: "", name: "" },
    // { accountHead: "", controlAccName: "", project: "", particulars: "", debit: "", credit: "", name: "" },
    // { accountHead: "", controlAccName: "", project: "", particulars: "", debit: "", credit: "", name: "" },
    // { accountHead: "", controlAccName: "", project: "", particulars: "", debit: "", credit: "", name: "" },
    // { accountHead: "", controlAccName: "", project: "", particulars: "", debit: "", credit: "", name: "" }
]



const emptyRowsFeatureOn = [
    { accountHead: { Name: "", AccountsId: "" }, controlAccName: { Name: "", id: "" }, project: { Name: "", Code: "", ProjectId: "" }, particulars: "", credit: "", name: [], nameClues: [] },
    { accountHead: { Name: "", AccountsId: "" }, controlAccName: { Name: "", id: "" }, project: { Name: "", Code: "", ProjectId: "" }, particulars: "", credit: "", name: [], nameClues: [] },
    { accountHead: { Name: "", AccountsId: "" }, controlAccName: { Name: "", id: "" }, project: { Name: "", Code: "", ProjectId: "" }, particulars: "", credit: "", name: [], nameClues: [] },
    { accountHead: { Name: "", AccountsId: "" }, controlAccName: { Name: "", id: "" }, project: { Name: "", Code: "", ProjectId: "" }, particulars: "", credit: "", name: [], nameClues: [] },
    { accountHead: { Name: "", AccountsId: "" }, controlAccName: { Name: "", id: "" }, project: { Name: "", Code: "", ProjectId: "" }, particulars: "", credit: "", name: [], nameClues: [] },
    { accountHead: { Name: "", AccountsId: "" }, controlAccName: { Name: "", id: "" }, project: { Name: "", Code: "", ProjectId: "" }, particulars: "", credit: "", name: [], nameClues: [] },
    { accountHead: { Name: "", AccountsId: "" }, controlAccName: { Name: "", id: "" }, project: { Name: "", Code: "", ProjectId: "" }, particulars: "", credit: "", name: [], nameClues: [] },
    { accountHead: { Name: "", AccountsId: "" }, controlAccName: { Name: "", id: "" }, project: { Name: "", Code: "", ProjectId: "" }, particulars: "", credit: "", name: [], nameClues: [] },
    { accountHead: { Name: "", AccountsId: "" }, controlAccName: { Name: "", id: "" }, project: { Name: "", Code: "", ProjectId: "" }, particulars: "", credit: "", name: [], nameClues: [] },
    { accountHead: { Name: "", AccountsId: "" }, controlAccName: { Name: "", id: "" }, project: { Name: "", Code: "", ProjectId: "" }, particulars: "", credit: "", name: [], nameClues: [] },
]

const NameComponent = (props) => {

    let nameArr = props.nameArr;
    let cellRowIndex = props.cellRowIndex;
    let btnNameModalFunct = props.btnNameModalFunct;

    let stringForTooltip = '';
    let stringForPTag = '';


    console.log('per index per name array from NAME COMPONENT ');
    console.log(cellRowIndex);
    console.log(nameArr);

    console.log("consoling from nameCompo, line 132: ");
    console.log(nameArr);


    for (let i = 0; i < nameArr.length; i++) {
        if (stringForTooltip) {

            if (nameArr[i].Name.includes('(Code:')) { //jodi name er moddhe Code lekha thake taile oita katum else katumna
                stringForTooltip = stringForTooltip + ', ' + (nameArr[i].Name.substring(0, nameArr[i].Name.indexOf("(")).trim()) + `(${nameArr[i].InputName})`;
                stringForPTag = stringForPTag + ', ' + (nameArr[i].Name.substring(0, nameArr[i].Name.indexOf("(")).trim());
            }
            else {
                stringForTooltip = stringForTooltip + ', ' + nameArr[i].Name + `(${nameArr[i].InputName})`;
                stringForPTag = stringForPTag + ', ' + nameArr[i].Name;
            }

        }
        else { // prothom name er jonno 1st e koma nai, ei else name ta j prothom name ta eita bujhaitese

            if (nameArr[i].Name.includes('(Code:')) {
                stringForTooltip = (nameArr[i].Name.substring(0, nameArr[i].Name.indexOf("(")).trim()) + `(${nameArr[i].InputName})`;
                stringForPTag = (nameArr[i].Name.substring(0, nameArr[i].Name.indexOf("(")).trim());
            }
            else {
                stringForTooltip = nameArr[i].Name + `(${nameArr[i].InputName})`;
                stringForPTag = nameArr[i].Name;
            }

        }
    }
    return (
        <div className='cursor-pointer text-13 w-full flex-wrap' onClick={() => { btnNameModalFunct(cellRowIndex) }}>
            <Tooltip title={stringForTooltip} arrow>
                <p className='text-13 w-full truncate'>
                    {stringForPTag}
                </p>
            </Tooltip>
        </div>

    )
}



const NameComponentDebit = (props) => {
    const { register, getValues, reset, control, setValue } = useForm();

    let nameArr = props.nameArr;
    // let cellRowIndex = props.cellRowIndex;
    let btnNameModalFunct = props.btnNameModalFunct;

    let stringForTooltip = '';
    let stringForPTag = '';


    console.log('per index per name array from NAME COMPONENT ');
    // console.log(cellRowIndex);
    console.log(nameArr);

    console.log("consoling from nameCompo, line 132: ");
    console.log(nameArr);


    for (let i = 0; i < nameArr.length; i++) {
        if (stringForTooltip) {

            if (nameArr[i].Name.includes('(Code:')) { //jodi name er moddhe Code lekha thake taile oita katum else katumna
                stringForTooltip = stringForTooltip + ', ' + (nameArr[i].Name.substring(0, nameArr[i].Name.indexOf("(")).trim()) + `(${nameArr[i].InputName})`;
                stringForPTag = stringForPTag + ', ' + (nameArr[i].Name.substring(0, nameArr[i].Name.indexOf("(")).trim());
            }
            else {
                stringForTooltip = stringForTooltip + ', ' + nameArr[i].Name + `(${nameArr[i].InputName})`;
                stringForPTag = stringForPTag + ', ' + nameArr[i].Name;
            }

        }
        else { // prothom name er jonno 1st e koma nai, ei else name ta j prothom name ta eita bujhaitese

            if (nameArr[i].Name.includes('(Code:')) {
                stringForTooltip = (nameArr[i].Name.substring(0, nameArr[i].Name.indexOf("(")).trim()) + `(${nameArr[i].InputName})`;
                stringForPTag = (nameArr[i].Name.substring(0, nameArr[i].Name.indexOf("(")).trim());
            }
            else {
                stringForTooltip = nameArr[i].Name + `(${nameArr[i].InputName})`;
                stringForPTag = nameArr[i].Name;
            }

        }
    }
    console.log("fresh names only: ");
    console.log(stringForPTag);

    return (
        <Tooltip title={stringForTooltip} arrow>
            <div className='cursor-pointer text-13 w-full flex-wrap' onClick={() => { btnNameModalFunct() }}>
                {/* <Tooltip title={stringForTooltip} arrow>
                <p className='text-13 w-full truncate'>
                    {stringForPTag}
                </p>
            </Tooltip> */}


                <Controller
                    name=""
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            sx={{ width: '100%' }} InputProps={{ style: { fontSize: 13 }, readOnly: true }}
                            value={stringForPTag}
                            InputLabelProps={{
                                style: { fontSize: 14 },
                                // shrink: field.value
                                shrink: (stringForPTag ? true : false)
                            }}
                            // inputRef={node => {
                            //     console.log(field);
                            //     console.log(node);
                            //     // if (node) {
                            //     //     node.value = voucherNumber;
                            //     // }
                            // }}
                            // onFocus={() => {
                            //     btnNameModalFunct();
                            // }}
                            // onBlur={() => {
                            //     field.focus = false;
                            // }}
                            // inputRef={vouchNoInpRef}
                            id="" label="Name" variant="standard" size="small" />
                    )}
                />
            </div>
        </Tooltip>


    )
}



const CreditVoucher = (props) => {

    const { voucherToEdit, setVoucherToEdit, jvToEdit, setJvToEdit, contraVouchToEdit, setContraVouchToEdit, debitVouchToEdit, setDebitVouchToEdit, creditVouchToEdit, setCreditVouchToEdit, vouchAgtVouchToEdit, setVouchAgtVouchToEdit } = useStateContext();


    //CHECK if userInfo is availaible, if not, redirect to login
    const navigate = useNavigate();
    if (!(localStorage.getItem("userInfo"))) {
        navigate('/');
    }

    // ---[show/hide panel,navbar]---
    const { setShowPanel, setShowNavbar } = useStateContext();
    useEffect(() => {
        setShowPanel(props.panelShow);
        setShowNavbar(props.navbarShow);
    }, [])

    console.log(creditVouchToEdit);

    var userInfo = { Name: '', LocationId: '' };
    var brFeatures = JSON.parse(localStorage.getItem("brFeature"));

    if (localStorage.getItem("userInfo")) {
        userInfo = JSON.parse(localStorage.getItem("userInfo"));
        console.log("Session User");
        console.log(userInfo);
    }

    const [attachments, setAttachments] = useState([]);
    const { register, getValues, reset, control, setValue } = useForm();

    // ---[datepicker states]---
    const [voucherDateState, setVoucherDateState] = useState(new Date());

    const [debitVoucherInfo, setDebitVoucherInfo] = useState({ accountHead: { Name: "", AccountsId: "" }, controlAccName: { Name: "", id: "" }, project: { Name: "", Code: "", ProjectId: "" }, particulars: "", debit: "", name: { Name: "", TableName: "", Id: "" } })
    const [voucherTableData, setVoucherTableData] = useState([]);
    const [exVoucherTableData, setExVoucherTableData] = useState([]);
    const [deletedVoucherDTRows, setDeletedVoucherDTRows] = useState([]);
    const [deletedRegedAttach, setDeletedRegedAttach] = useState([]);

    const [location, setLocation] = useState([]);

    const [accountsHeadDebit, setAccountsHeadDebit] = useState([]);
    const [accountsHead, setAccountsHead] = useState([]);
    const [project, setProject] = useState([]);

    const [allNames, setAllNames] = useState([]);
    const [total, setTotal] = useState({ credit: 0 });
    const [debitCreditWatch, setdebitCreditWatch] = useState(true);

    const [voucherIs, setVoucherIs] = useState(false);
    const [radioVal, setRadioVal] = useState('Bank');


    const [debitNameTrigger, setDebitNameTrigger] = useState(false);


    const [locationOutput, setLocationOutput] = useState({ Name: userInfo.LocationName, LocationId: userInfo.LocationId });



    const [nameModalOpen, setNameModalOpen] = useState(false);
    const nameModalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 500,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        pt: 1,
        px: 1,
        pb: 1,
    };

    const [nameModalInputs, setNameModalInputs] = useState({
        rowIndex: "",
        inputs: [
            { autoCompName: "", autoCompOptions: [] },
            // { autoCompName: "", autoCompOptions: [] }
        ]
    })



    ////-----------------auto comp list style-----------------
    const autoCompResStyles = (theme) => ({
        popper: {
            maxWidth: "fit-content",
            fontSize: "12px"
        }
    });

    const PopperMy = function (props) {
        return <Popper {...props} style={autoCompResStyles.popper} />;
    };

    const voucherTableColumns = [
        {
            accessorKey: 'delete', //access nested data with dot notation
            header: '',
            size: 60, //small column
            enableSorting: false,
            enableColumnActions: false,
            enableResizing: false,
            enableColumnFilter: false,
            muiTableHeadCellProps: ({ column }) => ({
                align: 'left',
            }),
            Cell: ({ cell }) => (
                (<Tooltip className={(voucherTableData[cell.row.index].accountHead?.AccountsId) ? 'visible' : 'invisible'} arrow placement="right" title="Delete">
                    <IconButton color="error" onClick={() => handleDeleteRow(cell.row.index)}>
                        <Delete />
                    </IconButton>
                </Tooltip>)

            ),
        },
        {
            accessorKey: 'accountHead.Name',
            header: 'Account Head',
            // enableSorting: false,
            // enableColumnActions: false,
            Cell: ({ cell }) => (
                <Autocomplete
                    id=""
                    PopperComponent={PopperMy}
                    clearOnEscape
                    disableClearable
                    freeSolo
                    size="small"
                    options={accountsHead}
                    value={(voucherTableData[cell.row.index].accountHead) ? (voucherTableData[cell.row.index].accountHead) : { Name: "", AccountsId: "" }}
                    onChange={(e, selectedOption) => {
                        handleAccountHeadSelect(cell.row.index, selectedOption);
                    }}

                    // onBlur={(e) => {
                    //     console.log("rupomtoyotknkj")
                    //     console.log(voucherTableData);
                    //     setVoucherTableData(...voucherTableData);
                    // }}
                    getOptionLabel={(option) => ((option.Name) ? option.Name : "")}
                    renderOption={(props, option) => (
                        <List {...props} key={option.AccountsId}>
                            <ListItem>
                                <ListItemText primary={option.Name}
                                />
                            </ListItem>
                        </List>
                    )}
                    renderInput={(params) =>
                        <TextField
                            sx={{ width: "100%" }}
                            {...params}
                            inputRef={(node) => {
                                if (node) {
                                    node.value = cell.getValue();
                                }
                            }}
                            // onBlur={() => { console.log(this) }}
                            InputProps={{ ...params.InputProps, style: { fontSize: 13 }, disableUnderline: true }}
                            variant="standard"
                            size="small"
                        />}
                />),

        },
        {
            accessorKey: 'controlAccName.Name', //access nested data with dot notation
            header: 'Control Account',
            // enableSorting: false,
            // enableColumnActions: false,
            Cell: ({ cell, column, table }) => (
                <TextField
                    sx={{ width: '100%' }}
                    value={(voucherTableData[cell.row.index].controlAccName.Name) ? (voucherTableData[cell.row.index].controlAccName.Name) : ""}
                    tabIndex="-1"
                    InputProps={{ style: { fontSize: 13 }, disableUnderline: true, readOnly: true }}
                    variant="standard" size="small" />)
        },
        {
            accessorKey: 'project.Name', //access nested data with dot notation
            header: 'Project',
            // enableSorting: false,
            // enableColumnActions: false,
            Cell: ({ cell, column, table }) => (
                <Autocomplete
                    id=""
                    PopperComponent={PopperMy}
                    clearOnEscape
                    disableClearable
                    freeSolo
                    size="small"
                    options={project}
                    value={(voucherTableData[cell.row.index].project) ? voucherTableData[cell.row.index].project : { Name: "", Code: "", ProjectId: "" }}
                    onChange={(e, selectedOption) => {
                        voucherTableData[cell.row.index].project = selectedOption;
                        setVoucherTableData([...voucherTableData]);
                    }}
                    getOptionLabel={(option) => (option.Name) ? option.Name : ""}
                    renderOption={(props, option) => (
                        <List {...props} key={option.ProjectId}>
                            <ListItem>
                                <ListItemText primary={option.Name}
                                />
                            </ListItem>
                        </List>
                    )}
                    renderInput={(params) =>
                        <TextField
                            sx={{ width: "100%" }}
                            {...params}
                            inputRef={(node) => {
                                if (node) {
                                    node.value = cell.getValue();
                                }
                            }}
                            InputProps={{ ...params.InputProps, style: { fontSize: 13 }, disableUnderline: true }}
                            variant="standard"
                            size="small"
                        />}
                />
            )
        },
        {
            accessorKey: 'particulars', //access nested data with dot notation
            header: 'Particulars',
            // sortUndefined: -1,
            // getSortingFn
            // enableSorting: false,
            // enableColumnActions: false,
            Cell: ({ cell, column, table }) => (
                <TextField sx={{ width: '100%' }} InputProps={{ style: { fontSize: 13 }, disableUnderline: true }}
                    variant="standard" size="small"
                    inputRef={node => {
                        if (node) {
                            node.value = cell.getValue() // othoba voucherTableData[cell.row.index].particulars, jehetu accessor key perfect, tai cell.getValue()
                        }
                    }}
                    onBlur={(e) => {
                        voucherTableData[cell.row.index].particulars = e.target.value;
                        setVoucherTableData([...voucherTableData]);
                    }} />),

            // sortingFn: (rowA, rowB, columnId) =>
            // {
            //     return (rowA.getValue(columnId) ? rowA.getValue(columnId) : 'zzzzzzzzzzzzzzzzz') > rowB.getValue(columnId) ? -1 : 1;
            // }
        },
        {
            accessorKey: 'credit', //access nested data with dot notation
            header: 'Credit',
            // enableSorting: true,
            // enableColumnActions: true,
            Cell: ({ cell, column, table }) => (
                <TextField sx={{ width: '100%' }} InputProps={{ style: { fontSize: 13 }, disableUnderline: true }}
                    variant="standard" size="small"
                    inputRef={node => {
                        if (node) {
                            node.value = cell.getValue()
                        }
                    }}
                    onBlur={(e) => {
                        if (e.target.value > 0) {
                            if (voucherTableData[cell.row.index].accountHead.AccountsId) {
                                voucherTableData[cell.row.index].credit = parseFloat((e.target.value)).toFixed(2);
                                setVoucherTableData([...voucherTableData]);
                                setdebitCreditWatch((prev) => !prev);
                            }
                            else {
                                toast.warning("Invalid input! Select an Account Head first!");
                                voucherTableData[cell.row.index].credit = 0;
                                setVoucherTableData([...voucherTableData]);
                                setdebitCreditWatch((prev) => !prev);
                            }
                        }
                        else {
                            voucherTableData[cell.row.index].credit = 0;
                            setVoucherTableData([...voucherTableData]);
                            setdebitCreditWatch((prev) => !prev);
                        }
                    }} />),
            Footer: () => (
                <p className='text-[13px]'>
                    Total credit: <label className='text-cyan-800 text-[13px]'>{total.credit}</label>
                </p>
            ),
        },

        {
            accessorKey: 'name.Name', //access nested data with dot notation
            header: 'Name',
            // enableSorting: false,
            // enableColumnActions: false,
            Cell: ({ cell, column, table }) => (
                <Autocomplete
                    id=""
                    PopperComponent={PopperMy}
                    clearOnEscape
                    disableClearable
                    freeSolo
                    size="small"
                    options={allNames}
                    value={(voucherTableData[cell.row.index].name) ? voucherTableData[cell.row.index].name : { Name: "", TableName: "", Id: "" }}
                    onChange={(e, selectedOption) => {
                        console.log(selectedOption);
                        voucherTableData[cell.row.index].name = { Name: selectedOption.Name, Id: selectedOption.Id, TableName: selectedOption.TableName };
                        setVoucherTableData([...voucherTableData]);;
                    }}
                    getOptionLabel={(option) => (option.Name) ? option.Name : ""}
                    renderOption={(props, option) => (
                        <List {...props} key={option.Id}>
                            <ListItem>
                                <ListItemText primary={option.Name}
                                    secondary={option.TableName} />
                            </ListItem>
                        </List>

                    )}
                    renderInput={(params) =>
                        <TextField
                            sx={{ width: "100%" }}
                            {...params}
                            inputRef={(node) => {
                                if (node) {
                                    node.value = cell.getValue();
                                }
                            }}
                            InputProps={{ ...params.InputProps, style: { fontSize: 13 }, disableUnderline: true }}
                            variant="standard"
                            size="small"
                        />}
                />)
        },

    ]

    const voucherTableColumnsFeatOn = [
        {
            accessorKey: 'delete', //access nested data with dot notation
            header: '',
            size: 60, //small column
            enableSorting: false,
            enableColumnActions: false,
            enableResizing: false,
            enableColumnFilter: false,
            muiTableHeadCellProps: ({ column }) => ({
                align: 'left',
            }),
            Cell: ({ cell }) => (
                (<Tooltip className={(voucherTableData[cell.row.index].accountHead?.AccountsId) ? 'visible' : 'invisible'} arrow placement="right" title="Delete">
                    <IconButton color="error" onClick={() => handleDeleteRow(cell.row.index)}>
                        <Delete />
                    </IconButton>
                </Tooltip>)

            ),
        },
        {
            accessorKey: 'accountHead.Name',
            header: 'Account Head',
            // enableSorting: false,
            // enableColumnActions: false,
            Cell: ({ cell }) => (
                <Autocomplete
                    id=""
                    PopperComponent={PopperMy}
                    clearOnEscape
                    disableClearable
                    freeSolo
                    size="small"
                    options={accountsHead}
                    value={(voucherTableData[cell.row.index].accountHead) ? (voucherTableData[cell.row.index].accountHead) : { Name: "", AccountsId: "" }}
                    onChange={(e, selectedOption) => {
                        handleAccountHeadSelectFeatOn(cell.row.index, selectedOption);
                    }}

                    // onBlur={(e) => {
                    //     console.log("rupomtoyotknkj")
                    //     console.log(voucherTableData);
                    //     setVoucherTableData(...voucherTableData);
                    // }}
                    getOptionLabel={(option) => ((option.Name) ? option.Name : "")}
                    renderOption={(props, option) => (
                        <List {...props} key={option.AccountsId}>
                            <ListItem>
                                <ListItemText primary={option.Name}
                                />
                            </ListItem>
                        </List>
                    )}
                    renderInput={(params) =>
                        <TextField
                            sx={{ width: "100%" }}
                            {...params}
                            inputRef={(node) => {
                                if (node) {
                                    node.value = cell.getValue();
                                }
                            }}
                            // onBlur={() => { console.log(this) }}
                            InputProps={{ ...params.InputProps, style: { fontSize: 13 }, disableUnderline: true }}
                            variant="standard"
                            size="small"
                        />}
                />),

        },
        {
            accessorKey: 'controlAccName.Name', //access nested data with dot notation
            header: 'Control Account',
            // enableSorting: false,
            // enableColumnActions: false,
            Cell: ({ cell, column, table }) => (
                <TextField
                    sx={{ width: '100%' }}
                    value={(voucherTableData[cell.row.index].controlAccName.Name) ? (voucherTableData[cell.row.index].controlAccName.Name) : ""}
                    tabIndex="-1"
                    InputProps={{ style: { fontSize: 13 }, disableUnderline: true, readOnly: true }}
                    variant="standard" size="small" />)
        },
        {
            accessorKey: 'project.Name', //access nested data with dot notation
            header: 'Project',
            // enableSorting: false,
            // enableColumnActions: false,
            Cell: ({ cell, column, table }) => (
                <Autocomplete
                    id=""
                    PopperComponent={PopperMy}
                    clearOnEscape
                    disableClearable
                    freeSolo
                    size="small"
                    options={project}
                    value={(voucherTableData[cell.row.index].project) ? voucherTableData[cell.row.index].project : { Name: "", Code: "", ProjectId: "" }}
                    onChange={(e, selectedOption) => {
                        voucherTableData[cell.row.index].project = selectedOption;
                        setVoucherTableData([...voucherTableData]);
                    }}
                    getOptionLabel={(option) => (option.Name) ? option.Name : ""}
                    renderOption={(props, option) => (
                        <List {...props} key={option.ProjectId}>
                            <ListItem>
                                <ListItemText primary={option.Name}
                                />
                            </ListItem>
                        </List>
                    )}
                    renderInput={(params) =>
                        <TextField
                            sx={{ width: "100%" }}
                            {...params}
                            inputRef={(node) => {
                                if (node) {
                                    node.value = cell.getValue();
                                }
                            }}
                            InputProps={{ ...params.InputProps, style: { fontSize: 13 }, disableUnderline: true }}
                            variant="standard"
                            size="small"
                        />}
                />
            )
        },
        {
            accessorKey: 'particulars', //access nested data with dot notation
            header: 'Particulars',
            // sortUndefined: -1,
            // getSortingFn
            // enableSorting: false,
            // enableColumnActions: false,
            Cell: ({ cell, column, table }) => (
                <TextField sx={{ width: '100%' }} InputProps={{ style: { fontSize: 13 }, disableUnderline: true }}
                    variant="standard" size="small"
                    inputRef={node => {
                        if (node) {
                            node.value = cell.getValue() // othoba voucherTableData[cell.row.index].particulars, jehetu accessor key perfect, tai cell.getValue()
                        }
                    }}
                    onBlur={(e) => {
                        voucherTableData[cell.row.index].particulars = e.target.value;
                        setVoucherTableData([...voucherTableData]);
                    }} />),

            // sortingFn: (rowA, rowB, columnId) =>
            // {
            //     return (rowA.getValue(columnId) ? rowA.getValue(columnId) : 'zzzzzzzzzzzzzzzzz') > rowB.getValue(columnId) ? -1 : 1;
            // }
        },
        {
            accessorKey: 'credit', //access nested data with dot notation
            header: 'Credit',
            // enableSorting: true,
            // enableColumnActions: true,
            Cell: ({ cell, column, table }) => (
                <TextField sx={{ width: '100%' }} InputProps={{ style: { fontSize: 13 }, disableUnderline: true }}
                    variant="standard" size="small"
                    inputRef={node => {
                        if (node) {
                            node.value = cell.getValue()
                        }
                    }}
                    onBlur={(e) => {
                        if (e.target.value > 0) {
                            if (voucherTableData[cell.row.index].accountHead.AccountsId) {
                                voucherTableData[cell.row.index].credit = parseFloat((e.target.value)).toFixed(2);
                                setVoucherTableData([...voucherTableData]);
                                setdebitCreditWatch((prev) => !prev);
                            }
                            else {
                                toast.warning("Invalid input! Select an Account Head first!");
                                voucherTableData[cell.row.index].credit = 0;
                                setVoucherTableData([...voucherTableData]);
                                setdebitCreditWatch((prev) => !prev);
                            }
                        }
                        else {
                            voucherTableData[cell.row.index].credit = 0;
                            setVoucherTableData([...voucherTableData]);
                            setdebitCreditWatch((prev) => !prev);
                        }
                    }} />),
            Footer: () => (
                <p className='text-[13px]'>
                    Total credit: <label className='text-cyan-800 text-[13px]'>{total.credit}</label>
                </p>
            ),
        },

        {
            accessorKey: 'name.Name', //access nested data with dot notation
            header: 'Name',
            // enableSorting: false,
            // enableColumnActions: false,
            Cell: ({ cell, column, table }) => (

                <div className={(voucherTableData[cell.row.index].accountHead?.AccountsId) ? 'visible flex justify-center' : 'invisible'}>
                    {voucherTableData[cell.row.index]?.name.length ? (
                        <NameComponent cellRowIndex={cell.row.index} nameArr={voucherTableData[cell.row.index]?.name} btnNameModalFunct={btnNameModal}></NameComponent>
                    ) :

                        (<button
                            type="button"
                            data-mdb-ripple="true"
                            data-mdb-ripple-color="light"
                            className="inline-block px-4 py-1.5 bg-slate-500 text-white font-medium text-xs leading-tight rounded-2xl shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-110  focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out"
                            onClick={() => { btnNameModal(cell.row.index) }}
                        >Click Here</button>)

                    }
                </div>


            )
        },

    ]


    const btnNameModal = (currentRowIndex) => {
        setNameModalInputs({
            rowIndex: "",
            inputs: []
        })

        setDebitNameTrigger(false);

        let currentRow = voucherTableData[currentRowIndex];
        console.log("modal j row te click korsi oi row of voucherTableData");
        console.log(currentRow);

        console.log("rupom dekhte chaay nameClues..............");
        // console.log(currentRow.nameClues);

        if (currentRow?.nameClues) {
            axios.post(`${userInfo.Ip}/API/CreditVouch/GetAutoCompOptions`, currentRow.nameClues)
                .then(res => {
                    console.log("rupom post re get banaise!!")
                    if (res) {
                        console.log(res.data);
                        setNameModalInputs({
                            rowIndex: currentRowIndex,
                            inputs: res.data
                        })

                        setNameModalOpen(true);
                    }
                })
        }


        //for loop diye fetch kortesi prottekta autocomplete er options....
        // for (let i = 0; i < currentRow.nameClues.length; i++) {

        //     fetch(`${userInfo.Ip}/API/DebitVouch/GetAutoCompOptions?queryTable=${currentRow.nameClues[i].QueryTable}&queryField=${currentRow.nameClues[i].QueryField}&queryFieldVal=${currentRow.nameClues[i].QueryFieldVal}`)
        //         .then(res =>
        //             res.json()
        //             // console.log(res);
        //         )
        //         .then((data) => {
        //             console.log(`Fetched data for name autocomp- ${currentRow.nameClues[i].autoCompName}`);
        //             console.log(data);
        //             if (data.length > 1) {
        //                 let autoCompsObj = {
        //                     autoCompName: currentRow.nameClues[i].autoCompName,
        //                     autoCompOptions: data
        //                 }
        //                 setNameModalInputs({
        //                     rowIndex: currentRowIndex,
        //                     inputs: [...nameModalInputs.inputs, autoCompsObj]
        //                 })
        //             }
        //         })
        //     console.log("rupom yoyoyoyoyoyo hello gg......")
        //     console.log(currentRow.nameClues[i]);
        //     //ofcourse make sure, properties of the modal State is getting empty on Modal Close
        //     //after writng this line, i set state all property empty on modal open,, son on close e empty is no more necessay, though u can do it anyway
        // }

    }


    const btnNameModalDebitTrigger = () => {
        setNameModalInputs({
            // rowIndex: "",
            inputs: []
        })

        setDebitNameTrigger(true);

        let currentRow = debitVoucherInfo;
        console.log("modal on korte bolsi debit Name theke!!");
        console.log(currentRow);

        // console.log("rupom dekhte chaay nameClues..............");
        // console.log(currentRow.nameClues);

        if (currentRow?.nameClues) {
            axios.post(`${userInfo.Ip}/API/CreditVouch/GetAutoCompOptions`, currentRow.nameClues)
                .then(res => {
                    console.log("rupom post re get banaise!!")
                    if (res) {
                        console.log(res.data);
                        setNameModalInputs({
                            // rowIndex: currentRowIndex,
                            inputs: res.data
                        })

                        setNameModalOpen(true);
                    }
                })
        }

    }

    useEffect(() => {
        // setVoucherTableData(emptyRows);


        // fetch(`${userInfo.Ip}/API/DebitVouch/CheckBrFeatures?companyId=${userInfo.CompanyId}`)
        //     .then(res =>
        //         res.json()
        //         // console.log(res);
        //     )
        //     .then((data) => {
        //         console.log("BR Feature check raw data.....");
        //         console.log(data);
        //         console.log(data.IsAllowed);
        //         setVarAccAnalysisBF(data.IsAllowed);
        //         if (data.IsAllowed) {
        //             setVoucherTableData(emptyRowsFeatureOn);
        //         }
        //         else {
        //             setVoucherTableData(emptyRows);
        //         }
        //         // console.log(varAccAnalysisBF);
        //     })


        if ((brFeatures?.VariableAccountAnalysis)) {
            setVoucherTableData(emptyRowsFeatureOn);
            setDebitVoucherInfo({ accountHead: { Name: "", AccountsId: "" }, controlAccName: { Name: "", id: "" }, project: { Name: "", Code: "", ProjectId: "" }, particulars: "", debit: "", name: [], nameClues: [] },)
        }
        else {
            setVoucherTableData(emptyRows);
        }

    }, [])

    useEffect(() => {
        // console.log("rupom");
        // console.log(total);

        // console.log("state changed");
        // console.log(voucherTableData);

        let totalCredit = 0;

        for (let i = 0; i < voucherTableData.length; i++) {
            if (voucherTableData[i].credit) {
                totalCredit = totalCredit + (isNaN(parseFloat(voucherTableData[i].credit)) ? 0 : parseFloat(voucherTableData[i].credit));
            }
        }
        setTotal({ credit: totalCredit.toFixed(2) });
        console.log(total);
    }, [debitCreditWatch])


    // -----[FETCH Data for edit/assigning]-----
    useEffect(() => {
        console.log("line no 517");
        console.log(creditVouchToEdit);

        if (creditVouchToEdit?.VoucherId) { //maane jodi creditVouchToEdit e kono voucher edit er jonno thake, mot kotha kono value thakle


            console.log("varAccAnalysisBF er value..........");
            console.log(brFeatures?.VariableAccountAnalysis);

            if (brFeatures?.VariableAccountAnalysis) {
                fetch(`${userInfo.Ip}/API/CreditVouch/Get_VoucherAllInfoFeatOn?voucherNo=${creditVouchToEdit.VoucherNo}&voucherId=${creditVouchToEdit.VoucherId}`)
                    .then(res =>
                        res.json()
                        // console.log(res);
                    )
                    .then((data) => {
                        console.log("Fetched Raw data for voucher Edit, Line No. 517.....");
                        console.log(data);
                        assignDataForEditFeatOn(data.Voucher.Date, data.Voucher.LocationId, data.Location.Name, data.Voucher.VoucherId, data.Voucher.VoucherNo, data.Voucher.AttachmentId, data.Voucher.ReferenceNo, data.Voucher.Description, data.V_VoucherDetailRows, data.Attachment?.AttachmentData_List)
                        // setAllNames(data);
                    })
            }
            else {
                fetch(`${userInfo.Ip}/API/CreditVouch/Get_VoucherAllInfo?voucherNo=${creditVouchToEdit.VoucherNo}&voucherId=${creditVouchToEdit.VoucherId}`)
                    .then(res =>
                        res.json()
                        // console.log(res);
                    )
                    .then((data) => {
                        console.log("Fetched Raw data for voucher Edit, Line No. 517.....");
                        console.log(data);
                        assignDataForEdit(data.Voucher.Date, data.Voucher.LocationId, data.Location.Name, data.Voucher.VoucherId, data.Voucher.VoucherNo, data.Voucher.AttachmentId, data.Voucher.ReferenceNo, data.Voucher.Description, data.V_VoucherDetailRows, data.Attachment?.AttachmentData_List)
                        // setAllNames(data);
                    })

            }




            // console.log("Context thakle ei IF e dhuke, line 510.....");
            // fetch(`${userInfo.Ip}/API/DebitVouch/Get_VoucherAllInfo?voucherNo=${creditVouchToEdit.VoucherNo}&voucherId=${creditVouchToEdit.VoucherId}`)
            //     .then(res =>
            //         res.json()
            //         // console.log(res);
            //     )
            //     .then((data) => {
            //         console.log("Fetched Raw data for voucher Edit, Line No. 517.....");
            //         console.log(data);
            //         assignDataForEdit(data.Voucher.Date, data.Voucher.LocationId, data.Location.Name, data.Voucher.VoucherId, data.Voucher.VoucherNo, data.Voucher.AttachmentId, data.Voucher.ReferenceNo, data.Voucher.Description, data.V_VoucherDetailRows, data.Attachment?.AttachmentData_List)

            //     })

        }
    }, [])

    // -----[FETCH Data for dropdowns,etc]-----
    useEffect(() => {
        console.log("Getting all data");

        fetch(`${userInfo.Ip}/API/CreditVouch/Get_Location?companyId=${userInfo.CompanyId}`)
            .then(res =>
                res.json()
                // console.log(res);
            )
            .then((data) => { console.log(data); setLocation(data) })


        fetch(`${userInfo.Ip}/API/CreditVouch/Get_Project?companyId=${userInfo.CompanyId}`)
            .then(res =>
                res.json()
                // console.log(res);
            )
            .then((data) => {
                console.log(data);
                let temp = [];
                for (let i = 0; i < data.length; i++) {
                    let perObj = { Name: data[i].Name, Code: data[i].Code, ProjectId: data[i].ProjectId };
                    temp.push(perObj);
                }
                setProject(temp);
            })


        fetch(`${userInfo.Ip}/API/CreditVouch/Get_AccountHeadDeb?locationId=${userInfo.LocationId}&companyId=${userInfo.CompanyId}&identificationType=${radioVal}`)
            .then(res =>
                res.json()
                // console.log(res);
            )
            .then((data) => {
                console.log("Accounts Head");
                console.log(data);
                let accHead = [];
                for (let i = 0; i < data.length; i++) {
                    let temp = { Name: data[i].Name, AccountsId: data[i].AccountsId, ControlAccountId: data[i].ControlAccountId };
                    accHead.push(temp);
                }
                // console.log(accHead);
                setAccountsHeadDebit(accHead);
            })

        fetch(`${userInfo.Ip}/API/CreditVouch/Get_AccountHeadAll?companyId=${userInfo.CompanyId}&locationId=${userInfo.LocationId}`)
            .then(res =>
                res.json()
                // console.log(res);
            )
            .then((data) => {
                console.log(data);
                let accHead = [];
                for (let i = 0; i < data.length; i++) {
                    let temp = { Name: data[i].Name, AccountsId: data[i].AccountsId, ControlAccountId: data[i].ControlAccountId };
                    accHead.push(temp);
                }
                // console.log(accHead);
                setAccountsHead(accHead);
            })

        fetch(`${userInfo.Ip}/API/CreditVouch/Get_AllBuyerEmpSupLoc?companyId=${userInfo.CompanyId}`)
            .then(res =>
                res.json()
                // console.log(res);
            )
            .then((data) => {
                console.log(data);
                setAllNames(data);
            })


    }, [])



    const handleDeleteRow = (index) => {
        if (
            // !confirm(`Are you sure you want to delete ${row.getValue('firstName')}`)
            !confirm(`Are you sure you want to delete row no. ${index}?`)
        ) {
            return;
        }
        //send api delete request here, then refetch or update local table data for re-render
        // var prevTableDataOld = _.cloneDeep(voucherTableData);
        console.log("553 no deleted row");

        console.log(voucherTableData[index]);
        if (voucherTableData[index].voucherDetailId) {
            setDeletedVoucherDTRows([...deletedVoucherDTRows, { VoucherDetailId: voucherTableData[index].voucherDetailId }]);
            exVoucherTableData.VoucherDetail.splice(index, 1);
        }
        voucherTableData.splice(index, 1);
        setVoucherTableData([...voucherTableData]);
        setdebitCreditWatch((prev) => !prev);
    }


    const handleAccountHeadSelect = (index, selectedOption) => {

        let prevTableDataOld = _.cloneDeep(voucherTableData);
        const url = `${userInfo.Ip}/API/CreditVouch/Get_ControlAccount?controlAccId=${selectedOption.ControlAccountId}`;
        fetch(url, {
            method: 'GET',
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                // --[filling accounthead, controlAccount cell of the same row]--
                prevTableDataOld[index].accountHead = selectedOption;
                prevTableDataOld[index].controlAccName = { Name: data[0].Name, id: data[0].ControlAccountId };

                // --[filling project cell of the same row]--
                const matchedIndex = project.findIndex(e => e.Code === 'GN');
                console.log(matchedIndex);
                console.log(project[matchedIndex]);
                if (matchedIndex > -1 && !(prevTableDataOld[index].project?.ProjectId)) { //maane jodi GN wala project khuje paay and user jodi project aage theke select kore na thaake...
                    prevTableDataOld[index].project = project[matchedIndex];
                }

                // --[calculating previous remainder debit/credit and inputing it into the next debit/credit auto]--
                // if (((index - 1) > -1) && total.debit > total.credit) {
                //     prevTableDataOld[index].credit = total.debit - total.credit;
                //     prevTableDataOld[index].debit = 0;
                // }
                // else if (((index - 1) > -1) && total.debit < total.credit) {
                //     prevTableDataOld[index].debit = total.credit - total.debit;
                //     prevTableDataOld[index].credit = 0;
                // }

                // --[checking if the accound head is getting selected in the last row, if does, insert another empty row below(auto adding row)]--
                if (voucherTableData.length - 1 == index) {
                    prevTableDataOld.push({ accountHead: { Name: "", AccountsId: "" }, controlAccName: { Name: "", id: "" }, project: { Name: "", Code: "", ProjectId: "" }, particulars: "", credit: "", name: { Name: "", TableName: "", Id: "" } });
                }

                setVoucherTableData([...prevTableDataOld]);
                setdebitCreditWatch((prev) => !prev);
                console.log(voucherTableData);
            }
            )
    };

    const handleAccountHeadSelectFeatOn = (index, selectedOption) => {

        let prevTableDataOld = _.cloneDeep(voucherTableData);
        const url = `${userInfo.Ip}/API/CreditVouch/Get_ControlAccount?controlAccId=${selectedOption.ControlAccountId}`;
        fetch(url, {
            method: 'GET',
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                // --[filling accounthead, controlAccount cell of the same row]--
                prevTableDataOld[index].accountHead = selectedOption;
                prevTableDataOld[index].controlAccName = { Name: data[0].Name, id: data[0].ControlAccountId };

                // --[filling project cell of the same row]--
                const matchedIndex = project.findIndex(e => e.Code === 'GN');
                console.log(matchedIndex);
                console.log(project[matchedIndex]);
                if (matchedIndex > -1 && !(prevTableDataOld[index].project?.ProjectId)) {
                    prevTableDataOld[index].project = project[matchedIndex];
                }

                // --[calculating previous remainder debit/credit and inputing it into the next debit/credit auto]--
                // if (((index - 1) > -1) && total.debit > total.credit) {
                //     prevTableDataOld[index].credit = total.debit - total.credit;
                //     prevTableDataOld[index].debit = 0;
                // }
                // else if (((index - 1) > -1) && total.debit < total.credit) {
                //     prevTableDataOld[index].debit = total.credit - total.debit;
                //     prevTableDataOld[index].credit = 0;
                // }

                // debugger;
                fetch(`${userInfo.Ip}/API/CreditVouch/GetRequiredInputInfos?accountId=${selectedOption.AccountsId}&companyId=${userInfo.CompanyId}&locationId=${userInfo.LocationId}`, {
                    method: 'GET',
                })
                    .then(res => res.json())
                    .then(data2 => {

                        //the great logic
                        console.log("data2, the great logic");
                        console.log(data2);
                        if (data2.length) {
                            console.log("data2 er length 0 theke greater");

                            prevTableDataOld[index].nameClues = [...data2];
                            console.log(prevTableDataOld[index].nameClues)
                        }

                        // --[checking if the accound head is getting selected in the last row, if does, insert another empty row below(auto adding row)]--
                        if (voucherTableData.length - 1 == index) {
                            prevTableDataOld.push({ accountHead: { Name: "", AccountsId: "" }, controlAccName: { Name: "", id: "" }, project: { Name: "", Code: "", ProjectId: "" }, particulars: "", credit: "", name: [], nameClues: [] });
                        }

                        console.log("rupom wants to see prevTableOld--------------")

                        console.log(prevTableDataOld);
                        setVoucherTableData([...prevTableDataOld]);
                        setdebitCreditWatch((prev) => !prev);
                    })



            }
            )
    };

    const handleDebitAccHeadSelection = (e, selectedOption) => {
        // setDebitVoucherInfo({ accountHead: { Name: "", AccountsId: "" }, controlAccName: { Name: "", id: "" }, project: { Name: "", Code: "", ProjectId: "" }, particulars: "", debit: "", name: [], nameClues: [] });

        if (!selectedOption) {
            debitVoucherInfo.project = {};
            debitVoucherInfo.accountHead = {};
            debitVoucherInfo.controlAccName = {};

            setDebitVoucherInfo({ ...debitVoucherInfo });

        }
        else {

            debitVoucherInfo.name = [];
            debitVoucherInfo.nameClues = [];

            setDebitVoucherInfo({ ...debitVoucherInfo });

            console.log(selectedOption);
            debitVoucherInfo.accountHead = selectedOption;
            console.log("from head selection......")
            // --[filling project cell of the same row]--
            const matchedIndex = project.findIndex(e => e.Code === 'GN');
            console.log(matchedIndex);
            console.log(project[matchedIndex]);
            if (matchedIndex > -1 && !(debitVoucherInfo.project?.ProjectId)) {
                debitVoucherInfo.project = project[matchedIndex];
            }
            // setDebitVoucherInfo({ ...debitVoucherInfo });

            if (brFeatures.VariableAccountAnalysis) {
                fetch(`${userInfo.Ip}/API/CreditVouch/GetRequiredInputInfos?accountId=${selectedOption?.AccountsId}&companyId=${userInfo.CompanyId}&locationId=${userInfo.LocationId}`, {
                    method: 'GET',
                })
                    .then(res => res.json())
                    .then(data2 => {

                        //the great logic
                        console.log("data2, the great logic");
                        console.log(data2);
                        if (data2.length) {
                            console.log("data2 er length 0 theke greater");
                            console.log("debitVoucherInfo: ");

                            debitVoucherInfo.nameClues = [...data2];
                            console.log(debitVoucherInfo.nameClues)
                        }
                        else {
                            let generalFourNameClues = [
                                { InputName: "Buyer", QueryField: "", QueryFieldVal: null, QueryTable: "Buyer", CompanyId: userInfo.CompanyId, LocationId: userInfo.LocationId },
                                { InputName: "Supplier", QueryField: "", QueryFieldVal: null, QueryTable: "Supplier", CompanyId: userInfo.CompanyId, LocationId: userInfo.LocationId },
                                { InputName: "Employee", QueryField: "", QueryFieldVal: null, QueryTable: "Employee", CompanyId: userInfo.CompanyId, LocationId: userInfo.LocationId },
                                { InputName: "Location", QueryField: "", QueryFieldVal: null, QueryTable: "Location", CompanyId: userInfo.CompanyId, LocationId: userInfo.LocationId },
                            ]
                            debitVoucherInfo.nameClues = [...generalFourNameClues];
                        }

                        console.log("rupom wants to see whole Credit Voucher info after adding nameclues--------------")

                        console.log(debitVoucherInfo);
                        setDebitVoucherInfo({ ...debitVoucherInfo });
                        setdebitCreditWatch((prev) => !prev);
                    })
            }
            else {
                setDebitVoucherInfo({ ...debitVoucherInfo });
            }


        }


    }


    const saveVTdata = () => {

        let tableAllRows = _.cloneDeep(voucherTableData);
        console.log(tableAllRows);
        let formData = getValues();
        let voucherDate = dayjs(voucherDateState).format('YYYY/MM/DD hh:mm A');

        let voucherTb = {
            // Date:newDate,
            LocationId: locationOutput.LocationId,
            ReferenceNo: (formData.reference) ? formData.reference : "",
            Description: (formData.description) ? (formData.description) : "",
        };
        let voucherDtTb = [];
        let debitCreditFlag = true;
        let mandatoryFieldFlag = true;

        if (!debitVoucherInfo.accountHead?.AccountsId) {
            mandatoryFieldFlag = false;
            toast.error(`You must select a Credit Account Head!`);
        }
        else if (!debitVoucherInfo.project?.ProjectId) {
            mandatoryFieldFlag = false;
            toast.error(`You must select a Credit Project!`);
        }

        for (let i = 0; i < tableAllRows.length; i++) {

            //bool return kore, object er j kono ekta property o jodi faka na hoy taile false ashe, maane isEmpty is false/empty na
            const rowIsEmpty = !Object.values(tableAllRows[i]).some(x => {
                if (typeof x === 'object') {
                    let tempIsEmpty = !Object.values(x).some(y => y !== null && y !== '' && y !== 0);
                    return !tempIsEmpty;
                }
                else if (x !== null && x !== '' && x !== 0) {
                    return true;
                }
                else {
                    return false;
                }
            });

            if (!rowIsEmpty) {

                let perRowCredit = isNaN(parseFloat(tableAllRows[i].credit)) ? 0 : parseFloat(tableAllRows[i].credit);
                let propertyName = `${tableAllRows[i].name.TableName}Id`
                let perRowForbackend = {};

                if (!(tableAllRows[i].accountHead.AccountsId)) {
                    mandatoryFieldFlag = false;
                    toast.error(`You must select a Account Head for row: ${i + 1}`);
                }
                if ((tableAllRows[i].accountHead.AccountsId) && !(tableAllRows[i].credit)) {
                    mandatoryFieldFlag = false;
                    toast.error(`You must entry a credit for row: ${i + 1}`);
                }

                if (tableAllRows[i].name?.Id) {
                    perRowForbackend = {
                        AccountsId: tableAllRows[i].accountHead?.AccountsId,
                        ProjectId: tableAllRows[i].project?.ProjectId,
                        Particulars: tableAllRows[i].particulars,
                        Debit: 0,
                        Credit: perRowCredit,
                        [propertyName]: tableAllRows[i].name?.Id
                    }
                }
                else {
                    perRowForbackend = {
                        AccountsId: tableAllRows[i].accountHead.AccountsId,
                        ProjectId: tableAllRows[i].project.ProjectId,
                        Particulars: tableAllRows[i].particulars,
                        Debit: 0,
                        Credit: perRowCredit
                    }
                }
                voucherDtTb.push(perRowForbackend);
            }
        }
        let voucherDtTbB4Debit = _.cloneDeep(voucherDtTb);
        // voucherDtTbB4Cred

        let debitRowObj = {
            AccountsId: (debitVoucherInfo.accountHead?.AccountsId) ? debitVoucherInfo.accountHead?.AccountsId : "",
            ProjectId: (debitVoucherInfo.project?.ProjectId) ? debitVoucherInfo.project?.ProjectId : "",
            Particulars: debitVoucherInfo.particulars ? debitVoucherInfo.particulars : "",
            Debit: total.credit,
            Credit: 0,
        }
        if (debitVoucherInfo?.name?.Id) {
            let propertyNameDebit = `${debitVoucherInfo?.name?.TableName}Id`;
            debitRowObj[propertyNameDebit] = debitVoucherInfo.name?.Id;
        }
        voucherDtTb.push(debitRowObj);

        // console.log(attachments);
        let attachmentArr = [];
        for (let i = 0; i < attachments.length; i++) {
            let perAttachment = {
                FileName: attachments[i].fileName,
                AttachmentType: attachments[i].fileExtension,
                FileBase64: (attachments[i].fileB64format).substr((attachments[i].fileB64format.lastIndexOf(',') + 1))
            }
            attachmentArr.push(perAttachment);
        }

        let voucherFullData = {
            Voucher: voucherTb,
            VoucherDetail: voucherDtTb,
            VoucherDate: voucherDate,
            Attachment: {
                AttachmentData_List: attachmentArr
            },
            UserInfos: userInfo
        };

        console.log("ON SAVE VOUCHER DATA :---");
        console.log(voucherFullData);
        console.log("line 692...........!!!!!!!!");
        // console.log(voucherFullData.VoucherDetail);


        // console.log(attachments);
        if (voucherDtTb.length && voucherDtTbB4Debit.length && debitCreditFlag && mandatoryFieldFlag) {

            axios.post(`${userInfo.Ip}/API/CreditVouch/Post_CV_Voucher`, voucherFullData)
                .then(res => {
                    console.log("insert er axios!!")
                    if (res) {
                        console.log(res);
                        Swal.fire({
                            title: `Voucher No: \n${res.data.VoucherNo} \n has been Generated!`,
                            showDenyButton: false,
                            icon: 'success',
                            showCancelButton: false,
                            confirmButtonText: 'OK',
                            denyButtonText: ``,
                        }).then((result) => {
                            /* Read more about isConfirmed, isDenied below */
                            if (result.isConfirmed) {
                                // setVoucherNumber(res.data);
                                // vouchNoInpRef.current.value = res.data;
                                setValue("voucherNo", res.data.VoucherNo);
                                setVoucherIs(true);

                            }
                        })

                        fetch(`${userInfo.Ip}/API/CreditVouch/Get_VoucherAllInfo?voucherNo=${res.data.VoucherNo}&voucherId=${res.data.VoucherId}`)
                            .then(res =>
                                res.json()
                                // console.log(res);
                            )
                            .then((data) => {
                                console.log("Fetched AGAIN AFTER Save, Raw data for voucher Edit, Line No. 716.....");
                                setCreditVouchToEdit(0); //context api voucherEdit state reset
                                console.log("raw data that has been rupom!!!!!!!!")
                                console.log(data);
                                assignDataForEdit(data.Voucher.Date, data.Voucher.LocationId, data.Location.Name, data.Voucher.VoucherId, data.Voucher.VoucherNo, data.Voucher.AttachmentId, data.Voucher.ReferenceNo, data.Voucher.Description, data.V_VoucherDetailRows, data.Attachment?.AttachmentData_List);
                            })
                        // reset();
                    }

                })
        }
        // else if (!(total.credit == total.debit)) {
        //     toast.error('Your Debits & Credits are not balanced !!');
        // }
        else if (!voucherDtTbB4Debit.length) {
            toast.error('No credit data to save!');
        }
        else {
            // toast.error('debit credit prob single row flag problem!');
        }

    }


    const saveVTdataFeatOn = () => {

        let tableAllRows = _.cloneDeep(voucherTableData);
        console.log(tableAllRows);
        let formData = getValues();
        let voucherDate = dayjs(voucherDateState).format('YYYY/MM/DD hh:mm A');

        let voucherTb = {
            // Date:newDate,
            LocationId: locationOutput.LocationId,
            ReferenceNo: (formData.reference) ? formData.reference : "",
            Description: (formData.description) ? (formData.description) : "",
        };
        let voucherDtTb = [];
        let debitCreditFlag = true;
        let mandatoryFieldFlag = true;

        if (!debitVoucherInfo.accountHead?.AccountsId) {
            mandatoryFieldFlag = false;
            toast.error(`You must select a Credit Account Head!`);
        }
        else if (!debitVoucherInfo.project?.ProjectId) {
            mandatoryFieldFlag = false;
            toast.error(`You must select a Debit Project!`);
        }

        for (let i = 0; i < tableAllRows.length; i++) {

            //bool return kore, object er j kono ekta property o jodi faka na hoy taile false ashe, maane isEmpty is false/empty na
            const rowIsEmpty = !Object.values(tableAllRows[i]).some(x => {
                if (typeof x === 'object') {
                    let tempIsEmpty = !Object.values(x).some(y => y !== null && y !== '' && y !== 0 && y.length != 0);
                    return !tempIsEmpty;
                }
                else if (x !== null && x !== '' && x !== 0 && x !== 0) {
                    return true;
                }
                else {
                    return false;
                }
            });

            if (!rowIsEmpty) {

                let perRowCredit = isNaN(parseFloat(tableAllRows[i].credit)) ? 0 : parseFloat(tableAllRows[i].credit);
                let perRowForbackend = {};

                let nameFields = {};
                for (let j = 0; j < tableAllRows[i].name.length; j++) {
                    nameFields[tableAllRows[i].name[j].PropertyName] = parseInt(tableAllRows[i].name[j].Id);
                }

                if (!(tableAllRows[i].accountHead.AccountsId)) {
                    mandatoryFieldFlag = false;
                    toast.error(`You must select a Account Head for row: ${i + 1}`);
                }
                if ((tableAllRows[i].accountHead.AccountsId) && !(tableAllRows[i].credit)) {
                    mandatoryFieldFlag = false;
                    toast.error(`You must entry a credit for row: ${i + 1}`);
                }

                perRowForbackend = {
                    AccountsId: tableAllRows[i].accountHead?.AccountsId,
                    ProjectId: tableAllRows[i].project?.ProjectId,
                    Particulars: tableAllRows[i].particulars,
                    Debit: 0,
                    Credit: perRowCredit,
                }
                console.log("Rupom New Save After sirs Torture namefield, perRowForBackend");

                console.log(nameFields);
                perRowForbackend = { ...perRowForbackend, ...nameFields };
                console.log(perRowForbackend);

                voucherDtTb.push(perRowForbackend);
            }
        }
        let voucherDtTbB4Cred = _.cloneDeep(voucherDtTb);


        let debitRowObj = {
            AccountsId: (debitVoucherInfo.accountHead?.AccountsId) ? debitVoucherInfo.accountHead?.AccountsId : "",
            ProjectId: (debitVoucherInfo.project?.ProjectId) ? debitVoucherInfo.project?.ProjectId : "",
            Particulars: debitVoucherInfo.particulars ? debitVoucherInfo.particulars : "",
            Debit: total.credit,
            Credit: 0,
        }
        // if (debitVoucherInfo?.name?.Id) {
        //     let propertyNameCred = `${debitVoucherInfo?.name?.TableName}Id`;
        //     debitRowObj[propertyNameCred] = debitVoucherInfo.name?.Id;
        // }

        if (debitVoucherInfo.name?.length) {
            for (let j = 0; j < debitVoucherInfo.name.length; j++) {
                debitRowObj[debitVoucherInfo.name[j].PropertyName] = debitVoucherInfo.name[j].Id;
            }
        }

        voucherDtTb.push(debitRowObj);

        // console.log(attachments);
        let attachmentArr = [];
        for (let i = 0; i < attachments.length; i++) {
            let perAttachment = {
                FileName: attachments[i].fileName,
                AttachmentType: attachments[i].fileExtension,
                FileBase64: (attachments[i].fileB64format).substr((attachments[i].fileB64format.lastIndexOf(',') + 1))
            }
            attachmentArr.push(perAttachment);
        }

        let voucherFullData = {
            Voucher: voucherTb,
            VoucherDetail: voucherDtTb,
            VoucherDate: voucherDate,
            Attachment: {
                AttachmentData_List: attachmentArr
            },
            UserInfos: userInfo
        };

        console.log("ON SAVE VOUCHER DATA :---");
        console.log(voucherFullData);
        console.log("line 692...........!!!!!!!!");
        // console.log(voucherFullData.VoucherDetail);


        // console.log(attachments);
        if (voucherDtTb.length && voucherDtTbB4Cred.length && debitCreditFlag && mandatoryFieldFlag) {

            axios.post(`${userInfo.Ip}/API/CreditVouch/Post_CV_Voucher`, voucherFullData)
                .then(res => {
                    console.log("insert er axios!!")
                    if (res) {
                        console.log(res);
                        Swal.fire({
                            title: `Voucher No: \n${res.data.VoucherNo} \n has been Generated!`,
                            showDenyButton: false,
                            icon: 'success',
                            showCancelButton: false,
                            confirmButtonText: 'OK',
                            denyButtonText: ``,
                        }).then((result) => {
                            /* Read more about isConfirmed, isDenied below */
                            if (result.isConfirmed) {
                                // setVoucherNumber(res.data);
                                // vouchNoInpRef.current.value = res.data;
                                setValue("voucherNo", res.data.VoucherNo);
                                setVoucherIs(true);

                            }
                        })

                        fetch(`${userInfo.Ip}/API/CreditVouch/Get_VoucherAllInfoFeatOn?voucherNo=${res.data.VoucherNo}&voucherId=${res.data.VoucherId}`)
                            .then(res =>
                                res.json()
                                // console.log(res);
                            )
                            .then((data) => {
                                console.log("Fetched AGAIN AFTER Save, Raw data for voucher Edit, Line No. 716.....");
                                setCreditVouchToEdit(0); //context api voucherEdit state reset
                                console.log("raw data that has been rupom!!!!!!!!")
                                console.log(data);
                                // assignDataForEdit(data.Voucher.Date, data.Voucher.LocationId, data.Location.Name, data.Voucher.VoucherId, data.Voucher.VoucherNo, data.Voucher.AttachmentId, data.Voucher.ReferenceNo, data.Voucher.Description, data.V_VoucherDetailRows, data.Attachment?.AttachmentData_List);

                                assignDataForEditFeatOn(data.Voucher.Date, data.Voucher.LocationId, data.Location.Name, data.Voucher.VoucherId, data.Voucher.VoucherNo, data.Voucher.AttachmentId, data.Voucher.ReferenceNo, data.Voucher.Description, data.V_VoucherDetailRows, data.Attachment?.AttachmentData_List);

                                // const assignDataForEditFeatOn = (voucherDate, voucherLocationId, voucherLocationName, voucherId, voucherNo, voucherAttachmentId, reference, description, vouchDtTable, attachmentTable)

                            })
                        // reset();
                    }

                })
        }
        // else if (!(total.credit == total.debit)) {
        //     toast.error('Your Debits & Credits are not balanced !!');
        // }
        else if (!voucherDtTbB4Cred.length) {
            toast.error('No credit data to save!');
        }
        else {
            // toast.error('debit credit prob single row flag problem!');
        }

    }


    const clearData = () => {
        console.log(attachments);
        setVoucherIs(false);
        console.log(voucherTableData);
        setVoucherTableData(emptyRows);
        setExVoucherTableData([]);
        setVoucherDateState(new Date());
        setLocationOutput({ Name: userInfo.LocationName, LocationId: userInfo.LocationId });
        setTotal({ credit: 0 });
        reset();
        setAttachments([]);
        setDeletedRegedAttach([]);
        setDeletedVoucherDTRows([]);
        setDebitVoucherInfo({ accountHead: { Name: "", AccountsId: "" }, controlAccName: { Name: "", id: "" }, project: { Name: "", Code: "", ProjectId: "" }, particulars: "", debit: "", name: { Name: "", TableName: "", Id: "" } })

    }

    const assignDataForEdit = (voucherDate, voucherLocationId, voucherLocationName, voucherId, voucherNo, voucherAttachmentId, reference, description, vouchDtTable, attachmentTable) => {
        debugger;
        console.log("assignDataForEdit Function.....");
        console.log(voucherDate);
        console.log(voucherLocationId);
        console.log(voucherLocationName);
        console.log(voucherId);
        console.log(voucherNo);
        console.log(voucherAttachmentId);
        console.log(reference);
        console.log(description);
        console.log(vouchDtTable);
        console.log(attachmentTable);




        setVoucherDateState(dayjs(voucherDate));
        setLocationOutput({ Name: voucherLocationName, LocationId: voucherLocationId });
        setValue("voucherNo", voucherNo);
        setVoucherIs(true);
        setValue("reference", reference);
        setValue("description", description);
        // setVoucherTableData(vouchDtTable);
        console.log("line 760......");
        console.log(vouchDtTable);

        let voucherTableArr = _.cloneDeep(emptyRows);
        let voucherTableArrNoEmpty = [];
        voucherTableArr.splice(0, vouchDtTable.length);

        let tempArray = [];
        let debitRow = {};
        // creditRow
        let debitRowFormatted = {};

        for (let i = 0; i < vouchDtTable.length; i++) {

            let objRow = {
                voucherDetailId: vouchDtTable[i].VoucherDetailId,
                accountHead: {
                    Name: vouchDtTable[i].AccountsName,
                    AccountsId: vouchDtTable[i].AccountsId,
                    ControlAccountId: vouchDtTable[i].ControlAccountId
                },
                controlAccName: {
                    Name: vouchDtTable[i].ControlAccountName,
                    id: vouchDtTable[i].ControlAccountId
                },
                project: {
                    Name: vouchDtTable[i].ProjectName,
                    Code: vouchDtTable[i].ProjectCode,
                    ProjectId: vouchDtTable[i].ProjectId
                },
                particulars: vouchDtTable[i].Particulars,
                debit: vouchDtTable[i].Debit,
                credit: vouchDtTable[i].Credit,
                name: {
                    Name: "",
                    Id: "",
                    TableName: ""
                }

            }

            let perRowFormatted = {
                VoucherDetailId: vouchDtTable[i].VoucherDetailId,
                AccountsId: vouchDtTable[i].AccountsId,
                ProjectId: vouchDtTable[i].ProjectId,
                Particulars: vouchDtTable[i].Particulars,
                Debit: vouchDtTable[i].Debit,
                Credit: vouchDtTable[i].Credit,
            }

            if (vouchDtTable[i].EmployeeId) {
                objRow.name = { Name: vouchDtTable[i].EmployeeName, Id: vouchDtTable[i].EmployeeId, TableName: "Employee" };
                perRowFormatted.EmployeeId = vouchDtTable[i].EmployeeId;
            }
            else if (vouchDtTable[i].SupplierId) {
                objRow.name = { Name: vouchDtTable[i].SupplierName, Id: vouchDtTable[i].SupplierId, TableName: "Supplier" };
                perRowFormatted.SupplierId = vouchDtTable[i].SupplierId;
            }
            else if (vouchDtTable[i].LocationId) {
                objRow.name = { Name: vouchDtTable[i].LocationName, Id: vouchDtTable[i].LocationId, TableName: "Location" };
                perRowFormatted.LocationId = vouchDtTable[i].LocationId;
            }
            else if (vouchDtTable[i].BuyerId) {
                objRow.name = { Name: vouchDtTable[i].BuyerName, Id: vouchDtTable[i].BuyerId, TableName: "Buyer" };
                perRowFormatted.BuyerId = vouchDtTable[i].BuyerId;
            }
            console.log(objRow);

            //jodi oi row ta credit row hoy, taile tempArray(maane mui table e) te dhukbena
            if (vouchDtTable[i].Debit == 0 && vouchDtTable[i].Credit > 0) {
                tempArray.push(objRow);
                //but shobgula row, with credit row, voucherTableArrNoEmpty te dhukbe, kintu oitare to last e dhukate hobe, so eitao if e
                voucherTableArrNoEmpty.push(perRowFormatted);
            }
            else {
                debitRow = objRow;
                debitRowFormatted = perRowFormatted;
            }

        }
        voucherTableArr = [...tempArray, ...voucherTableArr];
        // console.log("line 827.......");
        // console.log(voucherTableArr);

        setVoucherTableData(voucherTableArr);
        setDebitVoucherInfo(debitRow);
        // setExVoucherTableData(voucherTableArr);
        let voucherTb = { VoucherId: voucherId, VoucherNo: voucherNo, ReferenceNo: reference, Description: description, AttachmentId: voucherAttachmentId };
        let attachmentTb = [];
        if (attachmentTable.length) {
            for (let i = 0; i < attachmentTable.length; i++) {
                let perAttachObj = checkAndSetAttachObjFomrat(attachmentTable[i]);
                console.log("attachment formatter func e dhukar por:")
                console.log(perAttachObj);

                attachmentTb.push(perAttachObj);
            }
        }
        console.log("attachment full array")
        console.log(attachmentTb);
        setAttachments(attachmentTb);
        // let attachment
        //setExVoucherTableData({Voucher: voucherTb, VoucherDetails:voucherTableArr, Attachments: atachment})
        setExVoucherTableData({ Voucher: voucherTb, VoucherDetail: voucherTableArrNoEmpty, DebitDetail: debitRowFormatted })
        setdebitCreditWatch((prev) => !prev);
    }




    const assignDataForEditFeatOn = (voucherDate, voucherLocationId, voucherLocationName, voucherId, voucherNo, voucherAttachmentId, reference, description, vouchDtTable, attachmentTable) => {

        setVoucherDateState(dayjs(voucherDate));
        setLocationOutput({ Name: voucherLocationName, LocationId: voucherLocationId });
        setValue("voucherNo", voucherNo);
        setVoucherIs(true);
        setValue("reference", reference);
        setValue("description", description);
        // setVoucherTableData(vouchDtTable);
        console.log("line 760......");
        console.log(vouchDtTable);

        let voucherTableArr = _.cloneDeep(emptyRowsFeatureOn);
        let voucherTableArrNoEmpty = [];
        voucherTableArr.splice(0, vouchDtTable.length);

        let tempArray = [];
        let debitRow = {};
        let debitRowFormatted = {};

        for (let i = 0; i < vouchDtTable.length; i++) {

            let objRow = {
                voucherDetailId: vouchDtTable[i].VoucherDetailId,
                accountHead: {
                    Name: vouchDtTable[i].AccountsName,
                    AccountsId: vouchDtTable[i].AccountsId,
                    ControlAccountId: vouchDtTable[i].ControlAccountId
                },
                controlAccName: {
                    Name: vouchDtTable[i].ControlAccountName,
                    id: vouchDtTable[i].ControlAccountId
                },
                project: {
                    Name: vouchDtTable[i].ProjectName,
                    Code: vouchDtTable[i].ProjectCode,
                    ProjectId: vouchDtTable[i].ProjectId
                },
                particulars: vouchDtTable[i].Particulars,
                debit: vouchDtTable[i].Debit,
                credit: vouchDtTable[i].Credit,
                name: [],
                nameClues: vouchDtTable[i].NameClues
            }

            let tempNameArr = [];
            let perRowFormatted = {
                VoucherDetailId: vouchDtTable[i].VoucherDetailId,
                AccountsId: vouchDtTable[i].AccountsId,
                ProjectId: vouchDtTable[i].ProjectId,
                Particulars: vouchDtTable[i].Particulars,
                Debit: vouchDtTable[i].Debit,
                Credit: vouchDtTable[i].Credit,
            }
            debugger;
            if (vouchDtTable[i].EmployeeId) {
                // objRow.name = { Name: vouchDtTable[i].EmployeeName, Id: vouchDtTable[i].EmployeeId, TableName: "Employee" };
                let tempObj = { Name: vouchDtTable[i].EmployeeName, InputName: "Employee", PropertyName: "EmployeeId", Id: vouchDtTable[i].EmployeeId }
                tempNameArr.push(tempObj);
                perRowFormatted.EmployeeId = vouchDtTable[i].EmployeeId;
            }
            if (vouchDtTable[i].SupplierId) {
                // objRow.name = { Name: vouchDtTable[i].SupplierName, Id: vouchDtTable[i].SupplierId, TableName: "Supplier" };
                let tempObj = { Name: vouchDtTable[i].SupplierName, InputName: "Supplier", PropertyName: "SupplierId", Id: vouchDtTable[i].SupplierId }
                tempNameArr.push(tempObj);
                perRowFormatted.SupplierId = vouchDtTable[i].SupplierId;
            }
            if (vouchDtTable[i].LocationId) {
                let tempObj = { Name: vouchDtTable[i].LocationName, InputName: "Location", PropertyName: "LocationId", Id: vouchDtTable[i].LocationId }
                tempNameArr.push(tempObj);
                perRowFormatted.LocationId = vouchDtTable[i].LocationId;
            }
            if (vouchDtTable[i].BuyerId) {
                let tempObj = { Name: vouchDtTable[i].BuyerName, InputName: "Buyer", PropertyName: "BuyerId", Id: vouchDtTable[i].BuyerId };
                tempNameArr.push(tempObj);
                perRowFormatted.BuyerId = vouchDtTable[i].BuyerId;
            }
            if (vouchDtTable[i].AccountsAnalysis1Id) {
                let tempObj = { Name: vouchDtTable[i].AccountsAnalysis1Name, InputName: vouchDtTable[i].AccountsAnalysis1InputName, PropertyName: "AccountsAnalysis1", Id: vouchDtTable[i].AccountsAnalysis1Id }
                tempNameArr.push(tempObj);
                perRowFormatted.AccountsAnalysis1 = vouchDtTable[i].AccountsAnalysis1Id;
            }
            if (vouchDtTable[i].AccountsAnalysis2Id) {
                let tempObj = { Name: vouchDtTable[i].AccountsAnalysis2Name, InputName: vouchDtTable[i].AccountsAnalysis2InputName, PropertyName: "AccountsAnalysis2", Id: vouchDtTable[i].AccountsAnalysis2Id }
                tempNameArr.push(tempObj);
                perRowFormatted.AccountsAnalysis2 = vouchDtTable[i].AccountsAnalysis2Id;
            }


            // console.log("heloo yoo yoo nobin vai the yo yo");
            // console.log(tempNameArr);
            // vouchDtTable[i];


            objRow.name = tempNameArr;
            console.log(objRow);
            // tempArray.push(objRow);

            //jodi oi row ta debit row hoy, taile tempArray(maane mui table e) te dhukbena
            if (vouchDtTable[i].Debit == 0 && vouchDtTable[i].Credit > 0) {
                tempArray.push(objRow);
                //but shobgula row, with credit row, voucherTableArrNoEmpty te dhukbe, kintu oitare to last e dhukate hobe, so eitao if e
                voucherTableArrNoEmpty.push(perRowFormatted);
            }
            else {

                // objRow.name = { Name: tempNameArr[0].Name, Id: tempNameArr[0].Id, TableName: tempNameArr[0].InputName }
                let generalFourNameClues = [
                    { InputName: "Buyer", QueryField: "", QueryFieldVal: null, QueryTable: "Buyer", CompanyId: userInfo.CompanyId, LocationId: userInfo.LocationId },
                    { InputName: "Supplier", QueryField: "", QueryFieldVal: null, QueryTable: "Supplier", CompanyId: userInfo.CompanyId, LocationId: userInfo.LocationId },
                    { InputName: "Employee", QueryField: "", QueryFieldVal: null, QueryTable: "Employee", CompanyId: userInfo.CompanyId, LocationId: userInfo.LocationId },
                    { InputName: "Location", QueryField: "", QueryFieldVal: null, QueryTable: "Location", CompanyId: userInfo.CompanyId, LocationId: userInfo.LocationId },
                ]

                objRow.nameClues = (objRow?.nameClues?.length ? objRow?.nameClues : generalFourNameClues);

                debitRow = objRow;
                debitRowFormatted = perRowFormatted;
            }

        }
        voucherTableArr = [...tempArray, ...voucherTableArr];
        // console.log("line 827.......");
        // console.log(voucherTableArr);

        setVoucherTableData(voucherTableArr);
        setDebitVoucherInfo(debitRow);
        // setExVoucherTableData(voucherTableArr);
        let voucherTb = { VoucherId: voucherId, VoucherNo: voucherNo, ReferenceNo: reference, Description: description, AttachmentId: voucherAttachmentId };
        let attachmentTb = [];
        if (attachmentTable.length) {
            for (let i = 0; i < attachmentTable.length; i++) {
                let perAttachObj = checkAndSetAttachObjFomrat(attachmentTable[i]);
                console.log("attachment formatter func e dhukar por:")
                console.log(perAttachObj);

                attachmentTb.push(perAttachObj);
            }
        }
        console.log("attachment full array")
        console.log(attachmentTb);
        setAttachments(attachmentTb);
        // let attachment
        //setExVoucherTableData({Voucher: voucherTb, VoucherDetails:voucherTableArr, Attachments: atachment})
        setExVoucherTableData({ Voucher: voucherTb, VoucherDetail: voucherTableArrNoEmpty, DebitDetail: debitRowFormatted })
        setdebitCreditWatch((prev) => !prev);
    }



    const checkAndSetAttachObjFomrat = (perAttachment) => {
        let fileExtension = perAttachment.AttachmentType;
        // let fileExtension = name.split('.').pop()
        let fileThumbnail = '';
        let downloadable = true;

        if (fileExtension == 'jpg' || fileExtension == 'jpeg' || fileExtension == 'png' || fileExtension == 'gif') {
            downloadable = false;
        }
        else if (fileExtension == 'mp4' || fileExtension == 'webm' || fileExtension == 'mkv' || fileExtension == 'wmv') {
            fileThumbnail = "https://i.ibb.co/cNLBwjY/Video-File-Icon.png";
            downloadable = true;
        }
        else if (fileExtension == 'xlsx' || fileExtension == 'xls' || fileExtension == 'csv') {
            fileThumbnail = "https://i.ibb.co/5THHDGH/Excel-File-Icon-svg.png";
            downloadable = true;
        }
        else if (fileExtension == 'doc' || fileExtension == 'docx' || fileExtension == 'dot' || fileExtension == 'dotx') {
            fileThumbnail = "https://i.ibb.co/Z219ZB3/Word-File-Icon.png";
            downloadable = true;
        }
        else if (fileExtension == 'pdf') {
            fileThumbnail = "https://i.ibb.co/b5Dq1Q3/Pdf-File-Icon-svg.png";
            downloadable = true;
        }
        else {
            fileThumbnail = "https://i.ibb.co/hsnss8w/general-File-Icon.png";
            downloadable = true;
        }
        let attachmentObjFormat = {
            autoSL: perAttachment.AutoSL,
            fileB64format: perAttachment.AttachmentURL,
            fileName: perAttachment.FileName,
            fileExtension: perAttachment.AttachmentType,
            fileThumbnail: perAttachment.AttachmentURL,
            downloadable: downloadable
        }
        return attachmentObjFormat;
    }

    const updateVTData = () => {

        console.log("update");

        let tableAllRows = _.cloneDeep(voucherTableData);
        // console.log(tableAllRows);
        let formData = getValues();
        // let voucherDate = dayjs(voucherDateState).format('YYYY/MM/DD hh:mm A');
        // console.log(exVoucherTableData.Voucher);
        //variable to send for save and update----->
        let voucherTbToUpdate = { VoucherId: exVoucherTableData.Voucher.VoucherId, VoucherNo: exVoucherTableData.Voucher.VoucherNo, AttachmentId: exVoucherTableData.Voucher.AttachmentId };
        // let dataToUpdateSave = {};

        if (exVoucherTableData.Voucher.ReferenceNo != formData.reference || exVoucherTableData.Voucher.Description != formData.description) {
            console.log("if e dhukse,maane data change hoise voucher tb er");
            console.log(exVoucherTableData.Voucher.ReferenceNo + "=?" + formData.reference);
            console.log(exVoucherTableData.Voucher.Description + "=?" + formData.Description);

            voucherTbToUpdate.ReferenceNo = (formData.reference) ? formData.reference : "";
            voucherTbToUpdate.Description = (formData.description) ? (formData.description) : "";
        }
        // dataToUpdateSave.Voucher = voucherTbToUpdate;

        let voucherDtTb = [];
        let debitCreditFlag = true;
        let mandatoryFieldFlag = true;
        for (let i = 0; i < tableAllRows.length; i++) {

            //bool return kore, object er j kono ekta property o jodi faka na hoy taile false ashe, maane isEmpty is false/empty na
            const rowIsEmpty = !Object.values(tableAllRows[i]).some(x => {
                if (typeof x === 'object') {
                    let tempIsEmpty = !Object.values(x).some(y => y !== null && y !== '' && y !== 0);
                    return !tempIsEmpty;
                }
                else if (x !== null && x !== '' && x !== 0) {
                    return true;
                }
                else {
                    return false;
                }
            });

            if (!rowIsEmpty) {

                let perRowCredit = isNaN(parseFloat(tableAllRows[i].credit)) ? 0 : parseFloat(tableAllRows[i].credit);
                let propertyName = `${tableAllRows[i].name.TableName}Id`;
                let perRowForbackend = {};

                if (!(tableAllRows[i].accountHead.AccountsId)) {
                    mandatoryFieldFlag = false;
                    toast.error(`You must select a Account Head for row: ${i + 1}`);
                }
                if ((tableAllRows[i].accountHead.AccountsId) && !(tableAllRows[i].credit)) {
                    mandatoryFieldFlag = false;
                    toast.error(`You must entry a credit for row: ${i + 1}`);
                }

                perRowForbackend = {
                    // VoucherDetailId: (tableAllRows[i].voucherDetailId) ? tableAllRows[i].voucherDetailId : "",
                    AccountsId: tableAllRows[i].accountHead.AccountsId,
                    ProjectId: tableAllRows[i].project.ProjectId,
                    Particulars: tableAllRows[i].particulars,
                    Debit: 0,
                    Credit: perRowCredit,
                }
                if (tableAllRows[i].voucherDetailId) {
                    perRowForbackend = { VoucherDetailId: tableAllRows[i].voucherDetailId, ...perRowForbackend };
                }

                if (tableAllRows[i].name?.Id) {
                    perRowForbackend[propertyName] = tableAllRows[i].name?.Id
                }
                voucherDtTb.push(perRowForbackend);
            }
        }

        // console.log(voucherFullData);
        console.log("line 977...........!!!!!!!!");
        // console.log(voucherFullData.VoucherDetail);

        let loopNumber = (voucherDtTb.length > exVoucherTableData.VoucherDetail.length) ? voucherDtTb.length : exVoucherTableData.VoucherDetail.length;
        let vouchDtToUpdate = [];
        let debitRowToUpdate = {};
        for (let i = 0; i < loopNumber; i++) {
            console.log("current table");
            console.log(voucherDtTb[i]);

            console.log("old table");
            console.log(exVoucherTableData.VoucherDetail[i]);
            if (JSON.stringify(voucherDtTb[i]) != JSON.stringify(exVoucherTableData.VoucherDetail[i])) {
                vouchDtToUpdate.push(voucherDtTb[i]);
            }
            else if (!voucherDtTb[i]) {
                vouchDtToUpdate.push({ VoucherDetailId: exVoucherTableData.VoucherDetail[i] });
            }
            else if (!(exVoucherTableData.VoucherDetail[i])) {
                vouchDtToUpdate.push(voucherDtTb[i]);
            }
            // if ((JSON.stringify(voucherDtTb[i]) != JSON.stringify(exVoucherTableData.VoucherDetail[i])) && !voucherDtTb[i]) {
            //     vouchDtToUpdate.push(voucherDtTb[i]);
            // }
            // else if ((JSON.stringify(voucherDtTb[i]) != JSON.stringify(exVoucherTableData.VoucherDetail[i])) && !(exVoucherTableData.VoucherDetail[i])) {
            //     // vouchDtToUpdate.push({ VoucherDetailId: exVoucherTableData.VoucherDetail[i] });
            // }
            // else if ((JSON.stringify(voucherDtTb[i]) != JSON.stringify(exVoucherTableData.VoucherDetail[i])) && (exVoucherTableData.VoucherDetail[i].VoucherDetailId == voucherDtTb[i].VoucherDetailId)) {
            //     // vouchDtToUpdate.push({ VoucherDetailId: exVoucherTableData.VoucherDetail[i] });
            //     vouchDtToUpdate.push(voucherDtTb[i]);
            // }
            // else if (!(exVoucherTableData.VoucherDetail[i])) {
            //     vouchDtToUpdate.push(voucherDtTb[i]);
            // }
        }


        let debitInfoFormatted = {
            VoucherDetailId: (debitVoucherInfo.voucherDetailId) ? debitVoucherInfo.voucherDetailId : "",
            AccountsId: (debitVoucherInfo.accountHead?.AccountsId) ? debitVoucherInfo.accountHead?.AccountsId : "",
            ProjectId: (debitVoucherInfo.project?.ProjectId) ? debitVoucherInfo.project?.ProjectId : "",
            Particulars: debitVoucherInfo.particulars,
            Debit: total.credit,
            Credit: 0
        }
        if (debitVoucherInfo.name?.Id) {
            debitInfoFormatted[`${debitVoucherInfo.name.TableName}Id`] = debitVoucherInfo.name?.Id;
        }

        if (!debitInfoFormatted.AccountsId) {
            toast.error("You must enter a Credit Account Head");
            mandatoryFieldFlag = false;
        }
        else if (!debitInfoFormatted.ProjectId) {
            toast.error("You must enter a Credit Project");
            mandatoryFieldFlag = false;

        }
        else if (JSON.stringify(debitInfoFormatted) != JSON.stringify(exVoucherTableData.DebitDetail) && debitInfoFormatted.AccountsId && debitInfoFormatted.ProjectId) {
            console.log("hello rupom yo yo");
            console.log(debitInfoFormatted);
            console.log(exVoucherTableData.DebitDetail);
            debitRowToUpdate = debitInfoFormatted;
            vouchDtToUpdate = [...vouchDtToUpdate, debitRowToUpdate];
        }

        console.log("deletedVoucherDTRows");

        console.log(deletedVoucherDTRows);
        vouchDtToUpdate = [...vouchDtToUpdate, ...deletedVoucherDTRows]
        console.log("AFTER UPDATE YOYO........");
        console.log(vouchDtToUpdate);

        console.log("deleted attachments");
        console.log(deletedRegedAttach);
        let attachmentsToUpdate = [];
        for (let i = 0; i < attachments.length; i++) {
            if (!(attachments[i].autoSL)) {
                let perAttachFormatted = {
                    FileName: attachments[i].fileName,
                    AttachmentType: attachments[i].fileExtension,
                    FileBase64: (attachments[i].fileB64format).substr((attachments[i].fileB64format.lastIndexOf(',') + 1))
                }
                attachmentsToUpdate.push(perAttachFormatted);
            }
        }
        attachmentsToUpdate = [...attachmentsToUpdate, ...deletedRegedAttach]


        let voucherFullData = {
            Voucher: voucherTbToUpdate,
            VoucherDetail: vouchDtToUpdate,
            // VoucherDate: voucherDate,
            Attachment: {
                AttachmentData_List: attachmentsToUpdate
            },
            UserInfos: userInfo
        };

        // let voucherFullData=0;
        //After ajax, empty the array of deletedVoucherDTRows
        // setDeletedVoucherDTRows([]);
        console.log("sending data for update");
        console.log(voucherFullData);
        let flagSomethingToUpdate = (voucherTbToUpdate.ReferenceNo || voucherTbToUpdate.Description || vouchDtToUpdate.length || attachmentsToUpdate.length);
        console.log("flag nothing to update watches");
        console.log(voucherTbToUpdate.ReferenceNo + " " + voucherTbToUpdate.Description + " " + vouchDtToUpdate.length + " " + attachmentsToUpdate.length);

        if (voucherDtTb.length && debitCreditFlag && mandatoryFieldFlag && flagSomethingToUpdate) {

            Swal.fire({
                title: `Are you sure you want to update?`,
                showDenyButton: true,
                icon: 'question',
                showCancelButton: false,
                confirmButtonText: 'Yes, I am!',
                denyButtonText: `No, I'm Not!`,
            }).then((result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                    // setVoucherNumber(res.data);
                    // vouchNoInpRef.current.value = res.data;
                    axios.post(`${userInfo.Ip}/API/CreditVouch/Update_CV_Voucher`, voucherFullData)
                        .then(res => {
                            console.log("insert er axios!!")
                            if (res) {
                                console.log("response from backend");
                                console.log(res);
                                //clear necessary states and fields
                                setDeletedRegedAttach([]);
                                setDeletedVoucherDTRows([]);

                                Swal.fire({
                                    title: `Voucher No: \n${res.data.Voucher.VoucherNo} \n has been UPDATED!`,
                                    showDenyButton: false,
                                    icon: 'success',
                                    showCancelButton: false,
                                    confirmButtonText: 'OK',
                                    denyButtonText: ``,
                                }).then((result) => {
                                    /* Read more about isConfirmed, isDenied below */
                                    if (result.isConfirmed) {
                                        // setVoucherNumber(res.data);
                                    }
                                })

                                fetch(`${userInfo.Ip}/API/CreditVouch/Get_VoucherAllInfo?voucherNo=${res.data.Voucher.VoucherNo}&voucherId=${res.data.Voucher.VoucherId}`)
                                    .then(res =>
                                        res.json()
                                        // console.log(res);
                                    )
                                    .then((data) => {
                                        console.log("Fetched AGAIN AFTER UPDATE Raw data for voucher Edit, Line No. 517.....");
                                        setCreditVouchToEdit(0);
                                        assignDataForEdit(data.Voucher.Date, data.Voucher.LocationId, data.Location.Name, data.Voucher.VoucherId, data.Voucher.VoucherNo, data.Voucher.AttachmentId, data.Voucher.ReferenceNo, data.Voucher.Description, data.V_VoucherDetailRows, data.Attachment?.AttachmentData_List);
                                    })

                            }

                        })

                }
            })


        }
        // else if (!(total.credit == total.debit)) {
        //     toast.error('Your Debits & Credits are not balanced !!');
        // }
        else if (!voucherDtTb.length) {
            toast.error('No debit data to save!');
        }
        else if (!flagSomethingToUpdate) {
            toast.error("Nothing to update, You didn't change anything!");
        }
    }

    const updateVTDataFeatOn = () => {

        console.log("update");

        let tableAllRows = _.cloneDeep(voucherTableData);
        // console.log(tableAllRows);
        let formData = getValues();
        // let voucherDate = dayjs(voucherDateState).format('YYYY/MM/DD hh:mm A');
        // console.log(exVoucherTableData.Voucher);
        //variable to send for save and update----->
        let voucherTbToUpdate = { VoucherId: exVoucherTableData.Voucher.VoucherId, VoucherNo: exVoucherTableData.Voucher.VoucherNo, AttachmentId: exVoucherTableData.Voucher.AttachmentId };
        // let dataToUpdateSave = {};

        if (exVoucherTableData.Voucher.ReferenceNo != formData.reference || exVoucherTableData.Voucher.Description != formData.description) {
            console.log("if e dhukse,maane data change hoise voucher tb er");
            console.log(exVoucherTableData.Voucher.ReferenceNo + "=?" + formData.reference);
            console.log(exVoucherTableData.Voucher.Description + "=?" + formData.Description);

            voucherTbToUpdate.ReferenceNo = (formData.reference) ? formData.reference : "";
            voucherTbToUpdate.Description = (formData.description) ? (formData.description) : "";
        }
        // dataToUpdateSave.Voucher = voucherTbToUpdate;

        let voucherDtTb = [];
        let debitCreditFlag = true;
        let mandatoryFieldFlag = true;
        for (let i = 0; i < tableAllRows.length; i++) {

            //bool return kore, object er j kono ekta property o jodi faka na hoy taile false ashe, maane isEmpty is false/empty na
            const rowIsEmpty = !Object.values(tableAllRows[i]).some(x => {
                if (typeof x === 'object') {
                    let tempIsEmpty = !Object.values(x).some(y => y !== null && y !== '' && y !== 0 && y.length != 0);
                    return !tempIsEmpty;
                }
                else if (x !== null && x !== '' && x !== 0) {
                    return true;
                }
                else {
                    return false;
                }
            });

            if (!rowIsEmpty) {

                let perRowCredit = isNaN(parseFloat(tableAllRows[i].credit)) ? 0 : parseFloat(tableAllRows[i].credit);
                // let propertyName = `${tableAllRows[i].name.TableName}Id`;
                let perRowForbackend = {};

                if (!(tableAllRows[i].accountHead.AccountsId)) {
                    mandatoryFieldFlag = false;
                    toast.error(`You must select a Account Head for row: ${i + 1}`);
                }
                if ((tableAllRows[i].accountHead.AccountsId) && !(tableAllRows[i].credit)) {
                    mandatoryFieldFlag = false;
                    toast.error(`You must entry a credit for row: ${i + 1}`);
                }

                perRowForbackend = {
                    // VoucherDetailId: (tableAllRows[i].voucherDetailId) ? tableAllRows[i].voucherDetailId : "",
                    AccountsId: tableAllRows[i].accountHead.AccountsId,
                    ProjectId: tableAllRows[i].project.ProjectId,
                    Particulars: tableAllRows[i].particulars,
                    Debit: 0,
                    Credit: perRowCredit,
                }
                if (tableAllRows[i].voucherDetailId) {
                    perRowForbackend = { VoucherDetailId: tableAllRows[i].voucherDetailId, ...perRowForbackend };
                }

                if (tableAllRows[i].name?.length) {
                    for (let j = 0; j < tableAllRows[i].name.length; j++) {
                        perRowForbackend[tableAllRows[i].name[j].PropertyName] = tableAllRows[i].name[j].Id;
                    }
                }
                voucherDtTb.push(perRowForbackend);
            }
        }

        // console.log(voucherFullData);
        console.log("line 977...........!!!!!!!!");
        // console.log(voucherFullData.VoucherDetail);

        let loopNumber = (voucherDtTb.length > exVoucherTableData.VoucherDetail.length) ? voucherDtTb.length : exVoucherTableData.VoucherDetail.length;
        let vouchDtToUpdate = [];
        let debitRowToUpdate = {};
        for (let i = 0; i < loopNumber; i++) {
            console.log("current table");
            console.log(voucherDtTb[i]);

            console.log("old table");
            console.log(exVoucherTableData.VoucherDetail[i]);
            if (JSON.stringify(voucherDtTb[i]) != JSON.stringify(exVoucherTableData.VoucherDetail[i])) {
                vouchDtToUpdate.push(voucherDtTb[i]);
            }
            else if (!voucherDtTb[i]) {
                vouchDtToUpdate.push({ VoucherDetailId: exVoucherTableData.VoucherDetail[i] });
            }
            else if (!(exVoucherTableData.VoucherDetail[i])) {
                vouchDtToUpdate.push(voucherDtTb[i]);
            }
            // if ((JSON.stringify(voucherDtTb[i]) != JSON.stringify(exVoucherTableData.VoucherDetail[i])) && !voucherDtTb[i]) {
            //     vouchDtToUpdate.push(voucherDtTb[i]);
            // }
            // else if ((JSON.stringify(voucherDtTb[i]) != JSON.stringify(exVoucherTableData.VoucherDetail[i])) && !(exVoucherTableData.VoucherDetail[i])) {
            //     // vouchDtToUpdate.push({ VoucherDetailId: exVoucherTableData.VoucherDetail[i] });
            // }
            // else if ((JSON.stringify(voucherDtTb[i]) != JSON.stringify(exVoucherTableData.VoucherDetail[i])) && (exVoucherTableData.VoucherDetail[i].VoucherDetailId == voucherDtTb[i].VoucherDetailId)) {
            //     // vouchDtToUpdate.push({ VoucherDetailId: exVoucherTableData.VoucherDetail[i] });
            //     vouchDtToUpdate.push(voucherDtTb[i]);
            // }
            // else if (!(exVoucherTableData.VoucherDetail[i])) {
            //     vouchDtToUpdate.push(voucherDtTb[i]);
            // }
        }


        let debitInfoFormatted = {
            VoucherDetailId: (debitVoucherInfo.voucherDetailId) ? debitVoucherInfo.voucherDetailId : "",
            AccountsId: (debitVoucherInfo.accountHead?.AccountsId) ? debitVoucherInfo.accountHead?.AccountsId : "",
            ProjectId: (debitVoucherInfo.project?.ProjectId) ? debitVoucherInfo.project?.ProjectId : "",
            Particulars: debitVoucherInfo.particulars,
            Debit: total.credit,
            Credit: 0
        }
        // if (debitVoucherInfo.name?.Id) {
        //     debitInfoFormatted[`${debitVoucherInfo.name.TableName}Id`] = debitVoucherInfo.name?.Id;
        // }

        if (debitVoucherInfo.name?.length) {
            for (let j = 0; j < debitVoucherInfo.name.length; j++) {
                debitInfoFormatted[debitVoucherInfo.name[j].PropertyName] = debitVoucherInfo.name[j].Id;
            }
        }

        if (!debitInfoFormatted.AccountsId) {
            toast.error("You must enter a Debit Account Head");
            mandatoryFieldFlag = false;
        }
        else if (!debitInfoFormatted.ProjectId) {
            toast.error("You must enter a Debit Project");
            mandatoryFieldFlag = false;

        }
        else if (JSON.stringify(debitInfoFormatted) != JSON.stringify(exVoucherTableData.DebitDetail) && debitInfoFormatted.AccountsId && debitInfoFormatted.ProjectId) {
            console.log("hello rupom yo yo");
            console.log(debitInfoFormatted);
            console.log(exVoucherTableData.DebitDetail);
            debitRowToUpdate = debitInfoFormatted;
            vouchDtToUpdate = [...vouchDtToUpdate, debitRowToUpdate];
        }

        console.log("deletedVoucherDTRows");

        console.log(deletedVoucherDTRows);
        vouchDtToUpdate = [...vouchDtToUpdate, ...deletedVoucherDTRows]
        console.log("AFTER UPDATE YOYO........");
        console.log(vouchDtToUpdate);

        console.log("deleted attachments");
        console.log(deletedRegedAttach);
        let attachmentsToUpdate = [];
        for (let i = 0; i < attachments.length; i++) {
            if (!(attachments[i].autoSL)) {
                let perAttachFormatted = {
                    FileName: attachments[i].fileName,
                    AttachmentType: attachments[i].fileExtension,
                    FileBase64: (attachments[i].fileB64format).substr((attachments[i].fileB64format.lastIndexOf(',') + 1))
                }
                attachmentsToUpdate.push(perAttachFormatted);
            }
        }
        attachmentsToUpdate = [...attachmentsToUpdate, ...deletedRegedAttach]


        let voucherFullData = {
            Voucher: voucherTbToUpdate,
            VoucherDetail: vouchDtToUpdate,
            // VoucherDate: voucherDate,
            Attachment: {
                AttachmentData_List: attachmentsToUpdate
            },
            UserInfos: userInfo
        };

        // let voucherFullData=0;
        //After ajax, empty the array of deletedVoucherDTRows
        // setDeletedVoucherDTRows([]);
        console.log("sending data for update");
        console.log(voucherFullData);
        let flagSomethingToUpdate = (voucherTbToUpdate.ReferenceNo || voucherTbToUpdate.Description || vouchDtToUpdate.length || attachmentsToUpdate.length);
        console.log("flag nothing to update watches");
        console.log(voucherTbToUpdate.ReferenceNo + " " + voucherTbToUpdate.Description + " " + vouchDtToUpdate.length + " " + attachmentsToUpdate.length);

        if (voucherDtTb.length && debitCreditFlag && mandatoryFieldFlag && flagSomethingToUpdate) {

            Swal.fire({
                title: `Are you sure you want to update?`,
                showDenyButton: true,
                icon: 'question',
                showCancelButton: false,
                confirmButtonText: 'Yes, I am!',
                denyButtonText: `No, I'm Not!`,
            }).then((result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                    // setVoucherNumber(res.data);
                    // vouchNoInpRef.current.value = res.data;
                    axios.post(`${userInfo.Ip}/API/CreditVouch/Update_CV_Voucher`, voucherFullData)
                        .then(res => {
                            console.log("insert er axios!!")
                            if (res) {
                                console.log("response from backend");
                                console.log(res);
                                //clear necessary states and fields
                                setDeletedRegedAttach([]);
                                setDeletedVoucherDTRows([]);

                                Swal.fire({
                                    title: `Voucher No: \n${res.data.Voucher.VoucherNo} \n has been UPDATED!`,
                                    showDenyButton: false,
                                    icon: 'success',
                                    showCancelButton: false,
                                    confirmButtonText: 'OK',
                                    denyButtonText: ``,
                                }).then((result) => {
                                    /* Read more about isConfirmed, isDenied below */
                                    if (result.isConfirmed) {
                                        // setVoucherNumber(res.data);
                                    }
                                })

                                fetch(`${userInfo.Ip}/API/CreditVouch/Get_VoucherAllInfoFeatOn?voucherNo=${res.data.Voucher.VoucherNo}&voucherId=${res.data.Voucher.VoucherId}`)
                                    .then(res =>
                                        res.json()
                                        // console.log(res);
                                    )
                                    .then((data) => {
                                        console.log("Fetched AGAIN AFTER UPDATE Raw data for voucher Edit, Line No. 517.....");
                                        setCreditVouchToEdit(0);
                                        assignDataForEditFeatOn(data.Voucher.Date, data.Voucher.LocationId, data.Location.Name, data.Voucher.VoucherId, data.Voucher.VoucherNo, data.Voucher.AttachmentId, data.Voucher.ReferenceNo, data.Voucher.Description, data.V_VoucherDetailRows, data.Attachment?.AttachmentData_List);
                                    })

                            }

                        })

                }
            })


        }
        // else if (!(total.credit == total.debit)) {
        //     toast.error('Your Debits & Credits are not balanced !!');
        // }
        else if (!voucherDtTb.length) {
            toast.error('No credit data to save!');
        }
        else if (!flagSomethingToUpdate) {
            toast.error("Nothing to update, You didn't change anything!");
        }
    }


    const editVouchBtn = () => {
        setCreditVouchToEdit({});
        navigate('/voucherEdit');
    }

    const cashBankRadio = (value) => {


        Swal.fire({
            title: `Are you sure?`,
            text: 'Options for debit account head will get changed!',
            showDenyButton: true,
            icon: 'question',
            showCancelButton: false,
            confirmButtonText: 'Yes,I am!',
            denyButtonText: `No, Don't Change!`,
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                // setVoucherNumber(res.data);
                setRadioVal(value);
                // console.log(event.target.value);
                fetch(`${userInfo.Ip}/API/CreditVouch/Get_AccountHeadDeb?locationId=${userInfo.LocationId}&companyId=${userInfo.CompanyId}&identificationType=${value}`)
                    .then(res =>
                        res.json()
                        // console.log(res);
                    )
                    .then((data) => {
                        console.log("on radio button change account heads");
                        console.log(data);
                        let accHead = [];
                        for (let i = 0; i < data.length; i++) {
                            let temp = { Name: data[i].Name, AccountsId: data[i].AccountsId, ControlAccountId: data[i].ControlAccountId };
                            accHead.push(temp);
                        }
                        // console.log(accHead);
                        setAccountsHeadDebit(accHead);
                        // setVoucherTableData(emptyRows);
                        // setdebitVoucherInfo({ accountHead: { Name: "", AccountsId: "" }, controlAccName: { Name: "", id: "" }, project: { Name: "", Code: "", ProjectId: "" }, particulars: "", credit: "", name: { Name: "", TableName: "", Id: "" } });
                    })
            }
        })


    };


    //-----[codes to execute while the page gets unmounted]-------
    useEffect(() => {
        return () => {
            // Anything in here is fired on component unmount.
            setJvToEdit(0);
            setContraVouchToEdit(0);
            setDebitVouchToEdit(0);
            setCreditVouchToEdit(0);
            setVouchAgtVouchToEdit(0);
        }
    }, [])

    const rupom = () => {
        console.log("rupom");
        // console.log(debitVoucherInfo);

        fetch(`${userInfo.Ip}/API/CreditVouch/Get_AccountHeadDeb?locationId=${1}&companyId=${1}&identificationType=${"Bank"}`)
            .then(res => {
                res.json();
                console.log(res.json());

                console.log(res);
            }

            )
            .then((data) => {
                console.log("Fetched in Rupom Function Line No. 1119.....");
                console.log(data);
            })



        fetch(`${userInfo.Ip}/API/CreditVouch/Get_Location?companyId=${userInfo.CompanyId}`)
            .then(res => {
                res.json();
                console.log(res);
            }
            )
            .then((data) => {
                console.log(data);
                // setLocation(data)
            })

        fetch(`${userInfo.Ip}/API/CreditVouch/Get_Project?companyId=${userInfo.CompanyId}`)
            .then(res => {
                res.json();
                console.log(res);
            }
            )
            .then((data) => {
                console.log(data);
                let temp = [];
                for (let i = 0; i < data.length; i++) {
                    let perObj = { Name: data[i].Name, Code: data[i].Code, ProjectId: data[i].ProjectId };
                    temp.push(perObj);
                }
                // setProject(temp);
            })


        fetch(`${userInfo.Ip}/API/CreditVouch/Get_AccountHeadDeb?locationId=${userInfo.LocationId}&companyId=${userInfo.CompanyId}&identificationType=${radioVal}`)
            .then(res => {
                res.json();
                console.log(res);
            }
            )
            .then((data) => {
                console.log("Accounts Head");
                console.log(data);
                let accHead = [];
                for (let i = 0; i < data.length; i++) {
                    let temp = { Name: data[i].Name, AccountsId: data[i].AccountsId, ControlAccountId: data[i].ControlAccountId };
                    accHead.push(temp);
                }
                // console.log(accHead);
                setAccountsHeadDebit(accHead);
            })

        fetch(`${userInfo.Ip}/API/CreditVouch/Get_AccountHeadAll?companyId=${userInfo.CompanyId}&locationId=${userInfo.LocationId}`)
            .then(res => {
                res.json();
                console.log(res);
            }
            )
            .then((data) => {
                console.log(data);
                let accHead = [];
                for (let i = 0; i < data.length; i++) {
                    let temp = { Name: data[i].Name, AccountsId: data[i].AccountsId, ControlAccountId: data[i].ControlAccountId };
                    accHead.push(temp);
                }
                // console.log(accHead);
                // setAccountsHead(accHead);
            })

        fetch(`${userInfo.Ip}/API/CreditVouch/Get_AllBuyerEmpSupLoc?companyId=${userInfo.CompanyId}`)
            .then(res => {
                res.json();
                console.log(res);
            }
            )
            .then((data) => {
                console.log(data);
                // setAllNames(data);
            })

    }

    return (
        // return wrapper div
        <div className='mt-16 md:mt-2'>

            <div className="m-2 flex justify-center">
                <div className="block w-11/12 ">

                    {/* Main Card */}
                    <div className="block rounded-lg shadow-lg bg-white dark:bg-secondary-dark-bg  text-center">
                        {/* Main Card header */}
                        <div className="py-3 'bg-white text-xl dark:text-gray-200 text-start px-6 border-b border-gray-300">
                            Credit Voucher
                        </div>
                        {/* Main Card header--/-- */}

                        {/* Main Card body */}
                        <div className=" px-6 pb-4 text-start md:min-h-[60vh] grid grid-cols-4 gap-4 mt-2">

                            <fieldset className="md:col-span-4 col-span-4 border border-solid border-gray-300 px-3 pt-1 pb-3 dark:text-slate-50">
                                <legend className="text-sm">Credit Voucher</legend>



                                <form className='' >
                                    <div className='w-full grid-cols-2 grid gap-x-4 gap-y-1'>


                                        <div className='col-span-2'>

                                            <FormControl>
                                                <RadioGroup
                                                    row
                                                    aria-labelledby="debitType"
                                                    name="debitType"
                                                    value={radioVal}
                                                    onChange={(event) => {
                                                        cashBankRadio(event.target.value);
                                                    }}
                                                >
                                                    <FormControlLabel
                                                        value="Bank"
                                                        control={<Radio sx={{
                                                            '& .MuiSvgIcon-root': {
                                                                fontSize: 15,
                                                            },
                                                        }} />}
                                                        label={<Box component="div" fontSize={14}>
                                                            Bank Debit
                                                        </Box>}
                                                    />
                                                    <FormControlLabel
                                                        value="Cash"
                                                        control={<Radio sx={{
                                                            '& .MuiSvgIcon-root': {
                                                                fontSize: 15,
                                                            },
                                                        }} />}
                                                        label={<Box component="div" fontSize={14}>
                                                            Cash Debit
                                                        </Box>}
                                                    />
                                                </RadioGroup>
                                            </FormControl>

                                        </div>

                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DateTimePicker
                                                label="Voucher Date"
                                                // inputFormat="DD/MM/YYYY HH:MM" blockletter HH means hours in 24h format, small letter hh means 12h format. dd/mm/yyyy value varies if DD/MM/YYY check urself. for am/pm= a, AM/PM= A
                                                //visit https://day.js.org/docs/en/parse/string-format for datetime formats
                                                inputFormat="DD/MM/YYYY hh:mm A"
                                                readOnly={voucherIs ? true : false}
                                                renderInput={(params) =>
                                                    <TextField
                                                        sx={{ width: '100%', marginTop: 1 }}
                                                        {...params}
                                                        {...register("voucherDate")}
                                                        // defaultValue={voucherDateState}
                                                        InputProps={{ ...params.InputProps, style: { fontSize: 13 } }}
                                                        InputLabelProps={{
                                                            ...params.InputLabelProps, style: { fontSize: 14 },

                                                        }}
                                                        variant="standard"
                                                        size="small"
                                                    />}
                                                value={voucherDateState}
                                                onChange={(newValue) => {

                                                    console.log("date Changed");
                                                    console.log(newValue);

                                                    setVoucherDateState(newValue);
                                                }}
                                            />
                                        </LocalizationProvider>

                                        <Autocomplete
                                            id="location"
                                            clearOnEscape
                                            size="small"

                                            options={location}
                                            // defaultValue={(locationOutput) ? locationOutput : { Name: "", LocationId: "" }}
                                            value={locationOutput}
                                            readOnly={true}
                                            // defaultValue={locationOutput?.Name ? locationOutput?.Name : ''}
                                            getOptionLabel={(option) => (option.Name) ? option.Name : ""}

                                            onChange={(e, selectedOption) => {
                                                console.log(selectedOption);
                                                setLocationOutput(selectedOption);
                                            }}
                                            renderInput={(params) => (
                                                <TextField
                                                    sx={{ width: '100%', marginTop: 1 }}
                                                    {...params}
                                                    {...register("location")}

                                                    InputProps={{ ...params.InputProps, style: { fontSize: 13 } }}
                                                    InputLabelProps={{
                                                        ...params.InputLabelProps, style: { fontSize: 14 },

                                                    }}
                                                    onChange={(newValue) => {
                                                        console.log("autocomp Changed")
                                                    }}
                                                    label="Location" variant="standard" />
                                            )}
                                        />

                                        <Controller
                                            name="voucherNo"
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    sx={{ width: '100%' }} InputProps={{ style: { fontSize: 13 }, readOnly: true }}
                                                    InputLabelProps={{
                                                        style: { fontSize: 14 },
                                                        // shrink: field.value
                                                        shrink: (field.value ? true : false)
                                                    }}
                                                    // inputRef={node => {
                                                    //     console.log(field);
                                                    //     console.log(node);
                                                    //     // if (node) {
                                                    //     //     node.value = voucherNumber;
                                                    //     // }
                                                    // }}
                                                    // onFocus={() => {
                                                    //     field.focus = true;
                                                    // }}
                                                    // onBlur={() => {
                                                    //     field.focus = false;
                                                    // }}
                                                    // inputRef={vouchNoInpRef}
                                                    id="voucherNo" label="Voucher No." variant="standard" size="small" />
                                            )}
                                        />

                                        <Controller
                                            name="reference"
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    sx={{ width: '100%' }} InputProps={{ style: { fontSize: 13 } }}
                                                    InputLabelProps={{
                                                        style: { fontSize: 14 },
                                                        shrink: field.value
                                                        // shrink: (field.value ? true : false)

                                                    }}

                                                    id="reference" label="Reference" variant="standard" size="small"
                                                //  multiline
                                                // maxRows={4} 
                                                />
                                            )}
                                        />
                                        {/* <TextField sx={{ width: '100%' }} {...register("reference")} InputProps={{ style: { fontSize: 13 } }}
                                            InputLabelProps={{
                                                style: { fontSize: 14 },

                                            }} id="reference" label="Reference" variant="standard" size="small" multiline
                                            maxRows={4}
                                        /> */}
                                        <div className='col-span-2'>
                                            <Controller
                                                name="description"
                                                control={control}
                                                render={({ field }) => (
                                                    <TextField
                                                        {...field}
                                                        sx={{ width: '100%' }} InputProps={{ style: { fontSize: 13 } }}
                                                        InputLabelProps={{
                                                            style: { fontSize: 14 },
                                                            shrink: field.value
                                                            // shrink: (field.value ? true : false)

                                                        }}

                                                        id="description" label="Description" variant="standard" size="small"
                                                    // multiline
                                                    // maxRows={4} 
                                                    />
                                                )}
                                            />
                                        </div>

                                        <div className='col-span-2 grid-cols-4 grid gap-x-4 gap-y-1'>
                                            <Autocomplete
                                                id="debitAccHead"
                                                clearOnEscape
                                                size="small"
                                                options={accountsHeadDebit}
                                                getOptionLabel={(option) => (option.Name) ? option.Name : ""}
                                                value={debitVoucherInfo.accountHead ? debitVoucherInfo.accountHead : ""}
                                                onChange={(e, selectedOption) => {
                                                    // console.log(selectedOption);
                                                    // debitVoucherInfo.accountHead = selectedOption;
                                                    // console.log("from head selection......")
                                                    // // --[filling project cell of the same row]--
                                                    // const matchedIndex = project.findIndex(e => e.Code === 'GN');
                                                    // console.log(matchedIndex);
                                                    // console.log(project[matchedIndex]);
                                                    // if (matchedIndex > -1 && !(debitVoucherInfo.project?.ProjectId)) {
                                                    //     debitVoucherInfo.project = project[matchedIndex];
                                                    // }
                                                    // setDebitVoucherInfo({ ...debitVoucherInfo });

                                                    handleDebitAccHeadSelection(e, selectedOption);
                                                }}
                                                renderInput={(params) => (
                                                    <TextField
                                                        sx={{ width: '100%', marginTop: 1 }}
                                                        {...params}

                                                        InputProps={{ ...params.InputProps, style: { fontSize: 13 } }}
                                                        InputLabelProps={{
                                                            ...params.InputLabelProps, style: { fontSize: 14 },

                                                        }}
                                                        label="Debit Account Head" variant="standard" />
                                                )}
                                            />
                                            <Autocomplete
                                                id="debitProject"
                                                clearOnEscape
                                                size="small"
                                                options={project}
                                                getOptionLabel={(option) => (option.Name) ? option.Name : ""}
                                                value={(debitVoucherInfo.project) ? debitVoucherInfo.project : { Name: '', Code: '', ProjectId: '' }}

                                                onChange={(e, selectedOption) => {
                                                    console.log(selectedOption);
                                                    debitVoucherInfo.project = selectedOption;
                                                    setDebitVoucherInfo({ ...debitVoucherInfo });
                                                }}
                                                renderInput={(params) => (
                                                    <TextField
                                                        sx={{ width: '100%', marginTop: 1 }}
                                                        {...params}
                                                        InputProps={{ ...params.InputProps, style: { fontSize: 13 } }}
                                                        InputLabelProps={{
                                                            ...params.InputLabelProps, style: { fontSize: 14 },

                                                        }}
                                                        inputRef={(node) => {
                                                            if (node) {
                                                                node.value = (debitVoucherInfo.project?.Name) ? debitVoucherInfo.project?.Name : "";
                                                            }
                                                        }}

                                                        label="Project" variant="standard" />
                                                )}
                                            />




                                            {brFeatures.VariableAccountAnalysis ?
                                                (
                                                    <NameComponentDebit nameArr={debitVoucherInfo.name} btnNameModalFunct={btnNameModalDebitTrigger} />
                                                ) :
                                                (

                                                    <Autocomplete
                                                        id="debitName"
                                                        // PopperComponent={PopperMy}
                                                        clearOnEscape

                                                        size="small"
                                                        options={allNames}
                                                        value={(debitVoucherInfo.name) ? debitVoucherInfo.name : { Name: '', Id: '', TableName: '' }}

                                                        onChange={(e, selectedOption) => {
                                                            console.log(selectedOption);
                                                            debitVoucherInfo.name = selectedOption;
                                                            setDebitVoucherInfo({ ...debitVoucherInfo });
                                                            // setLocationOutput(selectedOption);
                                                        }}
                                                        getOptionLabel={(option) => (option.Name) ? option.Name : ""}
                                                        renderOption={(props, option) => (
                                                            <List {...props} key={option.Id}>
                                                                <ListItem>
                                                                    <ListItemText primary={option.Name}
                                                                        secondary={option.TableName} />
                                                                </ListItem>
                                                            </List>

                                                        )}
                                                        renderInput={(params) =>

                                                            <TextField
                                                                sx={{ width: '100%', marginTop: 1 }}
                                                                {...params}
                                                                // {...register("credName")}
                                                                // value={(debitVoucherInfo.name?.Name) ? debitVoucherInfo.name?.Name : ""}
                                                                // inputRef={(node) => {
                                                                //     if (node) {
                                                                //         node.value = debitVoucherInfo.name?.Name;
                                                                //     }
                                                                // }}

                                                                InputProps={{ ...params.InputProps, style: { fontSize: 13 } }}
                                                                InputLabelProps={{
                                                                    ...params.InputLabelProps, style: { fontSize: 14 },

                                                                }}
                                                                // onChange={(newValue) => {
                                                                //     console.log("autocomp Changed")
                                                                // }}
                                                                label="Name" variant="standard" />
                                                        }
                                                    />
                                                )
                                            }










                                            <Controller
                                                name="debitParticulars"
                                                control={control}
                                                render={({ field }) => (
                                                    <TextField
                                                        {...field}
                                                        sx={{ width: '100%' }} InputProps={{ style: { fontSize: 13 } }}
                                                        // value={debitVoucherInfo.particulars ? debitVoucherInfo.particulars : ""}
                                                        inputRef={node => {
                                                            if (node) {
                                                                node.value = debitVoucherInfo.particulars ? debitVoucherInfo.particulars : ""

                                                            }
                                                        }}
                                                        onBlur={(e) => {
                                                            console.log("rupom onblur");
                                                            console.log(field.value);
                                                            debitVoucherInfo.particulars = e.target.value;
                                                            setDebitVoucherInfo({ ...debitVoucherInfo });
                                                        }}
                                                        InputLabelProps={{
                                                            style: { fontSize: 14 },
                                                            shrink: field.value || debitVoucherInfo.particulars
                                                            // shrink: (field.value ? true : false)

                                                        }}

                                                        id="debitParticulars" label="Debit Particulars" variant="standard" size="small"
                                                    //  multiline
                                                    // maxRows={4} 
                                                    />
                                                )}
                                            />

                                            {/* <TextField className='col-span-2' sx={{ width: '100%' }} {...register("description")} InputProps={{ style: { fontSize: 13 } }}
                                            InputLabelProps={{
                                                style: { fontSize: 14 },

                                            }} id="description" label="Description" variant="standard" size="small" multiline
                                            maxRows={4}
                                        /> */}
                                        </div>
                                        <div className='ml-3 mb-3 mt-1'>
                                            <AttachmentLoader attachments={attachments} setAttachments={setAttachments} deletedRegedAttach={deletedRegedAttach} setDeletedRegedAttach={setDeletedRegedAttach} imgPerSlide={4}></AttachmentLoader>
                                        </div>

                                        <div className='col-start-1 col-span-2 flex justify-end gap-x-3 mt-1'>
                                            <button
                                                type="button"
                                                data-mdb-ripple="true"
                                                data-mdb-ripple-color="light"
                                                className="inline-block px-4 py-1.5 bg-blue-600 text-white font-medium text-xs leading-tight rounded shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out"
                                                onClick={() => { }}
                                            >LC Create</button>

                                            <button
                                                type="button"
                                                data-mdb-ripple="true"
                                                data-mdb-ripple-color="light"
                                                className="inline-block px-4 py-1.5 bg-blue-600 text-white font-medium text-xs leading-tight rounded shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out"
                                                onClick={() => { }}
                                            >LC Assign</button>

                                            {/* <button
                                                type="button"
                                                data-mdb-ripple="true"
                                                data-mdb-ripple-color="light"
                                                className="inline-block px-4 py-1.5 bg-blue-600 text-white font-medium text-xs leading-tight rounded shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out"
                                                onClick={rupom}
                                            >Rupom</button> */}
                                        </div>



                                    </div>
                                </form>

                            </fieldset>



                            {/* <fieldset className="border border-solid border-gray-300 col-span-4 px-3 pt-1 pb-3 dark:text-slate-50"> */}
                            {/* <legend className="text-sm">Voucher Table</legend> */}

                            <div className=" grid md:grid-cols-3 grid-cols-1 gap-x-4 gap-y-1 col-span-4 pb-3">

                                {/* material-table */}

                                <div className='col-span-3 max-w-full'>
                                    {/* {renderVar ? */}
                                    <div className='modifiedEditTable'>
                                        {(brFeatures?.VariableAccountAnalysis) ? (
                                            <MaterialReactTable
                                                columns={voucherTableColumnsFeatOn}
                                                data={voucherTableData}
                                                // editingMode="table"
                                                // enableEditing
                                                enablePagination={false}
                                                enableColumnOrdering
                                                // enableGlobalFilter={false}
                                                // enableColumnFilters={false}
                                                enableDensityToggle={false}
                                                initialState={{ density: 'compact' }}
                                                enableStickyHeader
                                                enableStickyFooter
                                                enableColumnResizing

                                                muiTableContainerProps={{ sx: { height: '480px' } }} //ekhane table er data height
                                                muiTableHeadCellProps={{
                                                    //simple styling with the `sx` prop, works just like a style prop in this example
                                                    sx: {
                                                        fontWeight: 'Bold',
                                                        fontSize: '13px',
                                                    },
                                                    // align: 'left',
                                                }}
                                            />
                                        ) : (
                                            <MaterialReactTable
                                                columns={voucherTableColumns}
                                                data={voucherTableData}
                                                // editingMode="table"
                                                // enableEditing
                                                enablePagination={false}
                                                enableColumnOrdering
                                                // enableGlobalFilter={false}
                                                // enableColumnFilters={false}
                                                enableDensityToggle={false}
                                                initialState={{ density: 'compact' }}
                                                enableStickyHeader
                                                enableStickyFooter
                                                enableColumnResizing

                                                muiTableContainerProps={{ sx: { height: '480px' } }} //ekhane table er data height
                                                muiTableHeadCellProps={{
                                                    //simple styling with the `sx` prop, works just like a style prop in this example
                                                    sx: {
                                                        fontWeight: 'Bold',
                                                        fontSize: '13px',
                                                    },
                                                    // align: 'left',
                                                }}
                                            />
                                        )
                                        }

                                    </div>

                                </div>

                            </div>

                            {/* </fieldset> */}
                        </div>
                        {/* Main Card Body--/-- */}

                        {/* Main Card footer */}
                        <div className="py-3 px-6 border-t text-start border-gray-300 text-gray-600">
                            <div className="flex gap-x-3">
                                {voucherIs ? (<button
                                    type="button"
                                    data-mdb-ripple="true"
                                    data-mdb-ripple-color="light"
                                    className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out"
                                    onClick={() => { (brFeatures?.VariableAccountAnalysis) ? updateVTDataFeatOn() : updateVTData() }}
                                >Update</button>) : (<button
                                    type="button"
                                    data-mdb-ripple="true"
                                    data-mdb-ripple-color="light"
                                    className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out"
                                    onClick={() => { (brFeatures?.VariableAccountAnalysis) ? saveVTdataFeatOn() : saveVTdata() }}
                                >Save & Continue</button>
                                )}

                                <button
                                    type="button"
                                    data-mdb-ripple="true"
                                    data-mdb-ripple-color="light"
                                    className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out"
                                    onClick={() => { editVouchBtn() }}
                                >{voucherIs ? "Edit another voucher" : "Edit a voucher"}</button>

                                <button
                                    type="button"
                                    data-mdb-ripple="true"
                                    data-mdb-ripple-color="light"
                                    className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out"
                                    onClick={() => { clearData() }}
                                >Clear</button>

                                {/* <button
                                    type="button"
                                    data-mdb-ripple="true"
                                    data-mdb-ripple-color="light"
                                    className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out"
                                    onClick={() => reRenderManually()}
                                >rerender</button> */}
                            </div>

                        </div>
                        {/* Main Card footer--/-- */}
                    </div>
                    {/* Main Card--/-- */}

                </div>
            </div>


            {/* --------------Modals--------------- */}
            <Modal
                open={nameModalOpen}
                onClose={() => {
                    setNameModalOpen(false);
                }}
                aria-labelledby="parent-modal-title"
                aria-describedby="parent-modal-description"
            >
                <Box sx={{ ...nameModalStyle }}>
                    <fieldset className="border border-solid border-gray-300 px-3 pt-1 pb-3 dark:text-slate-50">
                        <legend className="text-sm">Fill up these fields</legend>

                        {nameModalInputs.inputs.length ? ("") : (<p>Sorry, This account head do not have any permission to enter a name</p>)}

                        {nameModalInputs.inputs.map(perInp => {

                            //ekhon jodi modal ta mui grid theke call hoy taile else, jodi credit Name e click dile call hoy tahole if
                            let currentVouchTbDataRow;
                            if (debitNameTrigger) {
                                currentVouchTbDataRow = debitVoucherInfo;
                            }
                            else {
                                currentVouchTbDataRow = voucherTableData[nameModalInputs.rowIndex];
                            }

                            // let currentIndex = nameModalInputs.rowIndex;
                            // let currentVouchTbDataRow = voucherTableData[currentIndex];

                            let nameArray = (currentVouchTbDataRow?.name) ? (currentVouchTbDataRow?.name) : "";
                            console.log("I AM THE BEST RUPOM, VALUES, NAME ARRAY")
                            // let actualValue={ Name: "", InputName: "", PropertyName: "", Id: "" }
                            console.log(nameArray);
                            let inputDefaultValue = {};
                            if (nameArray) {
                                inputDefaultValue = nameArray.find(item => item.InputName == perInp.InputName);
                            }
                            return (
                                <div className='mt-3'>
                                    <Autocomplete
                                        id=""
                                        clearOnEscape
                                        size="small"
                                        sx={{ width: "100%", marginTop: "7px" }}
                                        options={perInp.InputOptions}
                                        value={inputDefaultValue}
                                        getOptionLabel={(option) => (option?.Name) ? option.Name : ""}
                                        onChange={(e, selectedOption) => {
                                            let matchedIndex = currentVouchTbDataRow.name.findIndex(item => item.InputName == perInp.InputName);
                                            console.log("rupom needs to see selected Option for multi autocomplete");
                                            console.log(selectedOption);

                                            if (selectedOption) {
                                                if (matchedIndex > -1) {
                                                    currentVouchTbDataRow.name[matchedIndex] = selectedOption;
                                                }
                                                else {
                                                    currentVouchTbDataRow.name.push(selectedOption);
                                                    //sorting the array
                                                    currentVouchTbDataRow.name.sort(function (a, b) {
                                                        let textA = a.PropertyName.toLowerCase();
                                                        let textB = b.PropertyName.toLowerCase();
                                                        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                                                    });
                                                }
                                            }
                                            else {
                                                if (matchedIndex > -1) {
                                                    currentVouchTbDataRow.name.splice(matchedIndex, 1);
                                                }
                                            }
                                            //ekhon jodi modal ta mui grid theke call hoy taile else, jodi credit Name e click dile call hoy tahole if
                                            if (debitNameTrigger) {
                                                setDebitVoucherInfo({ ...debitVoucherInfo });
                                            }
                                            else {
                                                setVoucherTableData([...voucherTableData]);
                                            }
                                            // setVoucherTableData([...voucherTableData]);

                                            console.log(selectedOption);
                                        }
                                        }
                                        renderInput={(params) => (
                                            <TextField
                                                sx={{ width: '100%', marginTop: 1 }}
                                                {...params}
                                                // {...register("plantNameSel")}

                                                InputProps={{ ...params.InputProps, style: { fontSize: 13 } }}
                                                InputLabelProps={{
                                                    ...params.InputLabelProps, style: { fontSize: 14 },
                                                }}
                                                label={`Select ${perInp.InputName}`} variant="outlined" />
                                        )}
                                    />
                                </div>

                            )


                        })}
                    </fieldset>
                </Box>
            </Modal>



        </div >
        // return wrapper div--/--
    )
}

export default CreditVoucher