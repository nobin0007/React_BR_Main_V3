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
    TextField,
    Slider,
    Select,
    MenuItem,
    IconButton,
    Tooltip,
    Stack
} from "@mui/material";
import { Delete, Edit } from '@mui/icons-material';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';


import { useForm, Controller } from "react-hook-form";

import Popper from "@material-ui/core/Popper";

import { useStateContext } from '../../contexts/ContextProvider';
// import muiStyleCustom from '../muiStyleCustom';
import { redirect, useNavigate } from 'react-router-dom';

const VoucherEdit = (props) => {
    // ---[show/hide panel,navbar]---
    const navigate = useNavigate();

    const { voucherToEdit, setVoucherToEdit, jvToEdit, setJvToEdit, contraVouchToEdit, setContraVouchToEdit, debitVouchToEdit, setDebitVouchToEdit, creditVouchToEdit, setCreditVouchToEdit, vouchAgtVouchToEdit, setVouchAgtVouchToEdit } = useStateContext();
    setJvToEdit(0);
    setContraVouchToEdit(0);
    setDebitVouchToEdit(0);
    setCreditVouchToEdit(0);
    setVouchAgtVouchToEdit(0);

    var userInfo = { Name: '', LocationId: '' };
    if (localStorage.getItem("userInfo")) {
        userInfo = JSON.parse(localStorage.getItem("userInfo"));
        console.log("Session User");
        console.log(userInfo);
    }
    if (!(localStorage.getItem("userInfo"))) {
        navigate('/');
    }

    const { setShowPanel, setShowNavbar } = useStateContext();
    useEffect(() => {
        setShowPanel(props.panelShow);
        setShowNavbar(props.navbarShow);
    }, [])



    const { register, getValues, reset, control, setValue } = useForm();
    // const referenceRef = useRef(null);
    // const descriptionRef = useRef(null);
    const vouchNoInpRef = useRef(null);

    // ---[datepicker states]---

    const [dateFrom, setDateFrom] = useState(dayjs());
    const [dateTo, setDateTo] = useState(dayjs());

    const [voucherNumberOptions, setVoucherNumberOptions] = useState([]);

    const [voucherNumber, setVoucherNumber] = useState({ VoucherNo: '', VoucherId: '' });

    const [voucherTypeOutput, setVoucherTypeOutput] = useState({ Name: 'JV' });


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

    useEffect(() => {
        if (dateTo && dateFrom && voucherTypeOutput) {
            console.log("1st if e dhukse");

            if (dateFrom.diff(dateTo) <= 0) {
                console.log("2nd if e dhukse");
                let dto = dayjs(dateTo).format('YYYY/MM/DD') + " 23:59";
                let dfrom = dayjs(dateFrom).format('YYYY/MM/DD') + " 00:00";

                var sendInfo = { DateTo: dto, DateFrom: dfrom, VoucherType: voucherTypeOutput.Name, LocationId: userInfo.LocationId, CompanyId: userInfo.CompanyId }
                console.log(sendInfo);
                fetch(`${userInfo.Ip}/API/VoucherEdit/Get_VoucherNo?dateTo=${dto}&dateFrom=${dfrom}&vocuherType=${voucherTypeOutput.Name}&locationId=${userInfo.LocationId}&companyId=${userInfo.CompanyId}`)
                    .then(res =>
                        res.json()
                        // console.log(res);
                    )
                    .then((data) => {
                        console.log(data);
                        setVoucherNumberOptions(data);
                    })
                console.log("fetch call hobe from VoucherType");
            }
            else { setVoucherNumberOptions([]) }
        }
        else { setVoucherNumberOptions([]) }

    }, [])

    const redirectToEditJV = () => {
        console.log("rupom");
        setJvToEdit(voucherNumber); //contextApi state
        setContraVouchToEdit(0);
        setDebitVouchToEdit(0);
        setCreditVouchToEdit(0);
        setVouchAgtVouchToEdit(0);
        if (voucherNumber?.VoucherId) {
            navigate('/journalVoucher');
        }
        else {
            toast.error("You must select a voucher no. to edit!");
        }

    }
    const redirectToDebitVoucher = () => {
        console.log("rupom");
        setDebitVouchToEdit(voucherNumber);
        setJvToEdit(0);
        setContraVouchToEdit(0);
        setCreditVouchToEdit(0);
        setVouchAgtVouchToEdit(0);

        if (voucherNumber?.VoucherId) {
            navigate('/debitVoucher');
        }
        else {
            toast.error("You must select a voucher no. to edit!");
        }

        ;
    }
    const redirectToCreditVoucher = () => {
        console.log("rupom");
        setCreditVouchToEdit(voucherNumber);
        setJvToEdit(0);
        setContraVouchToEdit(0);
        setDebitVouchToEdit(0);
        setVouchAgtVouchToEdit(0);

        if (voucherNumber?.VoucherId) {
            navigate('/creditVoucher');
        }
        else {
            toast.error("You must select a voucher no. to edit!");
        }
    }
    const redirectToContraVoucher = () => {
        console.log("rupom");
        setContraVouchToEdit(voucherNumber);
        setJvToEdit(0);
        setDebitVouchToEdit(0);
        setCreditVouchToEdit(0);
        setVouchAgtVouchToEdit(0);

        if (voucherNumber?.VoucherId) {
            navigate('/contraVoucher');
        }
        else {
            toast.error("You must select a voucher no. to edit!");
        }
    }

    const redirectToVouchAgtVouch = () => {
        console.log("rupom");
        setVouchAgtVouchToEdit(voucherNumber);
        setJvToEdit(0);
        setContraVouchToEdit(0);
        setDebitVouchToEdit(0);
        setCreditVouchToEdit(0);

        if (voucherNumber?.VoucherId) {
            navigate('/vouchAgtVouch');
        }
        else {
            toast.error("You must select a voucher no. to edit!");
        }
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
                            Edit Voucher
                        </div>
                        {/* Main Card header--/-- */}

                        {/* Main Card body */}
                        <div className=" px-6 pb-4 text-start grid grid-cols-4 gap-4 mt-2">

                            <div className="col-span-4">

                                <form className='' >
                                    <div className='w-full grid-cols-3 grid gap-x-4 gap-y-1'>
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
                                                    console.log(voucherTypeOutput);
                                                    setDateFrom(newValue);
                                                    if (newValue && dateTo && voucherTypeOutput) {
                                                        if (newValue.diff(dateTo) <= 0) {
                                                            let dfrom = dayjs(newValue).format('YYYY/MM/DD') + " 00:00";
                                                            let dto = dayjs(dateTo).format('YYYY/MM/DD') + " 23:59";

                                                            var sendInfo = { DateTo: dto, DateFrom: dfrom, VoucherType: voucherTypeOutput.Name, LocationId: userInfo.LocationId, CompanyId: userInfo.CompanyId }
                                                            console.log(sendInfo);
                                                            fetch(`${userInfo.Ip}/API/VoucherEdit/Get_VoucherNo?dateTo=${dto}&dateFrom=${dfrom}&vocuherType=${voucherTypeOutput.Name}&locationId=${userInfo.LocationId}&companyId=${userInfo.CompanyId}`)
                                                                .then(res =>
                                                                    res.json()
                                                                    // console.log(res);
                                                                )
                                                                .then((data) => {
                                                                    console.log(data);
                                                                    setVoucherNumberOptions(data);
                                                                })

                                                            console.log("fetch call hobe from dateFrom");

                                                        }
                                                        else { setVoucherNumberOptions([]) }
                                                    }
                                                    else { setVoucherNumberOptions([]) }
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
                                                    if (newValue && dateFrom && voucherTypeOutput) {
                                                        if (dateFrom.diff(newValue) <= 0) {
                                                            let dto = dayjs(newValue).format('YYYY/MM/DD') + " 23:59";
                                                            let dfrom = dayjs(dateFrom).format('YYYY/MM/DD') + " 00:00";

                                                            console.log(dto);
                                                            var sendInfo = { DateTo: dto, DateFrom: dfrom, VoucherType: voucherTypeOutput.Name, LocationId: userInfo.LocationId, CompanyId: userInfo.CompanyId }
                                                            console.log(sendInfo);
                                                            fetch(`${userInfo.Ip}/API/VoucherEdit/Get_VoucherNo?dateTo=${dto}&dateFrom=${dfrom}&vocuherType=${voucherTypeOutput.Name}&locationId=${userInfo.LocationId}&companyId=${userInfo.CompanyId}`)
                                                                .then(res =>
                                                                    res.json()
                                                                    // console.log(res);
                                                                )
                                                                .then((data) => {
                                                                    console.log(data);
                                                                    setVoucherNumberOptions(data);
                                                                })

                                                            console.log("fetch call hobe from dateFrom");

                                                        }
                                                        else { setVoucherNumberOptions([]) }
                                                    }
                                                    else { setVoucherNumberOptions([]) }
                                                }}
                                            />
                                        </LocalizationProvider>

                                        <Autocomplete
                                            id="JVtype"
                                            clearOnEscape
                                            size="small"

                                            options={[{ Name: 'JV' }]}
                                            // defaultValue={(locationOutput) ? locationOutput : { Name: "", LocationId: "" }}
                                            // value={ }

                                            defaultValue={{ Name: 'JV' }}
                                            getOptionLabel={(option) => (option.Name) ? option.Name : ""}

                                            onChange={(e, selectedOption) => {
                                                console.log(selectedOption);
                                                setVoucherTypeOutput(selectedOption);
                                                if (dateTo && dateFrom && voucherTypeOutput) {
                                                    console.log("1st if e dhukse");

                                                    if (dateFrom.diff(dateTo) <= 0) {
                                                        console.log("2nd if e dhukse");

                                                        let dto = dayjs(dateTo).format('YYYY/MM/DD') + " 23:59";
                                                        let dfrom = dayjs(dateFrom).format('YYYY/MM/DD') + " 00:00";

                                                        var sendInfo = { DateTo: dto, DateFrom: dfrom, VoucherType: voucherTypeOutput.Name, LocationId: userInfo.LocationId, CompanyId: userInfo.CompanyId }
                                                        console.log(sendInfo);
                                                        fetch(`${userInfo.Ip}/API/VoucherEdit/Get_VoucherNo?dateTo=${dto}&dateFrom=${dfrom}&vocuherType=${voucherTypeOutput.Name}&locationId=${userInfo.LocationId}&companyId=${userInfo.CompanyId}`)
                                                            .then(res =>
                                                                res.json()
                                                                // console.log(res);
                                                            )
                                                            .then((data) => {
                                                                console.log(data);
                                                                setVoucherNumberOptions(data);
                                                            })
                                                        console.log("fetch call hobe from VoucherType");
                                                    }
                                                    else { setVoucherNumberOptions([]) }
                                                }
                                                else { setVoucherNumberOptions([]) }
                                                // setLocationOutput(selectedOption);
                                            }}
                                            renderInput={(params) => (
                                                <TextField
                                                    sx={{ width: '100%', marginTop: 1 }}
                                                    {...params}
                                                    {...register("JVtype")}

                                                    InputProps={{ ...params.InputProps, style: { fontSize: 13 } }}
                                                    InputLabelProps={{
                                                        ...params.InputLabelProps, style: { fontSize: 14 },

                                                    }}
                                                    // onChange={(newValue) => {
                                                    //     console.log("autocomp Changed")
                                                    // }}
                                                    label="Voucher Type" variant="standard" />
                                            )}
                                        />

                                        <Autocomplete
                                            id="Voucher No."
                                            clearOnEscape
                                            size="small"
                                            className='col-span-3'
                                            options={voucherNumberOptions}
                                            // defaultValue={(locationOutput) ? locationOutput : { Name: "", LocationId: "" }}
                                            value={voucherNumber}

                                            // defaultValue={locationOutput?.Name ? locationOutput?.Name : ''}
                                            getOptionLabel={(option) => (option.VoucherNo) ? option.VoucherNo : ""}

                                            onChange={(e, selectedOption) => {
                                                console.log(selectedOption);
                                                setVoucherNumber(selectedOption);
                                                // setLocationOutput(selectedOption);
                                            }}
                                            // defaultValue={top100Films[2]}
                                            renderInput={(params) => (
                                                <TextField
                                                    sx={{ width: '100%', marginTop: 1 }}
                                                    {...params}
                                                    {...register("voucherNo")}

                                                    InputProps={{ ...params.InputProps, style: { fontSize: 13 } }}
                                                    InputLabelProps={{
                                                        ...params.InputLabelProps, style: { fontSize: 14 },

                                                    }}
                                                    onChange={(newValue) => {
                                                        console.log("autocomp Changed")
                                                    }}
                                                    label="Voucher No." variant="standard" />
                                            )}
                                        />

                                    </div>
                                </form>
                            </div>

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
                                    onClick={redirectToEditJV}
                                >Edit Journal Voucher</button>
                                <button
                                    type="button"
                                    data-mdb-ripple="true"
                                    data-mdb-ripple-color="light"
                                    className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out"
                                    onClick={redirectToDebitVoucher}
                                >Edit Debit Voucher</button>
                                <button
                                    type="button"
                                    data-mdb-ripple="true"
                                    data-mdb-ripple-color="light"
                                    className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out"
                                    onClick={redirectToCreditVoucher}
                                >Edit Credit Voucher</button>

                                <button
                                    type="button"
                                    data-mdb-ripple="true"
                                    data-mdb-ripple-color="light"
                                    className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out"
                                    onClick={redirectToContraVoucher}
                                >Edit Contra Voucher</button>

                                <button
                                    type="button"
                                    data-mdb-ripple="true"
                                    data-mdb-ripple-color="light"
                                    className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out"
                                    onClick={redirectToVouchAgtVouch}
                                >Edit Voucher Against Vocher</button>

                                {/* <button
                                    type="button"
                                    data-mdb-ripple="true"
                                    data-mdb-ripple-color="light"
                                    className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out"
                                    onClick={() => { }}
                                >Clear</button> */}

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

export default VoucherEdit