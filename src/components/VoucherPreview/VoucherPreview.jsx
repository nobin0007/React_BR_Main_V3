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
    Grid,
    Radio,
    RadioGroup,
    Modal,
    TextField,
    Slider,
    Select,
    MenuItem,
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
import './VoucherPreview.css';

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
    { accountHead: { Name: "", AccountsId: "" }, controlAccName: { Name: "", id: "" }, project: { Name: "", Code: "", ProjectId: "" }, particulars: "", debit: "", credit: "", name: { Name: "", TableName: "", Id: "" } },

    { accountHead: { Name: "", AccountsId: "" }, controlAccName: { Name: "", id: "" }, project: { Name: "", Code: "", ProjectId: "" }, particulars: "", debit: "", credit: "", name: { Name: "", TableName: "", Id: "" } },

    { accountHead: { Name: "", AccountsId: "" }, controlAccName: { Name: "", id: "" }, project: { Name: "", Code: "", ProjectId: "" }, particulars: "", debit: "", credit: "", name: { Name: "", TableName: "", Id: "" } },

    { accountHead: { Name: "", AccountsId: "" }, controlAccName: { Name: "", id: "" }, project: { Name: "", Code: "", ProjectId: "" }, particulars: "", debit: "", credit: "", name: { Name: "", TableName: "", Id: "" } },

    { accountHead: { Name: "", AccountsId: "" }, controlAccName: { Name: "", id: "" }, project: { Name: "", Code: "", ProjectId: "" }, particulars: "", debit: "", credit: "", name: { Name: "", TableName: "", Id: "" } },

    { accountHead: { Name: "", AccountsId: "" }, controlAccName: { Name: "", id: "" }, project: { Name: "", Code: "", ProjectId: "" }, particulars: "", debit: "", credit: "", name: { Name: "", TableName: "", Id: "" } },

    { accountHead: { Name: "", AccountsId: "" }, controlAccName: { Name: "", id: "" }, project: { Name: "", Code: "", ProjectId: "" }, particulars: "", debit: "", credit: "", name: { Name: "", TableName: "", Id: "" } },

    { accountHead: { Name: "", AccountsId: "" }, controlAccName: { Name: "", id: "" }, project: { Name: "", Code: "", ProjectId: "" }, particulars: "", debit: "", credit: "", name: { Name: "", TableName: "", Id: "" } },

    { accountHead: { Name: "", AccountsId: "" }, controlAccName: { Name: "", id: "" }, project: { Name: "", Code: "", ProjectId: "" }, particulars: "", debit: "", credit: "", name: { Name: "", TableName: "", Id: "" } },

    { accountHead: { Name: "", AccountsId: "" }, controlAccName: { Name: "", id: "" }, project: { Name: "", Code: "", ProjectId: "" }, particulars: "", debit: "", credit: "", name: { Name: "", TableName: "", Id: "" } },
]

//----[loading 10 dummy empty rows on load]----//
const emptyRowsFeatureOn = [
    { accountHead: { Name: "", AccountsId: "" }, controlAccName: { Name: "", id: "" }, project: { Name: "", Code: "", ProjectId: "" }, particulars: "", debit: "", credit: "", name: [], nameClues: [] },

    { accountHead: { Name: "", AccountsId: "" }, controlAccName: { Name: "", id: "" }, project: { Name: "", Code: "", ProjectId: "" }, particulars: "", debit: "", credit: "", name: [], nameClues: [] },

    { accountHead: { Name: "", AccountsId: "" }, controlAccName: { Name: "", id: "" }, project: { Name: "", Code: "", ProjectId: "" }, particulars: "", debit: "", credit: "", name: [], nameClues: [] },

    { accountHead: { Name: "", AccountsId: "" }, controlAccName: { Name: "", id: "" }, project: { Name: "", Code: "", ProjectId: "" }, particulars: "", debit: "", credit: "", name: [], nameClues: [] },

    { accountHead: { Name: "", AccountsId: "" }, controlAccName: { Name: "", id: "" }, project: { Name: "", Code: "", ProjectId: "" }, particulars: "", debit: "", credit: "", name: [], nameClues: [] },

    { accountHead: { Name: "", AccountsId: "" }, controlAccName: { Name: "", id: "" }, project: { Name: "", Code: "", ProjectId: "" }, particulars: "", debit: "", credit: "", name: [], nameClues: [] },

    { accountHead: { Name: "", AccountsId: "" }, controlAccName: { Name: "", id: "" }, project: { Name: "", Code: "", ProjectId: "" }, particulars: "", debit: "", credit: "", name: [], nameClues: [] },

    { accountHead: { Name: "", AccountsId: "" }, controlAccName: { Name: "", id: "" }, project: { Name: "", Code: "", ProjectId: "" }, particulars: "", debit: "", credit: "", name: [], nameClues: [] },

    { accountHead: { Name: "", AccountsId: "" }, controlAccName: { Name: "", id: "" }, project: { Name: "", Code: "", ProjectId: "" }, particulars: "", debit: "", credit: "", name: [], nameClues: [] },

    { accountHead: { Name: "", AccountsId: "" }, controlAccName: { Name: "", id: "" }, project: { Name: "", Code: "", ProjectId: "" }, particulars: "", debit: "", credit: "", name: [], nameClues: [] },

    // { accountHead: { Name: "", AccountsId: "" }, controlAccName: { Name: "", id: "" }, project: { Name: "", Code: "", ProjectId: "" }, particulars: "", debit: "", credit: "", [{ Name: "", TableName: "", Id: "" }] },

    // { accountHead: { Name: "", AccountsId: "" }, controlAccName: { Name: "", id: "" }, project: { Name: "", Code: "", ProjectId: "" }, particulars: "", debit: "", credit: "", name: { Name: "", TableName: "", Id: "" } },
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
        //onClick={() => { btnNameModalFunct(cellRowIndex) }}
        <div className='cursor-pointer text-13 w-full flex-wrap'>
            <Tooltip title={stringForTooltip} arrow>
                <p className='text-13 w-full truncate'>
                    {stringForPTag}
                </p>
            </Tooltip>
        </div>

    )
}


