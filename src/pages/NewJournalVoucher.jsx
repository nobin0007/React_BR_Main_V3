import React from 'react';
import axios from 'axios';
import { useState, useEffect, useCallback } from 'react';
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


import { useForm } from "react-hook-form";
import './NewJournalVoucher.css';

// material table
import MaterialReactTable, { MRT_ColumnDef } from 'material-react-table';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

import Popper from "@material-ui/core/Popper";

import AttachmentLoader from '../components/AttachmentLoader';

import { useStateContext } from '../contexts/ContextProvider';
// import muiStyleCustom from '../muiStyleCustom';
import { useNavigate } from 'react-router-dom';

const NewJournalVoucher = (props) => {
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

    const [renderVar, setRenderVar] = useState(true);
    const [voucherTableData, setVoucherTableData] = useState([]);
    const [location, setLocation] = useState([]);
    const [accountsHead, setAccountsHead] = useState([]);
    const [project, setProject] = useState([]);

    const [allNames, setAllNames] = useState([]);
    const [total, setTotal] = useState({ debit: 0, credit: 0 });
    const [debitCreditWatch, setdebitCreditWatch] = useState(true);

    // const [userSession, setUserSession] = useState([]);
    const navigate = useNavigate();
    const [locationOutput, setLocationOutput] = useState({ Name: userInfo.LocationName, LocationId: userInfo.LocationId });

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
            // enableResizing: false,
            muiTableHeadCellProps: ({ column }) => ({
                align: 'left',
            }),
            Cell: ({ cell }) => {
                return (
                    <Tooltip arrow placement="right" title="Delete">
                        <IconButton color="error" onClick={() => handleDeleteRow(cell.row.index)}>
                            <Delete />
                        </IconButton>
                    </Tooltip>)
            },
        },
        {
            accessorKey: 'accountHead',
            header: 'Account Head',
            Cell: ({ cell }) => (
                <Autocomplete
                    id=""
                    PopperComponent={PopperMy}
                    clearOnEscape
                    disableClearable
                    size="small"
                    options={accountsHead}
                    value={(cell.getValue()) ? (cell.getValue()) : { Name: "", AccountsId: "" }}
                    onChange={(e, selectedOption) => {
                        console.log("cell");
                        console.log(cell.row);
                        handleAccountHeadSelect(cell.row.index, selectedOption);
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
                            sx={{ width: "100%" }}
                            {...params}
                            InputProps={{ ...params.InputProps, style: { fontSize: 13 }, disableUnderline: true }}
                            variant="standard"
                            size="small"
                        />}
                />),

        },
        {
            accessorKey: 'controlAccName', //access nested data with dot notation
            header: 'Control Account',
            Cell: ({ cell, column, table }) => (
                <TextField
                    sx={{ width: '100%' }}
                    value={(cell.getValue().Name) ? (cell.getValue().Name) : ""}
                    tabIndex="-1"
                    InputProps={{ style: { fontSize: 13 }, disableUnderline: true, readOnly: true }}
                    variant="standard" size="small" />)
        },
        {
            accessorKey: 'project', //access nested data with dot notation
            header: 'Project',
            Cell: ({ cell, column, table }) => (
                <Autocomplete
                    id=""
                    PopperComponent={PopperMy}
                    clearOnEscape
                    disableClearable
                    size="small"
                    options={project}
                    value={(cell.getValue()) ? cell.getValue() : { Name: "", ProjectId: "" }}
                    onChange={(e, selectedOption) => {
                        voucherTableData[cell.row.index].project = selectedOption;
                        setVoucherTableData([...voucherTableData]);
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
                            sx={{ width: "100%" }}
                            {...params}
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
            Cell: ({ cell, column, table }) => (
                <TextField sx={{ width: '100%' }} InputProps={{ style: { fontSize: 13 }, disableUnderline: true }}
                    variant="standard" size="small"
                    inputRef={node => {
                        if (node) {
                            node.value = cell.getValue()
                        }
                    }}
                    onBlur={(e) => {
                        voucherTableData[cell.row.index].particulars = e.target.value;
                        setVoucherTableData([...voucherTableData]);
                    }} />)
        },
        {
            accessorKey: 'debit', //access nested data with dot notation
            header: 'Debit',
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
                            voucherTableData[cell.row.index].debit = e.target.value;
                            voucherTableData[cell.row.index].credit = 0;
                            setVoucherTableData([...voucherTableData]);
                            setdebitCreditWatch((prev) => !prev);
                        }

                    }} />),
            Footer: () => (
                <p className='text-[13px]'>
                    Total Debit: <label className=' text-cyan-800 text-[13px]'>{total.debit}</label>
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
                            voucherTableData[cell.row.index].credit = e.target.value;
                            voucherTableData[cell.row.index].debit = 0;
                            setVoucherTableData([...voucherTableData]);
                            setdebitCreditWatch((prev) => !prev);
                            // total.credit = total.credit + isNaN(parseInt(e.target.value)) ? 0 : parseInt(e.target.value);
                            // setTotal({ ...total });

                        }
                    }} />),
            Footer: () => (
                <p className='text-[13px]'>
                    Total Credit: <label className=' text-cyan-800 text-[13px]'>{total.credit}</label>
                </p>
            ),
        },
        {
            accessorKey: 'name', //access nested data with dot notation
            header: 'Name',
            Cell: ({ cell, column, table }) => (
                <Autocomplete
                    id=""
                    PopperComponent={PopperMy}
                    clearOnEscape
                    disableClearable
                    size="small"
                    options={allNames}
                    value={(cell.getValue()) ? cell.getValue() : { Name: "", TableName: "", Id: "" }}
                    onChange={(e, selectedOption) => {
                        voucherTableData[cell.row.index].name = selectedOption;
                        setVoucherTableData([...voucherTableData]);;
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
                            sx={{ width: "100%" }}
                            {...params}
                            InputProps={{ ...params.InputProps, style: { fontSize: 13 }, disableUnderline: true }}
                            variant="standard"
                            size="small"
                        />}
                />)
        },

    ]


    useEffect(() => {

        //----[loading 10 dummy empty rows on load]----//

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
        setVoucherTableData(tempData);
    }, [])
    useEffect(() => {
        console.log("rupom");
        console.log(total);

        console.log("state changed");
        console.log(voucherTableData);

        //----[loading 10 dummy empty rows on load]----//
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
        voucherTableData.splice(index, 1);
        setVoucherTableData([...voucherTableData]);
    }


    const handleAccountHeadSelect =
        (index, selectedOption) => {

            var prevTableDataOld = _.cloneDeep(voucherTableData);
            const url = `${userInfo.Ip}/API/JournalVoucher/Get_ControlAccount?controlAccId=${selectedOption.ControlAccountId}`;
            fetch(url, {
                method: 'GET',
            })
                .then(res => res.json())
                .then(data => {
                    console.log(data);
                    prevTableDataOld[index].accountHead = selectedOption;
                    prevTableDataOld[index].controlAccName = { Name: data[0].Name, id: data[0].ControlAccountId };
                    if (voucherTableData.length - 1 == index) {
                        prevTableDataOld.push({ accountHead: "", controlAccName: "", project: "", particulars: "", debit: "", credit: "", name: "" });
                    }
                    setVoucherTableData([...prevTableDataOld]);
                    console.log(voucherTableData);
                }
                )
        };


    const saveVTdata = () => {

        // var tableAllRows = [...mtTableData];
        //you cant copy a nested array deeply,,, jodi nested na hoilto spread operator diye korle thik thak copy hoito.. thats why clonedeep korte hoise jaate useState er state er kono reference na paay, see: https://stackoverflow.com/questions/65772279/react-copy-state-to-local-variable-without-changing-its-value
        var tableAllRows = _.cloneDeep(voucherTableData);
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
        // console.log("total credit: " + totalCredit);
        // console.log("total debit: " + totalDebit);
        console.log(attachments);

        if (voucherDtTb.length && (total.credit == total.debit) && debitCreditFlag && mandatoryFieldFlag) {

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



    const reRenderManually = () => {
        setRenderVar((prev) => !prev);
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



                            {/* <fieldset className="border border-solid border-gray-300 col-span-4 px-3 pt-1 pb-3 dark:text-slate-50"> */}
                            {/* <legend className="text-sm">Voucher Table</legend> */}

                            <div className=" grid md:grid-cols-3 grid-cols-1 gap-x-4 gap-y-1 col-span-4 pb-3">

                                {/* material-table */}

                                <div className='col-span-3 max-w-full'>
                                    {renderVar ? <div className='modifiedEditTable'>
                                        <MaterialReactTable
                                            columns={voucherTableColumns}
                                            data={voucherTableData}
                                            // editingMode="table"
                                            // enableEditing
                                            enablePagination={false}
                                            enableColumnOrdering
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
                                    </div> : ""}
                                    {/* <div className='modifiedEditTable'>
                                            <MaterialReactTable
                                                columns={voucherTableColumns}
                                                data={voucherTableData}
                                                editingMode="table"
                                                enableEditing
                                                enablePagination={false}
                                                enableColumnOrdering
                                                initialState={{ density: 'compact' }}
                                                enableStickyHeader
                                                enableColumnResizing
                                                muiTableContainerProps={{ sx: { maxHeight: '300px' } }} //ekhane table er data height
                                                muiTableHeadCellProps={{
                                                    //simple styling with the `sx` prop, works just like a style prop in this example
                                                    sx: {
                                                        fontWeight: 'Bold',
                                                        fontSize: '13px',
                                                    },
                                                    // align: 'left',
                                                }}
                                                muiTableBodyCellEditTextFieldProps={({ cell }) => ({
                                                    //onBlur is more efficient, but could use onChange instead
                                                    onBlur: (event) => {
                                                        // console.log(cell);
                                                        // handleSaveCell(cell, event.target.value);
                                                    },
                                                    // variant: 'outlined',
                                                })}

                                            />
                                        </div> */}
                                </div>

                            </div>

                            {/* </fieldset> */}
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
                                    onClick={() => reRenderManually()}
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

export default NewJournalVoucher