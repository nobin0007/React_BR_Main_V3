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
    Typography,
    Button,
    Checkbox,
    Input,
    InputLabel,
    InputAdornment,
    FormControl,
    Modal,
    FormControlLabel,
    Grid,
    Radio,
    RadioGroup,
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
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';


import { useForm, Controller } from "react-hook-form";
import './VoucherAgainstVoucher.css';

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
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';


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

const VoucherAgainstVoucher = (props) => {

    const { voucherToEdit, setVoucherToEdit, jvToEdit, setJvToEdit, contraVouchToEdit, setContraVouchToEdit, debitVouchToEdit, setDebitVouchToEdit, creditVouchToEdit, setCreditVouchToEdit, vouchAgtVouchToEdit, setVouchAgtVouchToEdit } = useStateContext();

    // ---[show/hide panel,navbar]---
    const navigate = useNavigate();
    const { setShowPanel, setShowNavbar } = useStateContext();
    useEffect(() => {
        setShowPanel(props.panelShow);
        setShowNavbar(props.navbarShow);
    }, [])

    console.log(vouchAgtVouchToEdit);

    var userInfo = { Name: '', LocationId: '' };
    if (localStorage.getItem("userInfo")) {
        userInfo = JSON.parse(localStorage.getItem("userInfo"));
        console.log("Session User");
        console.log(userInfo);
    }
    if (!(localStorage.getItem("userInfo"))) {
        navigate('/');
    }
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




    const [dateFrom, setDateFrom] = useState(dayjs());
    const [dateTo, setDateTo] = useState(dayjs());
    const [prevVouchNo, setPrevVouchNo] = useState({ VoucherNo: '', VoucherId: '' });

    const [prevVouchNoOpts, setPrevVouchNoOpts] = useState([]);
    const prevVouchElement = useRef();

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
            sortUndefined: -1,
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
            accessorKey: 'debit', //access nested data with dot notation
            header: 'Debit',
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
                                voucherTableData[cell.row.index].debit = e.target.value;
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
                                voucherTableData[cell.row.index].credit = e.target.value;
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

    useEffect(() => {
        //full table/grid is empty, not even empty rows
        setVoucherTableData([]);


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
                totalDebit = totalDebit + (isNaN(parseInt(voucherTableData[i].debit)) ? 0 : parseInt(voucherTableData[i].debit));
                totalCredit = totalCredit + (isNaN(parseInt(voucherTableData[i].credit)) ? 0 : parseInt(voucherTableData[i].credit));
            }
        }
        setTotal({ debit: totalDebit, credit: totalCredit });
        console.log(total);
    }, [debitCreditWatch])


    // -----[FETCH Data for edit/assigning]-----
    useEffect(() => {
        console.log("line no 517");
        console.log(vouchAgtVouchToEdit);

        if (vouchAgtVouchToEdit) {
            console.log("Context thakle ei IF e dhuke, line 510.....");
            fetch(`${userInfo.Ip}/API/VouchAgtVouch/Get_VoucherAllInfo?voucherNo=${vouchAgtVouchToEdit.VoucherNo}&voucherId=${vouchAgtVouchToEdit.VoucherId}`)
                .then(res =>
                    res.json()
                    // console.log(res);
                )
                .then((data) => {
                    console.log("Fetched Raw data for voucher Edit, Line No. 517.....");
                    console.log(data);
                    assignDataForEdit(data.Voucher.Date, data.Voucher.LocationId, data.Location.Name, data.Voucher.VoucherId, data.Voucher.VoucherNo, data.Voucher.AttachmentId, data.Voucher.ReferenceNo, data.Voucher.Description, data.V_VoucherDetailRows, data.Attachment?.AttachmentData_List)
                    // setAllNames(data);

                    //fetching previous voucher no.
                    fetch(`${userInfo.Ip}/API/VouchAgtVouch/Get_PrevVoucherNoById?voucherId=${data.Voucher.EarlierVoucherId}`)
                        .then(res =>
                            res.json()
                            // console.log(res);
                        )
                        .then((res) => {
                            console.log("HOLA HOLA HOLA HOLA..................");
                            console.log(data);
                            setPrevVouchNo({ VoucherId: res.VoucherId, VoucherNo: res.VoucherNo })

                        })
                })

        }
        else {
            //opening prev voucher selection modal
            setPrevVouchSelectModalOpen(true);
        }
    }, [])

    // -----[FETCH Data for dropdowns,etc]-----
    useEffect(() => {
        // console.log("Getting all data");

        fetch(`${userInfo.Ip}/API/VouchAgtVouch/Get_Location?companyId=${userInfo.CompanyId}`)
            .then(res =>
                res.json()
                // console.log(res);
            )
            .then((data) => { console.log(data); setLocation(data) })

        fetch(`${userInfo.Ip}/API/VouchAgtVouch/Get_Project?companyId=${userInfo.CompanyId}`)
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

        fetch(`${userInfo.Ip}/API/VouchAgtVouch/Get_AccHeadByCashBank?companyId=${userInfo.CompanyId}&locationId=${userInfo.LocationId}`)
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

        fetch(`${userInfo.Ip}/API/VouchAgtVouch/Get_AllBuyerEmpSupLoc?companyId=${userInfo.CompanyId}`)
            .then(res =>
                res.json()
                // console.log(res);
            )
            .then((data) => {
                console.log(data);
                setAllNames(data);
            })


        let dto = dayjs(dayjs()).format('YYYY/MM/DD') + " 23:59";
        let dfrom = dayjs(dayjs()).format('YYYY/MM/DD') + " 00:00";
        fetch(`${userInfo.Ip}/API/VouchAgtVouch/Get_PrevVouchNo?dateTo=${dto}&dateFrom=${dfrom}&locationId=${userInfo.LocationId}&companyId=${userInfo.CompanyId}`)
            .then(res =>
                res.json()
            )
            .then((data) => {

                setPrevVouchNoOpts(data);
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
        const url = `${userInfo.Ip}/API/VouchAgtVouch/Get_ControlAccount?controlAccId=${selectedOption.ControlAccountId}`;
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
                    prevTableDataOld[index].credit = total.debit - total.credit;
                    prevTableDataOld[index].debit = 0;
                }
                else if (((index - 1) > -1) && total.debit < total.credit) {
                    prevTableDataOld[index].debit = total.credit - total.debit;
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
            EarlierVoucherId: (prevVouchNo?.VoucherId) ? prevVouchNo?.VoucherId : ""
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

                let perRowDebit = isNaN(parseInt(tableAllRows[i].debit)) ? 0 : parseInt(tableAllRows[i].debit);
                let perRowCredit = isNaN(parseInt(tableAllRows[i].credit)) ? 0 : parseInt(tableAllRows[i].credit)
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
        if (voucherDtTb.length && (total.credit == total.debit) && debitCreditFlag && mandatoryFieldFlag && prevVouchNo?.VoucherId) {

            axios.post(`${userInfo.Ip}/API/VouchAgtVouch/Post_VAV_Voucher`, voucherFullData)
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

                        fetch(`${userInfo.Ip}/API/VouchAgtVouch/Get_VoucherAllInfo?voucherNo=${res.data.VoucherNo}&voucherId=${res.data.VoucherId}`)
                            .then(res =>
                                res.json()
                                // console.log(res);
                            )
                            .then((data) => {
                                console.log("Fetched AGAIN AFTER Save, Raw data for voucher Edit, Line No. 716.....");
                                setVouchAgtVouchToEdit(0); //context api voucherEdit state reset
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
        else if (!(prevVouchNo?.VoucherId)) {
            toast.error('You must select a previous voucher no. before entering data!');
        }

    }


    const clearData = () => {
        console.log(attachments);
        setVoucherIs(false);
        console.log(voucherTableData);
        setVoucherTableData([]);
        setExVoucherTableData([]);
        setVoucherDateState(dayjs());
        setDateTo(dayjs());
        setDateFrom(dayjs());
        setLocationOutput({ Name: userInfo.LocationName, LocationId: userInfo.LocationId });
        setTotal({ debit: 0, credit: 0 });
        reset();
        setAttachments([]);
        setDeletedRegedAttach([]);
        setDeletedVoucherDTRows([]);
        setPrevVouchNo({ VoucherNo: '', VoucherId: '' });
        //reseting the prev voucher no options---------------------------------
        let dto = dayjs(dayjs()).format('YYYY/MM/DD') + " 23:59";
        let dfrom = dayjs(dayjs()).format('YYYY/MM/DD') + " 00:00";
        fetch(`${userInfo.Ip}/API/VouchAgtVouch/Get_PrevVouchNo?dateTo=${dto}&dateFrom=${dfrom}&locationId=${userInfo.LocationId}&companyId=${userInfo.CompanyId}`)
            .then(res =>
                res.json()
            )
            .then((data) => {
                // setPrevVouchNoOpts([]);
                setPrevVouchNoOpts(data);
            })

    }

    const assignDataForEdit = (voucherDate, voucherLocationId, voucherLocationName, voucherId, voucherNo, voucherAttachmentId, reference, description, vouchDtTable, attachmentTable) => {

        console.log("assignDataForEdit Function.....");


        setVoucherDateState(dayjs(voucherDate));
        setLocationOutput({ Name: voucherLocationName, LocationId: voucherLocationId });
        setValue("voucherNo", voucherNo);
        setVoucherIs(true);
        setValue("reference", reference);
        setValue("description", description);
        // setVoucherTableData(vouchDtTable);
        console.log("line 766......");
        console.log(vouchDtTable);

        let voucherTableArr = _.cloneDeep(emptyRows);
        let voucherTableArrNoEmpty = [];
        voucherTableArr.splice(0, vouchDtTable.length);

        let tempArray = [];
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

                let perRowDebit = isNaN(parseInt(tableAllRows[i].debit)) ? 0 : parseInt(tableAllRows[i].debit);
                let perRowCredit = isNaN(parseInt(tableAllRows[i].credit)) ? 0 : parseInt(tableAllRows[i].credit)
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
                    axios.post(`${userInfo.Ip}/API/VouchAgtVouch/Update_VAV_Voucher`, voucherFullData)
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

                                fetch(`${userInfo.Ip}/API/VouchAgtVouch/Get_VoucherAllInfo?voucherNo=${res.data.Voucher.VoucherNo}&voucherId=${res.data.Voucher.VoucherId}`)
                                    .then(res =>
                                        res.json()
                                        // console.log(res);
                                    )
                                    .then((data) => {
                                        console.log("Fetched AGAIN AFTER UPDATE Raw data for voucher Edit, Line No. 517.....");
                                        setVouchAgtVouchToEdit(0);
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

    const [prevVouchSelectModalOpen, setPrevVouchSelectModalOpen] = useState(false);
    const handlePrevModalOpen = () => setPrevVouchSelectModalOpen(true);
    const handlePrevModalClose = () => {
        if (!(prevVouchNo?.VoucherId)) {
            toast.warning("You must select a previous voucher!");
            // setVoucherTableData([]);
            // setValue("reference", "");
            // setValue("description", "");
            // setAttachments([]);
            // setPrevVouchSelectModalOpen(false);
        }
        setPrevVouchSelectModalOpen(false);
    }

    const prevVouchSelectionModalstyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '40%',
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    const clickIconPrevVoucherNo = () => {
        console.log("rupom modal");
        console.log(prevVouchElement);

        handlePrevModalOpen();

    }

    const editVouchBtn = () => {
        setVouchAgtVouchToEdit({});
        navigate('/voucherEdit');
    }
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


    const fetchCallForPrevVouchAssign = (selectedOption) => {
        if (!selectedOption) {
            toast.warning("You must select a previous voucher!");
            setVoucherTableData([]);
            setValue("reference", "");
            setValue("description", "");
            setAttachments([]);
        }
        console.log(selectedOption);
        setPrevVouchNo(selectedOption);
        setPrevVouchSelectModalOpen(false);

        if (selectedOption?.VoucherId) {
            // fetch hobe with that voucher id to assign everything
            fetch(`${userInfo.Ip}/API/VouchAgtVouch/Get_PrevVoucherAllInfo?voucherNo=${selectedOption?.VoucherNo}&voucherId=${selectedOption.VoucherId}`)
                .then(res =>
                    res.json()
                    // console.log(res);
                )
                .then((data) => {
                    console.log("rupom yo yo voucher numbers");
                    console.log(data);
                    setVoucherTableData(emptyRows);

                    // assignDataOfPrevVoucher(data.Voucher.Date, data.Voucher.LocationId, data.Location.Name, data.Voucher.VoucherId, data.Voucher.VoucherNo, data.Voucher.AttachmentId, data.Voucher.ReferenceNo, data.Voucher.Description, data.V_VoucherDetailRows, data.Attachment?.AttachmentData_List);
                    assignDataOfPrevVoucher(data.Voucher.ReferenceNo, data.Voucher.Description, data.V_VoucherDetailRows, data.Attachment?.AttachmentData_List);
                })
        }
    }

    const handleOnSelectPrevVouch = (e, selectedOption) => {
        setPrevVouchSelectModalOpen(false);


        let tableAllRows = _.cloneDeep(voucherTableData);
        let tableNonEmptyRows = [];
        if (tableAllRows.length > 0) {
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
                console.log(rowIsEmpty);
                if (!rowIsEmpty) {
                    tableNonEmptyRows.push(tableAllRows[i]);
                }
            }
        }

        if (getValues().reference || getValues().description || attachments.length || (tableNonEmptyRows.length > 0)) {
            Swal.fire({
                title: `Are you sure?`,
                text: 'All unsaved data on this page will get lost!!',
                showDenyButton: true,
                icon: 'question',
                showCancelButton: false,
                confirmButtonText: 'Yes, I am!',
                denyButtonText: `No, I'm not!`,
            }).then((result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                    fetchCallForPrevVouchAssign(selectedOption);
                }
                else {
                    setPrevVouchSelectModalOpen(true);
                }
            })
        }
        else {
            fetchCallForPrevVouchAssign(selectedOption);
        }
    }

    // const assignDataOfPrevVoucher = () => {

    // }

    // const assignDataOfPrevVoucher = (voucherDate, voucherLocationId, voucherLocationName, voucherId, voucherNo, voucherAttachmentId, reference, description, vouchDtTable, attachmentTable) => {
    const assignDataOfPrevVoucher = (reference, description, vouchDtTable, attachmentTable) => {
        console.log("assignDataForEdit Function.....");
        setValue("reference", reference);
        setValue("description", description);
        console.log(vouchDtTable);

        let voucherTableArr = _.cloneDeep(emptyRows);
        voucherTableArr.splice(0, vouchDtTable.length);

        let tempArray = [];
        for (let i = 0; i < vouchDtTable.length; i++) {
            let objRow = {
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
                debit: vouchDtTable[i].Credit ? vouchDtTable[i].Credit : 0,
                credit: vouchDtTable[i].Debit ? vouchDtTable[i].Debit : 0,
                name: {
                    Name: "",
                    Id: "",
                    TableName: ""
                }
            }

            if (vouchDtTable[i].EmployeeId) {
                objRow.name = { Name: vouchDtTable[i].EmployeeName, Id: vouchDtTable[i].EmployeeId, TableName: "Employee" };
            }
            else if (vouchDtTable[i].SupplierId) {
                objRow.name = { Name: vouchDtTable[i].SupplierName, Id: vouchDtTable[i].SupplierId, TableName: "Supplier" };
            }
            else if (vouchDtTable[i].LocationId) {
                objRow.name = { Name: vouchDtTable[i].LocationName, Id: vouchDtTable[i].LocationId, TableName: "Location" };
            }
            else if (vouchDtTable[i].BuyerId) {
                objRow.name = { Name: vouchDtTable[i].BuyerName, Id: vouchDtTable[i].BuyerId, TableName: "Buyer" };
            }
            tempArray.push(objRow);
        }
        voucherTableArr = [...tempArray, ...voucherTableArr];

        setVoucherTableData(voucherTableArr);

        let attachmentTb = [];
        if (attachmentTable.length) {
            for (let i = 0; i < attachmentTable.length; i++) {
                let perAttachObj = checkAndSetAttachObjFomrat(attachmentTable[i]);
                delete perAttachObj.autoSL;
                perAttachObj.fileName = perAttachObj.fileName.substr((perAttachObj.fileName.indexOf(')') + 1)).toLowerCase();
                console.log("attachment formatter func e dhukar por:")
                console.log(perAttachObj);

                attachmentTb.push(perAttachObj);
            }
        }
        console.log("attachment full array");
        console.log(attachmentTb);
        setAttachments(attachmentTb);

        setdebitCreditWatch((prev) => !prev);
    }



    return (
        // return wrapper div
        <div className='mt-16 md:mt-2'>

            <div className="m-2 flex justify-center">
                <div className="block w-11/12 ">

                    {/* Main Card */}
                    <div className="block rounded-lg shadow-lg bg-white dark:bg-secondary-dark-bg  text-center">
                        {/* Main Card header */}
                        <div className="py-3 bg-white text-xl dark:text-gray-200 text-start px-6 border-b border-gray-300">
                            Voucher Against Voucher
                        </div>
                        {/* Main Card header--/-- */}

                        {/* Main Card body */}
                        <div className=" px-6 pb-4 text-start md:min-h-[60vh] grid grid-cols-4 gap-4 mt-2">

                            <fieldset className="md:col-span-4 col-span-4 border border-solid border-gray-300 px-3 pt-1 pb-3 dark:text-slate-50">
                                <legend className="text-sm">Voucher Against Voucher</legend>



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
                                            readOnly={voucherIs ? true : false}
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
                                            name="prevVoucherNo"
                                            control={control}
                                            render={({ field }) => (
                                                <div className='flex'>
                                                    <TextField
                                                        {...field}
                                                        sx={{ width: '100%' }} InputProps={{ style: { fontSize: 13 }, readOnly: true }}
                                                        value={(prevVouchNo?.VoucherNo) ? prevVouchNo?.VoucherNo : ""}
                                                        InputLabelProps={{
                                                            style: { fontSize: 14 },
                                                            // shrink: field.value
                                                            shrink: ((prevVouchNo?.VoucherNo) ? true : false)
                                                        }}
                                                        id="prevVoucherNo" label="Prev Voucher No." variant="standard" size="small"
                                                    />
                                                    <IconButton
                                                        aria-label="Select Previous Voucher No."
                                                        onClick={clickIconPrevVoucherNo}
                                                        sx={{ marginLeft: "-40px" }}
                                                        disabled={voucherIs}
                                                    >
                                                        <ModeEditOutlineIcon />
                                                    </IconButton>

                                                </div>
                                            )}
                                        />

                                        <div className='col-span-2'>
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
                                        </div>
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

                                        {/* <TextField className='col-span-2' sx={{ width: '100%' }} {...register("description")} InputProps={{ style: { fontSize: 13 } }}
                                            InputLabelProps={{
                                                style: { fontSize: 14 },

                                            }} id="description" label="Description" variant="standard" size="small" multiline
                                            maxRows={4}
                                        /> */}

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
                                            // sortingFns={{
                                            //     //will add a new sorting function to the list of other sorting functions already available
                                            //     myCustomSortingFn: (rowA, rowB, columnId) => {
                                            //         console.log(rowA);
                                            //         console.log(rowB);
                                            //         console.log(columnId);

                                            //         return (rowA)
                                            //     }// your custom sorting logic
                                            // }}

                                            muiTableContainerProps={{ sx: { maxHeight: '580px' } }} //ekhane table er data height
                                            muiTableHeadCellProps={{
                                                //simple styling with the `sx` prop, works just like a style prop in this example
                                                sx: {
                                                    fontWeight: 'Bold',
                                                    fontSize: '13px',
                                                },
                                                // align: 'left',
                                            }}
                                        />
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
                                    onClick={() => { updateVTData() }}
                                >Update</button>) : (<button
                                    type="button"
                                    data-mdb-ripple="true"
                                    data-mdb-ripple-color="light"
                                    className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out"
                                    onClick={() => { saveVTdata() }}
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

            {/* // modals --- out of html normal body/position */}
            <Modal
                open={prevVouchSelectModalOpen}
                onClose={handlePrevModalClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={prevVouchSelectionModalstyle}>
                    <fieldset className=" border border-solid border-gray-300 px-3 pt-1 pb-3 dark:text-slate-50">
                        <legend className="text-sm">Select a Prevoius Voucher No. </legend>
                        <div className=' grid-cols-2 grid gap-x-4 gap-y-1'>

                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    label="From"
                                    // inputFormat="DD/MM/YYYY HH:MM" blockletter HH means hours in 24h format, small letter hh means 12h format. dd/mm/yyyy value varies if DD/MM/YYY check urself. for am/pm= a, AM/PM= A
                                    //visit https://day.js.org/docs/en/parse/string-format for datetime formats
                                    inputFormat="DD/MM/YYYY"
                                    renderInput={(params) =>
                                        <TextField
                                            sx={{ width: '100%', marginTop: 1 }}
                                            {...params}
                                            {...register("dateFrom")}
                                            // defaultValue={voucherDateState}
                                            InputProps={{ ...params.InputProps, style: { fontSize: 13 } }}
                                            InputLabelProps={{
                                                ...params.InputLabelProps, style: { fontSize: 14 },

                                            }}
                                            variant="standard"
                                            size="small"
                                        />}
                                    value={dateFrom}
                                    onChange={(newValue) => {

                                        setDateFrom(newValue);
                                        if (newValue && dateTo) {
                                            if (newValue.diff(dateTo) <= 0) {
                                                let dfrom = dayjs(newValue).format('YYYY/MM/DD') + " 00:00";
                                                let dto = dayjs(dateTo).format('YYYY/MM/DD') + " 23:59";

                                                // var sendInfo = { DateTo: dto, DateFrom: dfrom, VoucherType: voucherTypeOutput.Name, LocationId: userInfo.LocationId, CompanyId: userInfo.CompanyId }
                                                // console.log(sendInfo);

                                                fetch(`${userInfo.Ip}/API/VouchAgtVouch/Get_PrevVouchNo?dateTo=${dto}&dateFrom=${dfrom}&locationId=${userInfo.LocationId}&companyId=${userInfo.CompanyId}`)
                                                    .then(res =>
                                                        res.json()
                                                        // console.log(res);
                                                    )
                                                    .then((data) => {
                                                        console.log("rupom yo yo voucher numbers");
                                                        console.log(data);

                                                        let rupomx = [
                                                            { VoucherNo: 'VoucherNo', BuyerName: 'BuyerName', BuyerPhone: 'BuyerPhone', VouchRefer: 'VouchRefer' },
                                                            { VoucherNo: '2', BuyerName: 'Rupom', BuyerPhone: '0194234', VouchRefer: '8576883' },
                                                            { VoucherNo: '3', BuyerName: 'Nobin', BuyerPhone: '0185234', VouchRefer: '9643034' },
                                                            { VoucherNo: '4', BuyerName: 'Saiful', BuyerPhone: '0174234', VouchRefer: '4554857' }
                                                        ]

                                                        setPrevVouchNoOpts(rupomx);
                                                        console.log(prevVouchNoOpts);
                                                    })

                                                // fetch(`${userInfo.Ip}/API/VoucherEdit/Get_VoucherNo?dateTo=${dto}&dateFrom=${dfrom}&vocuherType=JV&locationId=${userInfo.LocationId}&companyId=${userInfo.CompanyId}`)
                                                //     .then(res =>
                                                //         res.json()
                                                //         // console.log(res);
                                                //     )
                                                //     .then((data) => {
                                                //         console.log(data);
                                                //         setPrevVouchNoOpts(data);
                                                //     })

                                                console.log("fetch call hobe from dateFrom");

                                            }
                                            else { setPrevVouchNoOpts([]) }
                                        }
                                        else { setPrevVouchNoOpts([]) }
                                    }}
                                />
                            </LocalizationProvider>


                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    label="To"
                                    // inputFormat="DD/MM/YYYY HH:MM" blockletter HH means hours in 24h format, small letter hh means 12h format. dd/mm/yyyy value varies if DD/MM/YYY check urself. for am/pm= a, AM/PM= A
                                    //visit https://day.js.org/docs/en/parse/string-format for datetime formats
                                    inputFormat="DD/MM/YYYY"
                                    renderInput={(params) =>
                                        <TextField
                                            sx={{ width: '100%', marginTop: 1 }}
                                            {...params}
                                            {...register("dateTo")}
                                            // defaultValue={voucherDateState}
                                            InputProps={{ ...params.InputProps, style: { fontSize: 13 } }}
                                            InputLabelProps={{
                                                ...params.InputLabelProps, style: { fontSize: 14 },

                                            }}
                                            variant="standard"
                                            size="small"
                                        />}
                                    value={dateTo}
                                    onChange={(newValue) => {

                                        console.log("date Changed");
                                        console.log(newValue);
                                        console.log(dateFrom.diff(newValue));

                                        setDateTo(newValue);
                                        if (newValue && dateFrom) {
                                            if (dateFrom.diff(newValue) <= 0) {
                                                let dto = dayjs(newValue).format('YYYY/MM/DD') + " 23:59";
                                                let dfrom = dayjs(dateFrom).format('YYYY/MM/DD') + " 00:00";

                                                console.log(dto);
                                                // var sendInfo = { DateTo: dto, DateFrom: dfrom, VoucherType: voucherTypeOutput.Name, LocationId: userInfo.LocationId, CompanyId: userInfo.CompanyId }
                                                // console.log(sendInfo);

                                                fetch(`${userInfo.Ip}/API/VouchAgtVouch/Get_PrevVouchNo?dateTo=${dto}&dateFrom=${dfrom}&locationId=${userInfo.LocationId}&companyId=${userInfo.CompanyId}`)
                                                    .then(res =>
                                                        res.json()
                                                        // console.log(res);
                                                    )
                                                    .then((data) => {
                                                        console.log("rupom yo yo voucher numbers");
                                                        console.log(data);
                                                        setPrevVouchNoOpts(data);
                                                    })

                                                console.log("fetch call hobe from dateFrom");

                                            }
                                            else { setPrevVouchNoOpts([]) }
                                        }
                                        else { setPrevVouchNoOpts([]) }
                                    }}
                                />
                            </LocalizationProvider>
                            <div className='col-span-2'>
                                <Autocomplete
                                    id="Voucher No."
                                    clearOnEscape
                                    size="small"
                                    className='col-span-3'
                                    options={prevVouchNoOpts}
                                    // defaultValue={(locationOutput) ? locationOutput : { Name: "", LocationId: "" }}
                                    value={prevVouchNo ? prevVouchNo : ""}

                                    // defaultValue={locationOutput?.Name ? locationOutput?.Name : ''}
                                    getOptionLabel={(option) => (option.VoucherNo) ? option.VoucherNo : ""}

                                    onChange={(e, selectedOption) => {
                                        handleOnSelectPrevVouch(e, selectedOption);
                                    }}
                                    // defaultValue={top100Films[2]}
                                    renderInput={(params) => (
                                        <TextField
                                            sx={{ width: '100%', marginTop: 1 }}
                                            {...params}
                                            InputProps={{ ...params.InputProps, style: { fontSize: 13 } }}
                                            InputLabelProps={{
                                                ...params.InputLabelProps, style: { fontSize: 14 },

                                            }}
                                            onChange={(newValue) => {
                                                console.log("autocomp Changed")
                                            }}
                                            label="Previous Voucher No." variant="standard" />
                                    )}

                                    renderOption={(option) => (
                                        // <TableContainer>
                                        //     <Table>
                                        //         <TableBody>
                                        //             {prevVouchNoOpts.map((option) => (
                                        //                 <TableRow key={option.VoucherId}>
                                        //                     <TableCell>{option.VoucherId}</TableCell>
                                        //                     <TableCell>{option.VoucherNo}</TableCell>
                                        //                 </TableRow>
                                        //             ))}
                                        //         </TableBody>
                                        //     </Table>
                                        // </TableContainer>

                                        <table>
                                            {option?.VoucherNo === 'VoucherNo' ? (
                                                <thead>
                                                    <tr>
                                                        <th>VoucherNo</th>
                                                        <th>BuyerName</th>
                                                        <th>BuyerPhone</th>
                                                        <th>VoucherRefer</th>

                                                    </tr>
                                                </thead>
                                            ) : (
                                                <tbody>
                                                    <tr>
                                                        <td style={{ width: 400 }}>{option.VoucherId}</td>
                                                        <td>{option.BuyerName}</td>
                                                        <td>{option.BuyerPhone}</td>
                                                        <td>{option.VoucherRefer}</td>
                                                    </tr>
                                                </tbody>
                                            )}
                                        </table>


                                    )}
                                />
                            </div>
                        </div>
                    </fieldset>
                </Box>
            </Modal>
        </div >
        // return wrapper div--/--
    )
}

export default VoucherAgainstVoucher