const VoucherPreview = (props) => {

    const { voucherToEdit, setVoucherToEdit, contraVouchToEdit, setContraVouchToEdit, debitVouchToEdit, setDebitVouchToEdit, creditVouchToEdit, setCreditVouchToEdit, vouchAgtVouchToEdit, setVouchAgtVouchToEdit } = useStateContext();

    const [voucherNoToPreview, setVoucherNoToPreview] = useState({ VoucherNo: props.voucherToPreview.VoucherNo, VoucherId: props.voucherToPreview.VoucherId })

    // ---[show/hide panel,navbar]---
    const navigate = useNavigate();
    const { setShowPanel, setShowNavbar } = useStateContext();
    useEffect(() => {
        setShowPanel(props.panelShow);
        setShowNavbar(props.navbarShow);
        // setVoucherNoToPreview(props.voucherToPreview);
        console.log(voucherNoToPreview);
    }, [])

    console.log(voucherNoToPreview);

    var userInfo = { Name: '', LocationId: '' };
    var brFeatures = JSON.parse(localStorage.getItem("brFeature"));
    if (localStorage.getItem("userInfo")) {
        userInfo = JSON.parse(localStorage.getItem("userInfo"));
        console.log("Session User");
        console.log(userInfo);

    }
    if (!(localStorage.getItem("userInfo"))) {
        navigate('/');
    }


    //br feature acc analysis check
    // const [varAccAnalysisBF, setVarAccAnalysisBF] = useState(false);

    const [attachments, setAttachments] = useState([]);
    const { register, getValues, reset, control, setValue } = useForm();

    // ---[datepicker states]---
    const [voucherDateState, setVoucherDateState] = useState(new Date());

    const [voucherTableData, setVoucherTableData] = useState([]);
    const [exVoucherTableData, setExVoucherTableData] = useState([]);
    const [deletedVoucherDTRows, setDeletedVoucherDTRows] = useState([]);
    const [deletedRegedAttach, setDeletedRegedAttach] = useState([]);

    const [location, setLocation] = useState([]);
    const [accountsHead, setAccountsHead] = useState([]);
    const [project, setProject] = useState([]);

    const [allNames, setAllNames] = useState([]);
    const [total, setTotal] = useState({ debit: 0, credit: 0 });
    const [debitCreditWatch, setdebitCreditWatch] = useState(true);

    const [voucherIs, setVoucherIs] = useState(false);

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
    });
    ////-----------------auto comp list style-----------------
    const autoCompResStyles = (theme) => ({
        popper: {
            maxWidth: "fit-content",
            fontSize: "12px",
            readOnly: true
        }
    });

    const PopperMy = function (props) {
        return <Popper {...props} style={autoCompResStyles.popper} />;
    };



    const btnNameModal = (currentRowIndex) => {
        setNameModalInputs({
            rowIndex: "",
            inputs: []
        })

        let currentRow = voucherTableData[currentRowIndex];
        console.log("modal j row te click korsi oi row of voucherTableData");
        console.log(currentRow);

        console.log("rupom dekhte chaay nameClues..............");
        // console.log(currentRow.nameClues);

        if (currentRow?.nameClues) {
            axios.post(`${userInfo.Ip}/API/JournalVoucher/GetAutoCompOptions`, currentRow.nameClues)
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

        //     fetch(`${userInfo.Ip}/API/JournalVoucher/GetAutoCompOptions?queryTable=${currentRow.nameClues[i].QueryTable}&queryField=${currentRow.nameClues[i].QueryField}&queryFieldVal=${currentRow.nameClues[i].QueryFieldVal}`)
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

    const voucherTableColumnsFeatOn = [
        // {
        //     accessorKey: 'delete', //access nested data with dot notation
        //     header: '',
        //     size: 60, //small column
        //     enableSorting: false,
        //     enableColumnActions: false,
        //     enableResizing: false,
        //     enableColumnFilter: false,
        //     muiTableHeadCellProps: ({ column }) => ({
        //         align: 'left',
        //     }),
        //     Cell: ({ cell }) =>
        //     (<Tooltip className={(voucherTableData[cell.row.index].accountHead?.AccountsId) ? 'visible' : 'invisible'} arrow placement="right" title="Delete">
        //         <IconButton color="error" onClick={() => handleDeleteRow(cell.row.index)}>
        //             <Delete />
        //         </IconButton>
        //     </Tooltip>)
        // },
        {
            accessorKey: 'accountHead.Name',
            header: 'Account Head',
            // enableSorting: false,
            // enableColumnActions: false,
            Cell: ({ cell }) => (
                <Autocomplete
                    id=""
                    readOnly
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
                            sx={{ width: "100%", readOnly: true }}
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
                    readOnly
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
                            sx={{ width: "100%", readOnly: true }}
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
            // getSortingFn
            // enableSorting: false,
            // enableColumnActions: false,
            Cell: ({ cell, column, table }) => (
                <TextField sx={{ width: '100%', readOnly: true }} InputProps={{ style: { fontSize: 13 }, disableUnderline: true, readOnly: true }}
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
            accessorKey: 'debit', //access nested data with dot notation
            header: 'Debit',
            // enableSorting: true,
            // enableColumnActions: true,
            Cell: ({ cell, column, table }) => (
                <TextField sx={{ width: '100%', readOnly: true }} InputProps={{ style: { fontSize: 13 }, disableUnderline: true, readOnly: true }}
                    variant="standard" size="small"
                    inputRef={node => {
                        if (node) {
                            node.value = cell.getValue()
                        }
                    }}
                    onBlur={(e) => {
                        if (e.target.value > 0) {
                            if (voucherTableData[cell.row.index].accountHead.AccountsId) {

                                console.log('SEE DEC DEBIT>>>>');
                                console.log(e.target.value);


                                voucherTableData[cell.row.index].debit = parseFloat((e.target.value)).toFixed(2);

                                console.log(voucherTableData[cell.row.index].debit);
                                voucherTableData[cell.row.index].credit = 0;
                                setVoucherTableData([...voucherTableData]);
                                setdebitCreditWatch((prev) => !prev);
                            }
                            else {
                                toast.warning("Invalid input! Select an Account Head first!");
                                voucherTableData[cell.row.index].debit = 0;
                                setVoucherTableData([...voucherTableData]);
                                setdebitCreditWatch((prev) => !prev);
                            }
                        }
                        else {
                            voucherTableData[cell.row.index].debit = 0;
                            setVoucherTableData([...voucherTableData]);
                            setdebitCreditWatch((prev) => !prev);
                        }
                    }} />),
            Footer: () => (
                <p className='text-[13px]'>
                    Total Debit: <label className={(total.debit == total.credit) ? 'text-cyan-800 text-[13px]' : 'text-red-800 text-[13px]'} >{total.debit}</label>
                </p>
            ),
        },
        {
            accessorKey: 'credit', //access nested data with dot notation
            header: 'Credit',
            Cell: ({ cell, column, table }) => (
                <TextField sx={{ width: '100%', readOnly: true }} InputProps={{ style: { fontSize: 13 }, disableUnderline: true, readOnly: true }}
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
                                voucherTableData[cell.row.index].debit = 0;
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
                    Total Credit: <label className={(total.debit == total.credit) ? 'text-cyan-800 text-[13px]' : 'text-red-800 text-[13px]'}>{total.credit}</label>
                </p>
            ),
        },
        {
            accessorKey: 'name', //access nested data with dot notation
            header: 'Name',
            // enableSorting: false,
            // enableColumnActions: false,
            Cell: ({ cell, column, table }) => (
                // <Autocomplete
                //     id=""
                //     PopperComponent={PopperMy}
                //     clearOnEscape
                //     disableClearable
                //     freeSolo
                //     size="small"
                //     options={allNames}
                //     // value={(voucherTableData[cell.row.index].name) ? voucherTableData[cell.row.index].name : { Name: "", TableName: "", Id: "" }}
                //     value=""

                //     onChange={(e, selectedOption) => {
                //         console.log(selectedOption);
                //         voucherTableData[cell.row.index].name = { Name: selectedOption.Name, Id: selectedOption.Id, TableName: selectedOption.TableName };
                //         setVoucherTableData([...voucherTableData]);;
                //     }}
                //     getOptionLabel={(option) => (option.Name) ? option.Name : ""}
                //     renderOption={(props, option) => (
                //         <List {...props} key={option.Id}>
                //             <ListItem>
                //                 <ListItemText primary={option.Name}
                //                     secondary={option.TableName} />
                //             </ListItem>
                //         </List>

                //     )}
                //     renderInput={(params) =>
                //         <TextField
                //             sx={{ width: "100%" }}
                //             {...params}
                //             // inputRef={(node) => {
                //             //     if (node) {
                //             //         node.value = cell.getValue();
                //             //     }
                //             // }}
                //             InputProps={{ ...params.InputProps, style: { fontSize: 13 }, disableUnderline: true }}
                //             variant="standard"
                //             size="small"
                //         />
                //     }
                // />



                <div className={(voucherTableData[cell.row.index].accountHead?.AccountsId) ? 'visible flex justify-center' : 'invisible'}>
                    {voucherTableData[cell.row.index]?.name.length ? (
                        <NameComponent cellRowIndex={cell.row.index} nameArr={voucherTableData[cell.row.index]?.name} btnNameModalFunct={btnNameModal}></NameComponent>
                    ) :

                        (<div></div>)

                    }
                </div>



            )
        },

    ]
    const voucherTableColumnsNormal = [
        // {
        //     accessorKey: 'delete', //access nested data with dot notation
        //     header: '',
        //     size: 60, //small column
        //     enableSorting: false,
        //     enableColumnActions: false,
        //     enableResizing: false,
        //     enableColumnFilter: false,
        //     muiTableHeadCellProps: ({ column }) => ({
        //         align: 'left',
        //     }),
        //     Cell: ({ cell }) =>
        //     (<Tooltip className={(voucherTableData[cell.row.index].accountHead?.AccountsId) ? 'visible' : 'invisible'} arrow placement="right" title="Delete">
        //         <IconButton color="error" onClick={() => handleDeleteRow(cell.row.index)}>
        //             <Delete />
        //         </IconButton>
        //     </Tooltip>)
        // },
        {
            accessorKey: 'accountHead.Name',
            header: 'Account Head',
            // enableSorting: false,
            // enableColumnActions: false,
            Cell: ({ cell }) => (
                <Autocomplete
                    id=""
                    readOnly
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
                            sx={{ width: "100%", readOnly: true }}
                            {...params}
                            inputRef={(node) => {
                                if (node) {
                                    node.value = cell.getValue();
                                }
                            }}
                            // onBlur={() => { console.log('haha hihi hohohohoho') }}
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
                    sx={{ width: '100%', readOnly: true }}
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
                    readOnly
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
                            sx={{ width: "100%", readOnly: true }}
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
            // getSortingFn
            // enableSorting: false,
            // enableColumnActions: false,
            Cell: ({ cell, column, table }) => (
                <TextField sx={{ width: '100%', readOnly: true }} InputProps={{ style: { fontSize: 13 }, disableUnderline: true, readOnly: true }}
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
            accessorKey: 'debit', //access nested data with dot notation
            header: 'Debit',
            // enableSorting: true,
            // enableColumnActions: true,
            Cell: ({ cell, column, table }) => (
                <TextField sx={{ width: '100%', readOnly: true }} InputProps={{ style: { fontSize: 13 }, disableUnderline: true, readOnly: true }}
                    variant="standard" size="small"
                    inputRef={node => {
                        if (node) {
                            node.value = cell.getValue()
                        }
                    }}
                    onBlur={(e) => {
                        if (e.target.value > 0) {
                            if (voucherTableData[cell.row.index].accountHead.AccountsId) {
                                voucherTableData[cell.row.index].debit = parseFloat((e.target.value)).toFixed(2);
                                voucherTableData[cell.row.index].credit = 0;
                                setVoucherTableData([...voucherTableData]);
                                setdebitCreditWatch((prev) => !prev);
                            }
                            else {
                                toast.warning("Invalid input! Select an Account Head first!");
                                voucherTableData[cell.row.index].debit = 0;
                                setVoucherTableData([...voucherTableData]);
                                setdebitCreditWatch((prev) => !prev);
                            }
                        }
                        else {
                            voucherTableData[cell.row.index].debit = 0;
                            setVoucherTableData([...voucherTableData]);
                            setdebitCreditWatch((prev) => !prev);
                        }
                    }} />),
            Footer: () => (
                <p className='text-[13px]'>
                    Total Debit: <label className={(total.debit == total.credit) ? 'text-cyan-800 text-[13px]' : 'text-red-800 text-[13px]'} >{total.debit}</label>
                </p>
            ),
        },
        {
            accessorKey: 'credit', //access nested data with dot notation
            header: 'Credit',
            Cell: ({ cell, column, table }) => (
                <TextField sx={{ width: '100%', readOnly: true }} InputProps={{ style: { fontSize: 13 }, disableUnderline: true, readOnly: true }}
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
                                voucherTableData[cell.row.index].debit = 0;
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
                    Total Credit: <label className={(total.debit == total.credit) ? 'text-cyan-800 text-[13px]' : 'text-red-800 text-[13px]'}>{total.credit}</label>
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
                    readOnly
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
                            sx={{ width: "100%", readOnly: true }}
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
    useEffect(() => {
        // setVoucherTableData(emptyRows);


        // fetch(`${userInfo.Ip}/API/JournalVoucher/CheckBrFeatures?companyId=${userInfo.CompanyId}`)
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
        }
        else {
            setVoucherTableData(emptyRows);
        }

    }, [])
    useEffect(() => {
        console.log("rupom");
        console.log(total);

        console.log("state changed");
        console.log(voucherTableData);

        let totalDebit = 0;
        let totalCredit = 0;
        for (let i = 0; i < voucherTableData.length; i++) {
            if (voucherTableData[i].debit || voucherTableData[i].credit) {
                totalDebit = totalDebit + (isNaN(parseFloat(voucherTableData[i].debit)) ? 0 : parseFloat(voucherTableData[i].debit));
                totalCredit = totalCredit + (isNaN(parseFloat(voucherTableData[i].credit)) ? 0 : parseFloat(voucherTableData[i].credit));
            }
        }
        setTotal({ debit: totalDebit.toFixed(2), credit: totalCredit.toFixed(2) });
        console.log(total);
    }, [debitCreditWatch])


    // -----[FETCH Data for edit/assigning]-----
    useEffect(() => {
        console.log("line no 517...........HELLO RUPOM GORUUU");
        console.log(voucherNoToPreview);

        if (voucherNoToPreview?.VoucherId) {
            console.log("varAccAnalysisBF er value..........");
            console.log(brFeatures?.VariableAccountAnalysis);

            if (brFeatures?.VariableAccountAnalysis) {
                fetch(`${userInfo.Ip}/API/JournalVoucher/Get_VoucherAllInfoFeatOn?voucherNo=${voucherNoToPreview.VoucherNo}&voucherId=${voucherNoToPreview.VoucherId}`)
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
                fetch(`${userInfo.Ip}/API/JournalVoucher/Get_VoucherAllInfo?voucherNo=${voucherNoToPreview.VoucherNo}&voucherId=${voucherNoToPreview.VoucherId}`)
                    .then(res =>
                        res.json()
                        // console.log(res);
                    )
                    .then((data) => {
                        console.log("Fetched Raw data for voucher>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Edit, Line No. 517.....");
                        console.log(data);
                        assignDataForEdit(data.Voucher.Date, data.Voucher.LocationId, data.Location.Name, data.Voucher.VoucherId, data.Voucher.VoucherNo, data.Voucher.AttachmentId, data.Voucher.ReferenceNo, data.Voucher.Description, data.V_VoucherDetailRows, data.Attachment?.AttachmentData_List)
                        // setAllNames(data);
                    })

            }

        }
    }, [])

    // -----[FETCH Data for dropdowns,etc]-----
    useEffect(() => {
        // console.log("Getting all data");

        fetch(`${userInfo.Ip}/API/JournalVoucher/Get_Location?companyId=${userInfo.CompanyId}`)
            .then(res =>
                res.json()
                // console.log(res);
            )
            .then((data) => { console.log(data); setLocation(data) })

        fetch(`${userInfo.Ip}/API/JournalVoucher/Get_Project?companyId=${userInfo.CompanyId}`)
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



        let cashBankInJV = brFeatures?.CashBankInJournalVoucher ? brFeatures?.CashBankInJournalVoucher : false;

        fetch(`${userInfo.Ip}/API/JournalVoucher/Get_AccountHead?companyId=${userInfo.CompanyId}&locationId=${userInfo.LocationId}&cashBankFeature=${cashBankInJV}`)
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





        fetch(`${userInfo.Ip}/API/JournalVoucher/Get_AllBuyerEmpSupLoc?companyId=${userInfo.CompanyId}`)
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

        if (selectedOption) {
            let prevTableDataOld = _.cloneDeep(voucherTableData);
            const url = `${userInfo.Ip}/API/JournalVoucher/Get_ControlAccount?controlAccId=${selectedOption.ControlAccountId}`;
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
                    if (((index - 1) > -1) && total.debit > total.credit) {
                        prevTableDataOld[index].credit = (total.debit - total.credit).toFixed(2);
                        prevTableDataOld[index].debit = 0;
                    }
                    else if (((index - 1) > -1) && total.debit < total.credit) {
                        prevTableDataOld[index].debit = (total.credit - total.debit).toFixed(2);
                        prevTableDataOld[index].credit = 0;
                    }

                    // --[checking if the accound head is getting selected in the last row, if does, insert another empty row below(auto adding row)]--
                    if (voucherTableData.length - 1 == index) {
                        prevTableDataOld.push({ accountHead: { Name: "", AccountsId: "" }, controlAccName: { Name: "", id: "" }, project: { Name: "", Code: "", ProjectId: "" }, particulars: "", debit: "", credit: "", name: { Name: "", TableName: "", Id: "" } });
                    }

                    setVoucherTableData([...prevTableDataOld]);
                    setdebitCreditWatch((prev) => !prev);
                    console.log(voucherTableData);
                }
                )
        }

    };

    const handleAccountHeadSelectFeatOn = (index, selectedOption) => {

        let prevTableDataOld = _.cloneDeep(voucherTableData);
        const url = `${userInfo.Ip}/API/JournalVoucher/Get_ControlAccount?controlAccId=${selectedOption.ControlAccountId}`;
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
                if (((index - 1) > -1) && total.debit > total.credit) {
                    prevTableDataOld[index].credit = (total.debit - total.credit).toFixed(2);
                    prevTableDataOld[index].debit = 0;
                }
                else if (((index - 1) > -1) && total.debit < total.credit) {
                    prevTableDataOld[index].debit = (total.credit - total.debit).toFixed(2);
                    prevTableDataOld[index].credit = 0;
                }

                // debugger;
                fetch(`${userInfo.Ip}/API/JournalVoucher/GetRequiredInputInfos?accountId=${selectedOption.AccountsId}&companyId=${userInfo.CompanyId}&locationId=${userInfo.LocationId}`, {
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
                            prevTableDataOld.push({ accountHead: { Name: "", AccountsId: "" }, controlAccName: { Name: "", id: "" }, project: { Name: "", Code: "", ProjectId: "" }, particulars: "", debit: "", credit: "", name: [], nameClues: [] });
                        }

                        console.log("rupom wants to see prevTableOld--------------")

                        console.log(prevTableDataOld);
                        setVoucherTableData([...prevTableDataOld]);
                        setdebitCreditWatch((prev) => !prev);
                    })



            }
            )
    };


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

                let perRowDebit = isNaN(parseFloat(tableAllRows[i].debit)) ? 0 : parseFloat(tableAllRows[i].debit);
                let perRowCredit = isNaN(parseFloat(tableAllRows[i].credit)) ? 0 : parseFloat(tableAllRows[i].credit)
                let propertyName = `${tableAllRows[i].name.TableName}Id`
                let perRowForbackend = {};

                if (!(tableAllRows[i].accountHead.AccountsId)) {
                    mandatoryFieldFlag = false;
                    toast.error(`You must select a Account Head for row: ${i + 1}`);
                }
                if ((tableAllRows[i].accountHead.AccountsId) && !(tableAllRows[i].debit || tableAllRows[i].credit)) {
                    mandatoryFieldFlag = false;
                    toast.error(`You must entry a debit/credit for row: ${i + 1}`);
                }

                if (tableAllRows[i].name?.Id) {
                    perRowForbackend = {
                        AccountsId: tableAllRows[i].accountHead?.AccountsId,
                        ProjectId: tableAllRows[i].project?.ProjectId,
                        Particulars: tableAllRows[i].particulars,
                        Debit: perRowDebit,
                        Credit: perRowCredit,
                        [propertyName]: tableAllRows[i].name?.Id
                    }
                }
                else {
                    perRowForbackend = {
                        AccountsId: tableAllRows[i].accountHead.AccountsId,
                        ProjectId: tableAllRows[i].project.ProjectId,
                        Particulars: tableAllRows[i].particulars,
                        Debit: perRowDebit,
                        Credit: perRowCredit,
                    }
                }
                voucherDtTb.push(perRowForbackend);
            }

        }
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

        console.log(voucherFullData);
        console.log("line 692...........!!!!!!!!");
        console.log(voucherFullData.VoucherDetail);


        // console.log(attachments);
        if (voucherDtTb.length && (total.credit == total.debit) && debitCreditFlag && mandatoryFieldFlag) {

            axios.post(`${userInfo.Ip}/API/JournalVoucher/Post_JV_Voucher`, voucherFullData)
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

                        fetch(`${userInfo.Ip}/API/JournalVoucher/Get_VoucherAllInfo?voucherNo=${res.data.VoucherNo}&voucherId=${res.data.VoucherId}`)
                            .then(res =>
                                res.json()
                                // console.log(res);
                            )
                            .then((data) => {
                                console.log("Fetched AGAIN AFTER Save, Raw data for voucher Edit, Line No. 716.....");
                                setVoucherNoToPreview(0); //context api voucherEdit state reset
                                assignDataForEdit(data.Voucher.Date, data.Voucher.LocationId, data.Location.Name, data.Voucher.VoucherId, data.Voucher.VoucherNo, data.Voucher.AttachmentId, data.Voucher.ReferenceNo, data.Voucher.Description, data.V_VoucherDetailRows, data.Attachment?.AttachmentData_List);
                            })
                        // reset();
                    }

                })
        }
        else if (!(total.credit == total.debit)) {
            toast.error('Your Debits & Credits are not balanced !!');
        }
        else if (!voucherDtTb.length) {
            toast.error('No data do save!');
        }
        else {
            // toast.error('debit credit prob single row flag problem!');
        }

    }

    const saveVTdataFeatOn = () => {

        let tableAllRows = _.cloneDeep(voucherTableData);
        console.log('voucherTableData on save feature on');
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

                let perRowDebit = isNaN(parseFloat(tableAllRows[i].debit)) ? 0 : parseFloat(tableAllRows[i].debit);
                let perRowCredit = isNaN(parseFloat(tableAllRows[i].credit)) ? 0 : parseFloat(tableAllRows[i].credit)

                let perRowForbackend = {};
                let nameFields = {};
                for (let j = 0; j < tableAllRows[i].name.length; j++) {
                    nameFields[tableAllRows[i].name[j].PropertyName] = parseInt(tableAllRows[i].name[j].Id);
                }

                if (!(tableAllRows[i].accountHead.AccountsId)) {
                    mandatoryFieldFlag = false;
                    toast.error(`You must select a Account Head for row: ${i + 1}`);
                }
                if ((tableAllRows[i].accountHead.AccountsId) && !(tableAllRows[i].debit || tableAllRows[i].credit)) {
                    mandatoryFieldFlag = false;
                    toast.error(`You must entry a debit/credit for row: ${i + 1}`);
                }


                if (brFeatures.VariableAccountAnalysisMandatoryInput) {
                    let emptyNameFields = [];
                    for (let k = 0; k < tableAllRows[i].nameClues.length; k++) {
                        const exists = tableAllRows[i].name.some(obj => obj.InputName == tableAllRows[i].nameClues[k].InputName);
                        if (!exists) {
                            emptyNameFields.push(tableAllRows[i].nameClues[k].InputName);
                            mandatoryFieldFlag = false;
                        }
                    }
                    if (emptyNameFields.length) {
                        toast.error(`You have to select ${emptyNameFields.join(', ')} in 'Name' Column for row-${i}`);
                    }
                }





                perRowForbackend = {
                    AccountsId: tableAllRows[i].accountHead?.AccountsId,
                    ProjectId: tableAllRows[i].project?.ProjectId,
                    Particulars: tableAllRows[i].particulars,
                    Debit: perRowDebit,
                    Credit: perRowCredit,
                }
                console.log("Rupom New Save After sirs Torture namefield, perRowForBackend");

                console.log(nameFields);
                perRowForbackend = { ...perRowForbackend, ...nameFields };
                console.log(perRowForbackend);

                voucherDtTb.push(perRowForbackend);
            }

        }
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

        console.log("Rupom New Save After sirs Torture voucherFullData");

        console.log(voucherFullData);

        // console.log("line 692...........!!!!!!!!");
        // console.log(voucherFullData.VoucherDetail);


        // console.log(attachments);
        if (voucherDtTb.length && (total.credit == total.debit) && debitCreditFlag && mandatoryFieldFlag) {

            axios.post(`${userInfo.Ip}/API/JournalVoucher/Post_JV_Voucher`, voucherFullData)
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

                        fetch(`${userInfo.Ip}/API/JournalVoucher/Get_VoucherAllInfoFeatOn?voucherNo=${res.data.VoucherNo}&voucherId=${res.data.VoucherId}`)
                            .then(res =>
                                res.json()
                                // console.log(res);
                            )
                            .then((data) => {
                                console.log("Feature ON!!! Fetched AGAIN AFTER Save, Raw data for voucher Edit,,,,, FEATURE ON!!!!");
                                setVoucherNoToPreview(0); //context api voucherEdit state reset
                                console.log(data);
                                assignDataForEditFeatOn(data.Voucher.Date, data.Voucher.LocationId, data.Location.Name, data.Voucher.VoucherId, data.Voucher.VoucherNo, data.Voucher.AttachmentId, data.Voucher.ReferenceNo, data.Voucher.Description, data.V_VoucherDetailRows, data.Attachment?.AttachmentData_List);
                            })
                        // reset();
                    }

                })
        }
        else if (!(total.credit == total.debit)) {
            toast.error('Your Debits & Credits are not balanced !!');
        }
        else if (!voucherDtTb.length) {
            toast.error('No data do save!');
        }
        else {
            // toast.error('debit credit prob single row flag problem!');
        }

    }


    const clearData = () => {
        console.log(attachments);
        setVoucherIs(false);
        console.log(voucherTableData);

        ((brFeatures?.VariableAccountAnalysis) ?
            setVoucherTableData(emptyRowsFeatureOn) : setVoucherTableData(emptyRows)
        )
        setExVoucherTableData([]);
        setVoucherDateState(new Date());
        setLocationOutput({ Name: userInfo.LocationName, LocationId: userInfo.LocationId });
        setTotal({ debit: 0, credit: 0 });
        reset();
        setAttachments([]);
        setDeletedRegedAttach([]);
        setDeletedVoucherDTRows([]);

    }

    const assignDataForEdit = (voucherDate, voucherLocationId, voucherLocationName, voucherId, voucherNo, voucherAttachmentId, reference, description, jvDbTable, attachmentTable) => {

        console.log("assignDataForEdit Function.....");


        setVoucherDateState(dayjs(voucherDate));
        setLocationOutput({ Name: voucherLocationName, LocationId: voucherLocationId });
        setValue("voucherNo", voucherNo);
        setVoucherIs(true);
        setValue("reference", reference);
        setValue("description", description);
        // setVoucherTableData(jvDbTable);
        console.log("line 766......");
        console.log(jvDbTable);

        let voucherTableArr = _.cloneDeep(emptyRows);
        let voucherTableArrNoEmpty = [];
        voucherTableArr.splice(0, jvDbTable.length);

        let tempArray = [];
        for (let i = 0; i < jvDbTable.length; i++) {
            let objRow = {
                voucherDetailId: jvDbTable[i].VoucherDetailId,
                accountHead: {
                    Name: jvDbTable[i].AccountsName,
                    AccountsId: jvDbTable[i].AccountsId,
                    ControlAccountId: jvDbTable[i].ControlAccountId
                },
                controlAccName: {
                    Name: jvDbTable[i].ControlAccountName,
                    id: jvDbTable[i].ControlAccountId
                },
                project: {
                    Name: jvDbTable[i].ProjectName,
                    Code: jvDbTable[i].ProjectCode,
                    ProjectId: jvDbTable[i].ProjectId
                },
                particulars: jvDbTable[i].Particulars,
                debit: jvDbTable[i].Debit,
                credit: jvDbTable[i].Credit,
                name: {
                    Name: "",
                    Id: "",
                    TableName: ""
                }
            }

            let perRowFormatted = {
                VoucherDetailId: jvDbTable[i].VoucherDetailId,
                AccountsId: jvDbTable[i].AccountsId,
                ProjectId: jvDbTable[i].ProjectId,
                Particulars: jvDbTable[i].Particulars,
                Debit: jvDbTable[i].Debit,
                Credit: jvDbTable[i].Credit,
            }

            if (jvDbTable[i].EmployeeId) {
                objRow.name = { Name: jvDbTable[i].EmployeeName, Id: jvDbTable[i].EmployeeId, TableName: "Employee" };
                perRowFormatted.EmployeeId = jvDbTable[i].EmployeeId;
            }
            else if (jvDbTable[i].SupplierId) {
                objRow.name = { Name: jvDbTable[i].SupplierName, Id: jvDbTable[i].SupplierId, TableName: "Supplier" };
                perRowFormatted.SupplierId = jvDbTable[i].SupplierId;
            }
            else if (jvDbTable[i].LocationId) {
                objRow.name = { Name: jvDbTable[i].LocationName, Id: jvDbTable[i].LocationId, TableName: "Location" };
                perRowFormatted.LocationId = jvDbTable[i].LocationId;
            }
            else if (jvDbTable[i].BuyerId) {
                objRow.name = { Name: jvDbTable[i].BuyerName, Id: jvDbTable[i].BuyerId, TableName: "Buyer" };
                perRowFormatted.BuyerId = jvDbTable[i].BuyerId;
            }
            console.log(objRow);
            tempArray.push(objRow);

            voucherTableArrNoEmpty.push(perRowFormatted);
        }
        voucherTableArr = [...tempArray, ...voucherTableArr];
        // console.log("line 827.......");
        // console.log(voucherTableArr);

        setVoucherTableData(voucherTableArr);
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
        setExVoucherTableData({ Voucher: voucherTb, VoucherDetail: voucherTableArrNoEmpty })
        setdebitCreditWatch((prev) => !prev);
    }

    const assignDataForEditFeatOn = (voucherDate, voucherLocationId, voucherLocationName, voucherId, voucherNo, voucherAttachmentId, reference, description, jvDbTable, attachmentTable) => {

        console.log("assignDataForEdit Function.....");


        setVoucherDateState(dayjs(voucherDate));
        setLocationOutput({ Name: voucherLocationName, LocationId: voucherLocationId });
        setValue("voucherNo", voucherNo);
        setVoucherIs(true);
        setValue("reference", reference);
        setValue("description", description);
        // setVoucherTableData(jvDbTable);
        console.log("line 766......");
        console.log(jvDbTable);

        let voucherTableArr = _.cloneDeep(emptyRowsFeatureOn);
        let voucherTableArrNoEmpty = [];
        voucherTableArr.splice(0, jvDbTable.length);

        let tempArray = [];
        for (let i = 0; i < jvDbTable.length; i++) {
            let objRow = {
                voucherDetailId: jvDbTable[i].VoucherDetailId,
                accountHead: {
                    Name: jvDbTable[i].AccountsName,
                    AccountsId: jvDbTable[i].AccountsId,
                    ControlAccountId: jvDbTable[i].ControlAccountId
                },
                controlAccName: {
                    Name: jvDbTable[i].ControlAccountName,
                    id: jvDbTable[i].ControlAccountId
                },
                project: {
                    Name: jvDbTable[i].ProjectName,
                    Code: jvDbTable[i].ProjectCode,
                    ProjectId: jvDbTable[i].ProjectId
                },
                particulars: jvDbTable[i].Particulars,
                debit: jvDbTable[i].Debit,
                credit: jvDbTable[i].Credit,
                name: [],
                nameClues: jvDbTable[i].NameClues

            }
            let tempNameArr = [];
            let perRowFormatted = {
                VoucherDetailId: jvDbTable[i].VoucherDetailId,
                AccountsId: jvDbTable[i].AccountsId,
                ProjectId: jvDbTable[i].ProjectId,
                Particulars: jvDbTable[i].Particulars,
                Debit: jvDbTable[i].Debit,
                Credit: jvDbTable[i].Credit,
            }

            if (jvDbTable[i].EmployeeId) {
                // objRow.name = { Name: jvDbTable[i].EmployeeName, Id: jvDbTable[i].EmployeeId, TableName: "Employee" };
                // perRowFormatted.EmployeeId = jvDbTable[i].EmployeeId;
                let tempObj = { Name: jvDbTable[i].EmployeeName, InputName: "Employee", PropertyName: "EmployeeId", Id: jvDbTable[i].EmployeeId }
                tempNameArr.push(tempObj);
                perRowFormatted.EmployeeId = jvDbTable[i].EmployeeId;
            }
            if (jvDbTable[i].SupplierId) {
                let tempObj = { Name: jvDbTable[i].SupplierName, InputName: "Supplier", PropertyName: "SupplierId", Id: jvDbTable[i].SupplierId }
                tempNameArr.push(tempObj);
                perRowFormatted.SupplierId = jvDbTable[i].SupplierId;
            }
            if (jvDbTable[i].LocationId) {
                let tempObj = { Name: jvDbTable[i].LocationName, InputName: "Location", PropertyName: "LocationId", Id: jvDbTable[i].LocationId }
                tempNameArr.push(tempObj);
                perRowFormatted.LocationId = jvDbTable[i].LocationId;
            }
            if (jvDbTable[i].BuyerId) {
                let tempObj = { Name: jvDbTable[i].BuyerName, InputName: "Buyer", PropertyName: "BuyerId", Id: jvDbTable[i].BuyerId }
                tempNameArr.push(tempObj);
                perRowFormatted.BuyerId = jvDbTable[i].BuyerId;
            }
            if (jvDbTable[i].AccountsAnalysis1Id) {
                let tempObj = { Name: jvDbTable[i].AccountsAnalysis1Name, InputName: jvDbTable[i].AccountsAnalysis1InputName, PropertyName: "AccountsAnalysis1", Id: jvDbTable[i].AccountsAnalysis1Id }
                tempNameArr.push(tempObj);
                perRowFormatted.AccountsAnalysis1 = jvDbTable[i].AccountsAnalysis1Id;
            }
            if (jvDbTable[i].AccountsAnalysis2Id) {
                let tempObj = { Name: jvDbTable[i].AccountsAnalysis2Name, InputName: jvDbTable[i].AccountsAnalysis2InputName, PropertyName: "AccountsAnalysis2", Id: jvDbTable[i].AccountsAnalysis2Id }
                tempNameArr.push(tempObj);
                perRowFormatted.AccountsAnalysis2 = jvDbTable[i].AccountsAnalysis2Id;
            }

            objRow.name = tempNameArr;
            console.log(objRow);
            tempArray.push(objRow);

            voucherTableArrNoEmpty.push(perRowFormatted);
        }
        voucherTableArr = [...tempArray, ...voucherTableArr];
        // console.log("line 827.......");
        // console.log(voucherTableArr);

        setVoucherTableData(voucherTableArr);
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
        setExVoucherTableData({ Voucher: voucherTb, VoucherDetail: voucherTableArrNoEmpty })
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

                let perRowDebit = isNaN(parseFloat(tableAllRows[i].debit)) ? 0 : parseFloat(tableAllRows[i].debit);
                let perRowCredit = isNaN(parseFloat(tableAllRows[i].credit)) ? 0 : parseFloat(tableAllRows[i].credit)
                let propertyName = `${tableAllRows[i].name.TableName}Id`
                let perRowForbackend = {};

                if (!(tableAllRows[i].accountHead.AccountsId)) {
                    mandatoryFieldFlag = false;
                    toast.error(`You must select a Account Head for row: ${i + 1}`);
                }
                if ((tableAllRows[i].accountHead.AccountsId) && !(tableAllRows[i].debit || tableAllRows[i].credit)) {
                    mandatoryFieldFlag = false;
                    toast.error(`You must entry a debit/credit for row: ${i + 1}`);
                }

                perRowForbackend = {
                    // VoucherDetailId: (tableAllRows[i].voucherDetailId) ? tableAllRows[i].voucherDetailId : "",
                    AccountsId: tableAllRows[i].accountHead.AccountsId,
                    ProjectId: tableAllRows[i].project.ProjectId,
                    Particulars: tableAllRows[i].particulars,
                    Debit: perRowDebit,
                    Credit: perRowCredit,
                }
                if (tableAllRows[i].voucherDetailId) {
                    // {'a':1 , ...obj}
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

        if (voucherDtTb.length && (total.credit == total.debit) && debitCreditFlag && mandatoryFieldFlag && flagSomethingToUpdate) {

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
                    axios.post(`${userInfo.Ip}/API/JournalVoucher/Update_JV_Voucher`, voucherFullData)
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

                                fetch(`${userInfo.Ip}/API/JournalVoucher/Get_VoucherAllInfo?voucherNo=${res.data.Voucher.VoucherNo}&voucherId=${res.data.Voucher.VoucherId}`)
                                    .then(res =>
                                        res.json()
                                        // console.log(res);
                                    )
                                    .then((data) => {
                                        console.log("Fetched AGAIN AFTER UPDATE Raw data for voucher Edit, Line No. 517.....");
                                        setVoucherNoToPreview(0);
                                        assignDataForEdit(data.Voucher.Date, data.Voucher.LocationId, data.Location.Name, data.Voucher.VoucherId, data.Voucher.VoucherNo, data.Voucher.AttachmentId, data.Voucher.ReferenceNo, data.Voucher.Description, data.V_VoucherDetailRows, data.Attachment?.AttachmentData_List);
                                    })

                            }

                        })

                }
            })


        }
        else if (!(total.credit == total.debit)) {
            toast.error('Your Debits & Credits are not balanced !!');
        }
        else if (!voucherDtTb.length) {
            toast.error('No data do save!');
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

                let perRowDebit = isNaN(parseFloat(tableAllRows[i].debit)) ? 0 : parseFloat(tableAllRows[i].debit);
                let perRowCredit = isNaN(parseFloat(tableAllRows[i].credit)) ? 0 : parseFloat(tableAllRows[i].credit);
                // let propertyName = `${tableAllRows[i].name.TableName}Id`
                let perRowForbackend = {};

                if (!(tableAllRows[i].accountHead.AccountsId)) {
                    mandatoryFieldFlag = false;
                    toast.error(`You must select a Account Head for row: ${i + 1}`);
                }
                if ((tableAllRows[i].accountHead.AccountsId) && !(tableAllRows[i].debit || tableAllRows[i].credit)) {
                    mandatoryFieldFlag = false;
                    toast.error(`You must entry a debit/credit for row: ${i + 1}`);
                }

                perRowForbackend = {
                    // VoucherDetailId: (tableAllRows[i].voucherDetailId) ? tableAllRows[i].voucherDetailId : "",
                    AccountsId: tableAllRows[i].accountHead.AccountsId,
                    ProjectId: tableAllRows[i].project.ProjectId,
                    Particulars: tableAllRows[i].particulars,
                    Debit: perRowDebit,
                    Credit: perRowCredit,
                }
                if (tableAllRows[i].voucherDetailId) {
                    // {'a':1 , ...obj}
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

        if (voucherDtTb.length && (total.credit == total.debit) && debitCreditFlag && mandatoryFieldFlag && flagSomethingToUpdate) {

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
                    axios.post(`${userInfo.Ip}/API/JournalVoucher/Update_JV_Voucher`, voucherFullData)
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

                                fetch(`${userInfo.Ip}/API/JournalVoucher/Get_VoucherAllInfoFeatOn?voucherNo=${res.data.Voucher.VoucherNo}&voucherId=${res.data.Voucher.VoucherId}`)
                                    .then(res =>
                                        res.json()
                                        // console.log(res);
                                    )
                                    .then((data) => {
                                        console.log("Fetched AGAIN AFTER UPDATE Raw data for voucher Edit, Line No. 517.....");
                                        setVoucherNoToPreview(0);
                                        assignDataForEditFeatOn(data.Voucher.Date, data.Voucher.LocationId, data.Location.Name, data.Voucher.VoucherId, data.Voucher.VoucherNo, data.Voucher.AttachmentId, data.Voucher.ReferenceNo, data.Voucher.Description, data.V_VoucherDetailRows, data.Attachment?.AttachmentData_List);
                                    })

                            }

                        })

                }
            })


        }
        else if (!(total.credit == total.debit)) {
            toast.error('Your Debits & Credits are not balanced !!');
        }
        else if (!voucherDtTb.length) {
            toast.error('No data do save!');
        }
        else if (!flagSomethingToUpdate) {
            toast.error("Nothing to update, You didn't change anything!");
        }
    }

    const editVouchBtn = () => {
        setVoucherNoToPreview({});
        navigate('/voucherEdit');
    }
    //-----[codes to execute while the page gets unmounted]-------
    useEffect(() => {
        return () => {
            // Anything in here is fired on component unmount.
            setVoucherNoToPreview(0);
            setContraVouchToEdit(0);
            setDebitVouchToEdit(0);
            setCreditVouchToEdit(0);
            setVouchAgtVouchToEdit(0);
        }
    }, [])




    const rupom = () => {
        //modal click
        // setNameModalOpen(true);
        // setVoucherTableData(emptyRows);

        console.log(voucherTableData);
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
                            Voucher Preview
                        </div>
                        {/* Main Card header--/-- */}

                        {/* Main Card body */}
                        <div className=" px-6 text-start md:min-h-[60vh] grid grid-cols-4 gap-4 mt-2">

                            <fieldset className="md:col-span-4 col-span-4 border border-solid border-gray-300 px-3 pt-1 pb-3 dark:text-slate-50">
                                <legend className="text-sm">Voucher Info</legend>



                                <form className='' >
                                    <div className='w-full grid-cols-2 grid gap-x-4 gap-y-1'>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DateTimePicker
                                                label="Voucher Date"
                                                // inputFormat="DD/MM/YYYY HH:MM" blockletter HH means hours in 24h format, small letter hh means 12h format. dd/mm/yyyy value varies if DD/MM/YYY check urself. for am/pm= a, AM/PM= A
                                                //visit https://day.js.org/docs/en/parse/string-format for datetime formats
                                                inputFormat="DD/MM/YYYY hh:mm A"
                                                readOnly={voucherIs ? true : false}
                                                renderInput={(params) =>
                                                    <TextField
                                                        sx={{ width: '100%', marginTop: 1, readOnly: true }}
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
                                            readOnly
                                            clearOnEscape
                                            size="small"

                                            options={location}
                                            // defaultValue={(locationOutput) ? locationOutput : { Name: "", LocationId: "" }}
                                            value={locationOutput}
                                            // readOnly={voucherIs ? true : false}
                                            // defaultValue={locationOutput?.Name ? locationOutput?.Name : ''}
                                            getOptionLabel={(option) => (option.Name) ? option.Name : ""}

                                            onChange={(e, selectedOption) => {
                                                console.log(selectedOption);
                                                setLocationOutput(selectedOption);
                                            }}
                                            renderInput={(params) => (
                                                <TextField
                                                    sx={{ width: '100%', marginTop: 1, readOnly: true }}
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
                                                    sx={{ width: '100%', readOnly: true }} InputProps={{ style: { fontSize: 13 }, readOnly: true }}
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
                                                    sx={{ width: '100%', readOnly: true }} InputProps={{ style: { fontSize: 13 }, readOnly: true }}
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
                                                readOnly
                                                render={({ field }) => (
                                                    <TextField
                                                        {...field}
                                                        sx={{ width: '100%', readOnly: true }} InputProps={{ style: { fontSize: 13 }, readOnly: true }}
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

                                        {/* <TextField className='col-span-2' sx={{ width: '100%' }} {...register("description")} InputProps={{ style: { fontSize: 13 } }}
                                            InputLabelProps={{
                                                style: { fontSize: 14 },

                                            }} id="description" label="Description" variant="standard" size="small" multiline
                                            maxRows={4}
                                        /> */}

                                        <div className='ml-3 mb-3 mt-1'>
                                            {/* <AttachmentLoader attachments={attachments} setAttachments={setAttachments} deletedRegedAttach={deletedRegedAttach} setDeletedRegedAttach={setDeletedRegedAttach} imgPerSlide={4}></AttachmentLoader> */}
                                        </div>

                                        {/* <div className='col-start-1 col-span-2 flex justify-end gap-x-3 mt-1'>
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
                                        </div> */}
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

                                                muiTableContainerProps={{ sx: { maxHeight: '340px' } }} //ekhane table er data height
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
                                                columns={voucherTableColumnsNormal}
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

                                                muiTableContainerProps={{ sx: { maxHeight: '480px' } }} //ekhane table er data height
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
                        {/* <div className="py-3 px-6 border-t text-start border-gray-300 text-gray-600">
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

                              
                            </div>

                        </div> */}
                        {/* Main Card footer--/-- */}
                    </div>
                    {/* Main Card--/-- */}

                </div>
            </div>



            {/* --------------Modals--------------- */}
            <Modal
                open={nameModalOpen}
                onClose={() => {

                    if (brFeatures.VariableAccountAnalysisMandatoryInput) {
                        let currentIndex = nameModalInputs.rowIndex;
                        let currentVouchTbDataRow = voucherTableData[currentIndex];
                        console.log('modal theke bolsi');
                        let flag = true;
                        let emptyInputFields = [];
                        console.log(nameModalInputs.inputs);
                        for (let i = 0; i < nameModalInputs.inputs.length; i++) {
                            const exists = currentVouchTbDataRow.name.some(obj => obj.InputName === nameModalInputs.inputs[i].InputName);
                            if (!exists) {
                                flag = false;
                                emptyInputFields.push(nameModalInputs.inputs[i].InputName);
                            }
                        }
                        if (!flag) {

                            setNameModalOpen(false);
                            Swal.fire({
                                title: `Are you sure you want to progress with empty fields?`,
                                text: `You have to select a ${emptyInputFields.join(', ')} to save the voucher, you cannot save the voucher without selecting these autocompletes`,
                                showDenyButton: true,
                                icon: 'question',
                                showCancelButton: false,
                                confirmButtonText: 'Yes, I am!',
                                denyButtonText: `No, I'm Not!`,
                            }).then((result) => {
                                /* Read more about isConfirmed, isDenied below */
                                if (result.isConfirmed) {
                                    setNameModalOpen(false);

                                }
                                else {
                                    setNameModalOpen(true);

                                }

                            })

                            // toast.error(`You have to select ${emptyInputFields.join(', ')} before closing the modal`);

                            // setNameModalOpen(true);
                        }
                        else {
                            setNameModalOpen(false);
                        }
                    }
                    else {
                        setNameModalOpen(false);

                    }

                }}
                aria-labelledby="parent-modal-title"
                aria-describedby="parent-modal-description"
            >
                <Box sx={{ ...nameModalStyle }}>
                    <fieldset className="border border-solid border-gray-300 px-3 pt-1 pb-3 dark:text-slate-50">
                        <legend className="text-sm">Fill up these fields</legend>

                        {nameModalInputs.inputs.length ? ("") : (<p>Sorry, This account head do not have any permission to enter a name</p>)}

                        {nameModalInputs.inputs.map(perInp => {

                            let currentIndex = nameModalInputs.rowIndex;
                            let currentVouchTbDataRow = voucherTableData[currentIndex];

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
                                        readOnly
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
                                            setVoucherTableData([...voucherTableData]);

                                            console.log(selectedOption);
                                        }
                                        }
                                        renderInput={(params) => (
                                            <TextField
                                                sx={{ width: '100%', readOnly: true, marginTop: 1 }}
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

export default VoucherPreview