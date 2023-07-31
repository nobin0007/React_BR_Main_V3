import React from 'react';
import axios from 'axios';
import { useState, useEffect } from 'react';
import * as _ from 'lodash';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
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
    MenuItem
} from "@mui/material";

import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';


import { useForm } from "react-hook-form";


// material table
// import MaterialTable, { MTableBodyRow } from "material-table";
import { Paper } from '@material-ui/core';

import { forwardRef } from 'react';

import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';


import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

import Popper from "@material-ui/core/Popper";

import AttachmentLoader from '../components/AttachmentLoader';

import { Description } from '@material-ui/icons';
import { useStateContext } from '../contexts/ContextProvider';
// import muiStyleCustom from '../muiStyleCustom';
import { useNavigate } from 'react-router-dom';

const JournalVoucher = (props) => {
    // ---[show/hide panel,navbar]---
    const { setShowPanel, setShowNavbar } = useStateContext();
    useEffect(() => {
        setShowPanel(props.panelShow);
        setShowNavbar(props.navbarShow);
    }, [])

    var userInfo = { Name: '', LocationId: '' };
    if (sessionStorage.getItem("userInfo")) {
        userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
        console.log("sjdhvbsjhdb");
        console.log(userInfo);

    }

    const [attachments, setAttachments] = useState([]);
    const { register, getValues } = useForm();

    // ---[datepicker states]---
    const [voucherDateState, setVoucherDateState] = useState(new Date());

    // material-table
    const tableIcons = {
        Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
        Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
        Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
        Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
        DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
        Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
        Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
        Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
        FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
        LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
        NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
        PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
        ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
        Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
        SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
        ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
        ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
    };

    const [mtTableData, setMtTableData] = useState([]);
    const [location, setLocation] = useState([]);
    const [accountsHead, setAccountsHead] = useState([]);
    const [project, setProject] = useState([]);

    const [allNames, setAllNames] = useState([]);
    const [userSession, setUserSession] = useState([]);
    const navigate = useNavigate();


    const [locationOutput, setLocationOutput] = useState({ Name: userInfo.LocationName, LocationId: userInfo.LocationId });


    const autoCompResStyles = (theme) => ({
        popper: {
            maxWidth: "fit-content",
            fontSize: "13px"
        }
    });

    const PopperMy = function (props) {
        return <Popper {...props} style={autoCompResStyles.popper} />;
    };


    const allNames1 = [
        { Name: 'Rupom', TableName: 'Buyer', BuyerId: 111 },
        { Name: 'Rupom', TableName: 'Supplier', SupplierId: 112 },
        { Name: 'Rupom', TableName: 'Employee', EmployeeId: 113 },
        { Name: 'Dhaka', TableName: 'Location', LocationId: 117 },
        { Name: 'Rupom2', TableName: 'Buyer', BuyerId: 118 },
    ];

    const saveVTdata = () => {

        // var tableAllRows = [...mtTableData];
        //you cant copy a nested array deeply,,, jodi nested na hoilto spread operator diye korle thik thak copy hoito.. thats why clonedeep korte hoise jaate useState er state er kono reference na paay, see: https://stackoverflow.com/questions/65772279/react-copy-state-to-local-variable-without-changing-its-value
        var tableAllRows = _.cloneDeep(mtTableData);
        var totalCredit = 0;
        var totalDebit = 0;
        var formData = getValues();
        let voucherDate = dayjs(voucherDateState).format('YYYY/MM/DD hh:mm A');

        var voucherTb = {
            // Date:newDate,
            LocationId: locationOutput.LocationId,
            ReferenceNo: formData.reference,
            Description: formData.description,

        };

        var voucherDtTb = [];
        var debitCreditFlag = true;
        var mandatoryFieldFlag = true;
        for (let i = 0; i < tableAllRows.length; i++) {
            delete tableAllRows[i].tableData; //reach row te row no deyar jonno tableData naame property added koira dey MTtable, and oitar moddhe id is equal to not null/"",,,,,, tai oi property tai object theke remove kortesi
            const rowIsEmpty = !Object.values(tableAllRows[i]).some(x => x !== null && x !== '') //bool return kore, object er j kono ekta property o jodi faka na hoy taile false ashe, maane isEmpty is false/empty na
            if (!rowIsEmpty) {

                var perRowDebit = isNaN(parseInt(tableAllRows[i].debit)) ? 0 : parseInt(tableAllRows[i].debit);
                var perRowCredit = isNaN(parseInt(tableAllRows[i].credit)) ? 0 : parseInt(tableAllRows[i].credit)

                if (perRowDebit > 0 && perRowCredit > 0) {
                    debitCreditFlag = false;
                    toast.error(`You cannot enter debit and credit both in a single row. Check row: ${i + 1}`);
                }

                totalCredit = totalCredit + perRowCredit;
                totalDebit = totalDebit + perRowDebit;

                var propertyName = `${tableAllRows[i].name.TableName}Id`
                var perRowForbackend = {};

                if (tableAllRows[i].name) {
                    perRowForbackend = {
                        AccountsId: tableAllRows[i].accountHead.AccountsId,
                        ProjectId: tableAllRows[i].project.ProjectId,
                        Particulars: tableAllRows[i].particulars,
                        Debit: perRowDebit,
                        Credit: perRowCredit,
                        [propertyName]: tableAllRows[i].name.Id
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
            if (!tableAllRows[i].accountHead && (tableAllRows[i].debit || tableAllRows[i].credit)) {
                mandatoryFieldFlag = false;
                toast.error(`You must select a Account Head for row: ${i + 1}`);
            }
            if (tableAllRows[i].accountHead && !(tableAllRows[i].debit || tableAllRows[i].credit)) {
                mandatoryFieldFlag = false;
                toast.error(`You must entry a debit/credit for row: ${i + 1}`);
            }
        }
        console.log(attachments);
        var attachmentArr = [];
        for (let i = 0; i < attachments.length; i++) {
            var perAttachment = {
                FileName: attachments[i].fileName,
                AttachmentType: attachments[i].fileExtension,
                FileBase64: (attachments[i].fileB64format).substr((attachments[i].fileB64format.lastIndexOf(',') + 1))
            }
            attachmentArr.push(perAttachment);
        }


        var voucherFullData = {
            Voucher: voucherTb,
            VoucherDetail: voucherDtTb,
            VoucherDate: voucherDate,
            Attachment: {
                AttachmentData_List: attachmentArr
            },
            UserInfos: userInfo
        };

        console.log(voucherFullData);
        console.log("total credit: " + totalCredit);
        console.log("total debit: " + totalDebit);
        console.log(attachments);

        if (voucherDtTb.length && (totalCredit == totalDebit) && debitCreditFlag && mandatoryFieldFlag) {

            axios.post(`${userInfo.Ip}/API/JournalVoucher/Post_JV_Voucher`, voucherFullData)
                .then(res => {
                    console.log("insert er axios!!")
                    if (res) {
                        console.log(res);
                        Swal.fire({
                            title: `Voucher No: \n${res.data} \n has been Generated!`,
                            showDenyButton: false,
                            icon: 'success',
                            showCancelButton: false,
                            confirmButtonText: 'OK',
                            denyButtonText: ``,
                        }).then((result) => {
                            /* Read more about isConfirmed, isDenied below */
                            if (result.isConfirmed) {

                            }
                        })
                        // reset();
                    }

                })
        }
        else if (!(totalCredit == totalDebit)) {
            toast.error('Your Debits & Credits are not balanced !!');
        }
        else if (!voucherDtTb.length) {
            toast.error('No data do save!');
        }
        else {
            // toast.error('debit credit prob single row flag problem!');
        }

    }


    const mtColumns = [
        {
            title: "Account Head", field: "accountHead", filterPlaceholder: "filter by account head", width: "80%",

            render: (rowData) => <div>{(rowData?.accountHead?.Name) ? rowData.accountHead.Name : ""}</div>,
            editComponent: props => (
                <Autocomplete
                    id=""
                    PopperComponent={PopperMy}
                    clearOnEscape
                    size="small"
                    options={accountsHead}
                    defaultValue={(props?.rowData?.accountHead) ? (props?.rowData?.accountHead) : { Name: "", AccountsId: "" }}
                    onChange={(e, selectedOption) => {
                        // if u r updating only one cell:
                        // props.onChange(selectedOption);

                        //if you want to change other cells on 1st cells data, then fetch/ajax first based on selection, then set the selected value and fetch/ajaxed values and pass to rowDataChanged:
                        // Ajax/fetch call on selectedOption value
                        const url = `${userInfo.Ip}/API/JournalVoucher/Get_ControlAccount?controlAccId=${selectedOption.ControlAccountId}`;
                        fetch(url, {
                            method: 'GET',
                        })
                            .then(res => res.json())
                            .then(data => {
                                console.log(data);
                                props.onRowDataChange({ accountHead: selectedOption, controlAccName: { Name: data[0].Name, id: data[0].ControlAccountId }, project: "", particulars: "", debit: "", credit: "", name: "" });
                                //just re-rendering the table to make the other column data available
                                var prevTableDataOld = [...mtTableData];
                                setMtTableData(prevTableDataOld);


                                //detect which row im editing, if its the last, add a new row
                                var prevTableData = [...mtTableData]
                                if ((props?.rowData?.tableData?.id) && (props.rowData.tableData.id == prevTableData.length - 1)) {
                                    prevTableData.push({ accountHead: "", controlAccName: "", project: "", particulars: "", debit: "", credit: "", name: "" });
                                    setMtTableData(prevTableData);
                                }
                            }
                            )


                    }}
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
                            sx={{ marginTop: 1, width: "170px" }}
                            {...params}
                            InputProps={{ ...params.InputProps, style: { fontSize: 13 } }}
                            variant="standard"
                            size="small"
                        />}
                />


            ),
            // exportTransformer: (row) => row.accountHead.accountHead

        },
        // {
        //     title: "Control Account Name", field: "controlAccName", filterPlaceholder: "filter by name",
        //     render: (rowData) => <div>{(rowData?.name?.name) ? rowData.name.name : ""}</div>,
        //     editComponent: props => (
        //         <Autocomplete
        //             id=""
        //             PopperComponent={PopperMy}
        //             clearOnEscape
        //             size="small"
        //             options={controlAccountName}
        //             defaultValue={(props?.rowData?.name) ? props?.rowData?.name : { name: "", designation: "", id: "" }}
        //             onChange={(e, selectedOption) => {
        //                 props.onChange(selectedOption);
        //             }}
        //             getOptionLabel={(option) => option.name}
        //             renderOption={(props, option) => (
        //                 <List {...props} key={option.id}>
        //                     <ListItem>
        //                         <ListItemText primary={option.name}
        //                             secondary={option.designation} />
        //                     </ListItem>
        //                 </List>

        //             )}
        //             renderInput={(params) =>
        //                 <TextField
        //                     sx={{ marginTop: 1, width: "120px" }}
        //                     {...params}
        //                     InputProps={{ ...params.InputProps, style: { fontSize: 13 } }}
        //                     variant="standard"
        //                     size="small"
        //                 />}
        //         />


        //     )
        // },
        {
            title: "Control Account", field: "controlAccName", filterPlaceholder: "filter by particulars", width: "300",
            render: (rowData) => <div>{(rowData?.controlAccName?.Name) ? rowData.controlAccName.Name : ""}</div>,
            editComponent: props => (
                <TextField variant="outlined" type='text'
                    defaultValue={(props?.rowData?.controlAccName?.Name) ? props?.rowData?.controlAccName?.Name : ""}
                    InputProps={{ style: { fontSize: 13 }, readOnly: true }}
                />

            )
        },
        {
            title: "Project", field: "project", filterPlaceholder: "filter by project",
            render: (rowData) => <div>{(rowData?.project?.Name) ? rowData.project.Name : ""}</div>,
            editComponent: props => (
                <Autocomplete
                    id=""
                    PopperComponent={PopperMy}
                    clearOnEscape
                    size="small"
                    options={project}
                    defaultValue={(props?.rowData?.project) ? props?.rowData?.project : { Name: "", ProjectId: "" }}
                    onChange={(e, selectedOption) => {
                        props.onChange(selectedOption);
                    }}
                    getOptionLabel={(option) => option.Name}
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
                            sx={{ marginTop: 1, width: "120px" }}
                            {...params}
                            InputProps={{ ...params.InputProps, style: { fontSize: 13 } }}
                            variant="standard"
                            size="small"
                        />}
                />


            )
        },
        { title: "Particulars", field: "particulars", filterPlaceholder: "filter by particulars" },
        { title: "Debit", field: "debit", filterPlaceholder: "filter by debit" },
        { title: "Credit", field: "credit", filterPlaceholder: "filter by credit" },
        {
            title: "Name", field: "name", filterPlaceholder: "filter by name",
            render: (rowData) => <div>{(rowData?.name?.Name) ? rowData.name.Name : ""}</div>,
            editComponent: props => (
                <Autocomplete
                    id=""
                    PopperComponent={PopperMy}
                    clearOnEscape
                    size="small"
                    options={allNames}
                    defaultValue={(props?.rowData?.name) ? props?.rowData?.name : { Name: "", TableName: "", Id: "" }}
                    onChange={(e, selectedOption) => {
                        props.onChange(selectedOption);
                    }}
                    getOptionLabel={(option) => option.Name}
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
                            sx={{ marginTop: 1, width: "120px" }}
                            {...params}
                            InputProps={{ ...params.InputProps, style: { fontSize: 13 } }}
                            variant="standard"
                            size="small"
                        />}
                />


            )
        }
    ]
    useEffect(() => {
        const tempData = [
            { accountHead: "", controlAccName: "", project: "", particulars: "", debit: "", credit: "", name: "" },
            { accountHead: "", controlAccName: "", project: "", particulars: "", debit: "", credit: "", name: "" },
            { accountHead: "", controlAccName: "", project: "", particulars: "", debit: "", credit: "", name: "" },
            { accountHead: "", controlAccName: "", project: "", particulars: "", debit: "", credit: "", name: "" },
            { accountHead: "", controlAccName: "", project: "", particulars: "", debit: "", credit: "", name: "" },
            { accountHead: "", controlAccName: "", project: "", particulars: "", debit: "", credit: "", name: "" },
            { accountHead: "", controlAccName: "", project: "", particulars: "", debit: "", credit: "", name: "" },
            { accountHead: "", controlAccName: "", project: "", particulars: "", debit: "", credit: "", name: "" },
            { accountHead: "", controlAccName: "", project: "", particulars: "", debit: "", credit: "", name: "" },
            { accountHead: "", controlAccName: "", project: "", particulars: "", debit: "", credit: "", name: "" }
        ]
        setMtTableData(tempData);
    }, [])

    useEffect(() => {

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
                var temp = [];
                for (let i = 0; i < data.length; i++) {
                    var perObj = { Name: data[i].Name, ProjectId: data[i].ProjectId };
                    temp.push(perObj);
                }
                setProject(temp);
            })

        fetch(`${userInfo.Ip}/API/JournalVoucher/Get_AccountHead?companyId=${userInfo.CompanyId}&locationId=${userInfo.LocationId}`)
            .then(res =>
                res.json()
                // console.log(res);
            )
            .then((data) => {
                console.log(data);
                var accHead = [];
                for (let i = 0; i < data.length; i++) {
                    var temp = { Name: data[i].Name, AccountsId: data[i].AccountsId, ControlAccountId: data[i].ControlAccountId };
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

        // fetch(`${userInfo.Ip}/API/JournalVoucher/AllEmployee`)
        //     .then(res =>
        //         res.json()
        //         // console.log(res);
        //     )
        //     .then((data) => {
        //         console.log(data);

        //     })
        // fetch(`${userInfo.Ip}/API/JournalVoucher/AllSupplier`)
        //     .then(res =>
        //         res.json()
        //         // console.log(res);
        //     )
        //     .then((data) => {
        //         console.log(data);

        //     })
        // fetch(`${userInfo.Ip}/API/JournalVoucher/AllLocation`)
        //     .then(res =>
        //         res.json()
        //         // console.log(res);
        //     )
        //     .then((data) => {
        //         console.log(data);

        //     })


    }, [])

    return (
        // return wrapper div
        <div className='mt-16 md:mt-2'>

            <div className="m-2 flex justify-center">
                <div className="block w-11/12 ">

                    {/* Main Card */}
                    <div className="block rounded-lg shadow-lg bg-white dark:bg-secondary-dark-bg  text-center">
                        {/* Main Card header */}
                        <div className="py-3 'bg-white text-xl dark:text-gray-200 text-start px-6 border-b border-gray-300">
                            Journal Voucher
                        </div>
                        {/* Main Card header--/-- */}

                        {/* Main Card body */}
                        <div className=" px-6 pb-4 text-start md:min-h-[60vh] grid grid-cols-4 gap-4 mt-2">

                            <fieldset className="md:col-span-4 col-span-4 border border-solid border-gray-300 px-3 pt-1 pb-3 dark:text-slate-50">
                                <legend className="text-sm">Journal Voucher</legend>



                                <form className='' >
                                    <div className='w-full grid-cols-2 grid gap-x-4 gap-y-1'>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DateTimePicker
                                                label="Voucher Date"
                                                // inputFormat="DD/MM/YYYY HH:MM" blockletter HH means hours in 24h format, small letter hh means 12h format. dd/mm/yyyy value varies if DD/MM/YYY check urself. for am/pm= a, AM/PM= A
                                                //visit https://day.js.org/docs/en/parse/string-format for datetime formats
                                                inputFormat="DD/MM/YYYY hh:mm A"

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
                                            // options={top100Films}
                                            options={location}
                                            // defaultValue={(locationOutput) ? locationOutput : { Name: "", LocationId: "" }}
                                            defaultValue={{ Name: locationOutput.Name, LocationId: locationOutput.LocationId }}

                                            // defaultValue={locationOutput?.Name ? locationOutput?.Name : ''}
                                            getOptionLabel={(option) => option.Name.toString()}

                                            onChange={(e, selectedOption) => {
                                                console.log(selectedOption);
                                                setLocationOutput(selectedOption);
                                            }}
                                            // defaultValue={top100Films[2]}
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

                                        <TextField sx={{ width: '100%' }} {...register("voucherNo")} InputProps={{ style: { fontSize: 13 } }}
                                            InputLabelProps={{
                                                style: { fontSize: 14 },

                                            }} id="voucherNo" label="Voucher No." variant="standard" size="small" />

                                        <TextField sx={{ width: '100%' }} {...register("reference")} InputProps={{ style: { fontSize: 13 } }}
                                            InputLabelProps={{
                                                style: { fontSize: 14 },

                                            }} id="reference" label="Reference" variant="standard" size="small" multiline
                                            maxRows={4}
                                        />

                                        <TextField className='col-span-2' sx={{ width: '100%' }} {...register("description")} InputProps={{ style: { fontSize: 13 } }}
                                            InputLabelProps={{
                                                style: { fontSize: 14 },

                                            }} id="description" label="Description" variant="standard" size="small" multiline
                                            maxRows={4}
                                        />
                                        {/* <TextField sx={{ width: '100%' }} {...register("attachment")} InputProps={{ style: { fontSize: 13 } }}
                                            InputLabelProps={{
                                                style: { fontSize: 14 },

                                            }} id="attachment" label="Attachments" variant="standard" size="small" multiline
                                            maxRows={4}
                                        /> */}
                                        <div className='ml-3 mb-3 mt-1'>
                                            <AttachmentLoader attachments={attachments} setAttachments={setAttachments} imgPerSlide={4}></AttachmentLoader>
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



                            <fieldset className="border border-solid border-gray-300 col-span-4 px-3 pt-1 pb-3 dark:text-slate-50">
                                <legend className="text-sm">Voucher Table</legend>

                                <div className=" grid md:grid-cols-3 grid-cols-1 gap-x-4 gap-y-1">

                                    {/* material-table */}

                                    <div className='mt-4 col-span-3 max-w-full'>
                                        {/* <MaterialTable
                                            icons={tableIcons}
                                            columns={mtColumns}
                                            data={mtTableData}
                                            title="Material-Table"
                                            sx={{ width: '100%' }}

                                            editable={{
                                                // onRowUpdate: (newRow, oldRow) => new Promise((resolve, reject) => {
                                                //     const updateData = [...mtTableData];
                                                //     updateData[oldRow.tableData.id] = newRow;
                                                //     setMtTableData(updateData);
                                                //     console.log(newRow, oldRow);
                                                //     setTimeout(() => resolve(), 50)
                                                // })
                                                onBulkUpdate: changes =>
                                                    new Promise((resolve, reject) => {
                                                        console.log(changes);

                                                        var editedIndexes = Object.getOwnPropertyNames(changes);
                                                        var tempX = [...mtTableData];
                                                        for (let i = 0; i < editedIndexes.length; i++) {
                                                            tempX[parseInt(editedIndexes[i])] = changes[parseInt(editedIndexes[i])].newData
                                                        }
                                                        // console.log(tempX);
                                                        setMtTableData(tempX);
                                                        setTimeout(() => {
                                                            resolve();
                                                        }, 1000);
                                                    })
                                            }}
                                            onRowClick={(event, rowData, togglePanel) => console.log(event)}
                                            options={{
                                                filtering: false,
                                                // tableLayout: "fixed",
                                                actionsColumnIndex: -1,
                                                showTitle: false,
                                                search: false,
                                                toolbar: true,
                                                filterCellStyle: { fontSize: "8px" },
                                                hideFilterIcons: true,
                                                searchFieldVariant: "standard",
                                                rowStyle: { fontSize: "13px" },
                                                paging: false,
                                                paginationType: "stepped",
                                                paginationPosition: "bottom",
                                                showFirstLastPageButtons: false,
                                                exportButton: false,
                                                columnsButton: false,
                                                selection: false,
                                                headerStyle: {
                                                    position: "sticky",
                                                    top: "0",
                                                    borderBottom: "2px solid black"
                                                },
                                                maxBodyHeight: "600px"

                                            }}
                                        /> */}
                                    </div>

                                </div>





                            </fieldset>




                        </div>
                        {/* Main Card Body--/-- */}

                        {/* Main Card footer */}
                        <div className="py-3 px-6 border-t text-start border-gray-300 text-gray-600">
                            <div className="flex gap-x-3">
                                <button
                                    type="button"
                                    data-mdb-ripple="true"
                                    data-mdb-ripple-color="light"
                                    className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out"
                                    onClick={() => { saveVTdata() }}
                                >Save & Continue</button>

                                <button
                                    type="button"
                                    data-mdb-ripple="true"
                                    data-mdb-ripple-color="light"
                                    className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out"
                                    onClick={() => { }}
                                >Save & Clear</button>

                                <button
                                    type="button"
                                    data-mdb-ripple="true"
                                    data-mdb-ripple-color="light"
                                    className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out"
                                    onClick={() => { }}
                                >Clear</button>
                            </div>

                        </div>
                        {/* Main Card footer--/-- */}
                    </div>
                    {/* Main Card--/-- */}

                </div>
            </div>

        </div >
        // return wrapper div--/--
    )
}

export default JournalVoucher