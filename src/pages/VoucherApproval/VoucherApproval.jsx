// import { React, useState, useEffect } from 'react';
import { React, useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useStateContext } from '../../contexts/ContextProvider';

import { toast } from 'react-toastify';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import FilledInput from '@mui/material/FilledInput';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import AccountCircle from '@mui/icons-material/AccountCircle';
import axios from 'axios';
import Swal from 'sweetalert2';
import {
    Autocomplete,
    Box,
    Modal,
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
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';


import { useForm, Controller } from "react-hook-form";
import './VoucherApproval.css';

// material table
import MaterialReactTable, { MRT_ColumnDef } from 'material-react-table';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

import Popper from "@material-ui/core/Popper";

// import muiStyleCustom from '../muiStyleCustom';
import { redirect, useNavigate } from 'react-router-dom';
import VoucherPreview from '../../components/VoucherPreview/VoucherPreview';



const VoucherApproval = (props) => {

    // ---[datepicker states]---
    const { register, getValues, reset, control, setValue } = useForm();
    const [dateFrom, setDateFrom] = useState(dayjs());
    const [dateTo, setDateTo] = useState(dayjs());
    const [voucherTableData, setVoucherTableData] = useState([]);

    const [voucherTypeOutput, setVoucherTypeOutput] = useState({ Name: 'All Voucher Types', Value: 'nothing' });
    const [voucherTypeOptions, setVoucherTypeOptions] = useState([{ Name: 'All Voucher Types', Value: 'nothing' }]);

    const [locationOutput, setLocationOutput] = useState({ LocationId: 0, Name: 'All Location' });
    const [locationOptions, setLocationOptions] = useState([{ LocationId: 0, Name: 'All Location' }]);

    //selection state for material-react-table
    const [rowSelection, setRowSelection] = useState({});
    const [voucherToPreview, setVoucherToPreview] = useState({ VoucherNo: '', VoucherId: '' });

    // ---[show/hide panel,navbar]---
    const navigate = useNavigate();
    const { setShowPanel, setShowNavbar } = useStateContext();
    useEffect(() => {
        setShowPanel(props.panelShow);
        setShowNavbar(props.navbarShow);
    }, [])

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

    useEffect(() => {
        let indexArray = Object.keys(rowSelection).map(Number);
        if (indexArray.length > 1) {
            setVoucherToPreview({ VoucherNo: voucherTableData[indexArray[0]].VoucherNo, VoucherId: voucherTableData[indexArray[0]].VoucherId });
        }
        else if (indexArray.length == 1) {
            setVoucherToPreview({ VoucherNo: voucherTableData[indexArray[0]].VoucherNo, VoucherId: voucherTableData[indexArray[0]].VoucherId });
        }
        else {
            setVoucherToPreview({ VoucherNo: '', VoucherId: '' });
        }

    }, [rowSelection])

    const voucherTableColumns = [
        {
            accessorKey: 'VoucherNo',
            header: 'Voucher No',
            // enableSorting: false,
            // enableColumnActions: false,
            Cell: ({ cell, column, table }) => (
                <TextField
                    sx={{ width: '100%' }}
                    value={(cell.getValue()) ? cell.getValue() : ""}
                    InputProps={{ style: { fontSize: 13 }, disableUnderline: true, readOnly: true }}
                    variant="standard" size="small" />)

        },
        {
            accessorKey: 'LocationName',
            header: 'Location Name',
            // enableSorting: false,
            // enableColumnActions: false,
            Cell: ({ cell, column, table }) => (
                <TextField
                    sx={{ width: '100%' }}
                    value={(cell.getValue()) ? cell.getValue() : ""}
                    InputProps={{ style: { fontSize: 13 }, disableUnderline: true, readOnly: true }}
                    variant="standard" size="small" />)

        },
        {
            accessorKey: 'VoucherType',
            header: 'Type',
            Cell: ({ cell, column, table }) => (
                <TextField
                    sx={{ width: '100%' }}
                    value={(cell.getValue()) ? cell.getValue() : ""}
                    InputProps={{ style: { fontSize: 13 }, disableUnderline: true, readOnly: true }}
                    variant="standard" size="small" />)
        },
        {
            accessorKey: 'VoucherDate',
            header: 'Date',
            Cell: ({ cell, column, table }) => (
                <TextField
                    sx={{ width: '100%' }}
                    value={(cell.getValue()) ? cell.getValue() : ""}
                    InputProps={{ style: { fontSize: 13 }, disableUnderline: true, readOnly: true }}
                    variant="standard" size="small" />)
        },
        {
            accessorKey: 'VoucherTime',
            header: 'Time',
            Cell: ({ cell, column, table }) => (
                <TextField
                    sx={{ width: '100%' }}
                    value={(cell.getValue()) ? cell.getValue() : ""}
                    InputProps={{ style: { fontSize: 13 }, disableUnderline: true, readOnly: true }}
                    variant="standard" size="small" />)
        },
        {
            accessorKey: 'PreparedBy',
            header: 'Prepared By',
            Cell: ({ cell, column, table }) => (
                <TextField
                    sx={{ width: '100%' }}
                    value={(cell.getValue()) ? cell.getValue() : ""}
                    InputProps={{ style: { fontSize: 13 }, disableUnderline: true, readOnly: true }}
                    variant="standard" size="small" />)
        },
        {
            accessorKey: 'Description',
            header: 'Voucher Description',
            Cell: ({ cell, column, table }) => (
                <TextField
                    sx={{ width: '100%' }}
                    value={(cell.getValue()) ? cell.getValue() : ""}
                    InputProps={{ style: { fontSize: 13 }, disableUnderline: true, readOnly: true }}
                    variant="standard" size="small" />)
        },
        {
            accessorKey: 'Amount',
            header: 'Amount',
            Cell: ({ cell, column, table }) => (
                <TextField
                    sx={{ width: '100%' }}
                    value={(cell.getValue()) ? cell.getValue() : ""}
                    InputProps={{ style: { fontSize: 13 }, disableUnderline: true, readOnly: true }}
                    variant="standard" size="small" />)
        },

    ]

    useEffect(() => {
        //Fetch locations 
        fetch(`${userInfo.Ip}/API/VoucherApproval/Get_Location?companyId=${userInfo.CompanyId}`)
            .then(res =>
                res.json()
                // console.log(res);
            )
            .then((data) => {
                console.log('Get location options fetch:-->')
                console.log(data);
                let tempArr = [...locationOptions];
                data.forEach(element => {
                    tempArr.push(element);
                });
                setLocationOptions(tempArr);
                console.log('locationOptions');
                console.log(locationOptions)
            })

        //Voucher type er options ana hoise
        fetch(`${userInfo.Ip}/API/VoucherApproval/Get_VoucherTypes`)
            .then(res =>
                res.json()
                // console.log(res);
            )
            .then((data) => {
                console.log('voucher type options fetch:-->')
                console.log(data);
                let tempArr = [...voucherTypeOptions];
                data.forEach(element => {
                    tempArr.push(element);
                });
                setVoucherTypeOptions(tempArr);
            })

        //vouchers table er data ana hoise
        fetchDataForVoucherTable();

    }, [])

    const fetchDataForVoucherTable = () => {
        if (dateTo && dateFrom) {
            if (dateFrom.diff(dateTo) <= 0) {
                let dto = dayjs(dateTo).format('YYYY/MM/DD') + " 23:59";
                let dfrom = dayjs(dateFrom).format('YYYY/MM/DD') + " 00:00";

                fetch(`${userInfo.Ip}/API/VoucherApproval/Get_VouchersForApproval?dateFrom=${dfrom}&dateTo=${dto}&voucherType=${voucherTypeOutput.Value}&locationId=${locationOutput.LocationId}&companyId=${userInfo.CompanyId}`)
                    .then(res =>
                        res.json()
                        // console.log(res);
                    )
                    .then((data) => {
                        console.log('voucher table datas fetch:-->');
                        console.log(data);
                        setVoucherTableData(data);
                    })
            }
            else { setVoucherTableData([]) }
        }
        else { setVoucherTableData([]) }
    }

    const approveVoucherFunc = () => {
        console.log('approving voucher, readin mrt selected state');
        console.log(rowSelection);
        let indexArray = Object.keys(rowSelection).map(Number);
        console.log(indexArray);
        let selectedVouchers = [];
        for (let i = 0; i < indexArray.length; i++) {
            selectedVouchers.push({ VoucherId: voucherTableData[indexArray[i]].VoucherId });
        }
        let voucherFullData = {
            Voucher: selectedVouchers,
            UserInfos: userInfo
        };

        axios.post(`${userInfo.Ip}/API/VoucherApproval/Approve_Voucher`, voucherFullData)
            .then(res => {
                console.log("insert er axios!!")
                if (res) {
                    console.log(res);
                    if (res.status == 200) {
                        // let tempTitle = '';
                        // if (voucherFullData.Voucher.length > 1) {
                        //     let vouchersInString = voucherFullData.Voucher.join(', \n');
                        //     tempTitle = `Voucher No: \n${vouchersInString} \n has been approved successfully!`;
                        // }
                        // else if (voucherFullData.Voucher.length > 0) {
                        //     tempTitle = `Voucher No: \n${voucherFullData.Voucher[0]} \n has been approved successfully!`;
                        // }

                        //reset selection of rows
                        setRowSelection({});
                        //re fetch the voucher table data
                        fetchDataForVoucherTable();


                        Swal.fire({
                            title: `Your selected vouchers have been approved successfully!`,
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
                    }
                }
                // let vouchers=[voucherTableData[]]
            })
    }

    const voucherPrevFunc = () => {
        console.log('dukhes')
        if (voucherToPreview?.VoucherId) {
            let indexArray = Object.keys(rowSelection).map(Number);
            if (indexArray.length > 1) {
                toast.warning('Select one voucher at a time to preview!');
            }
            else if (indexArray.length == 1) {
                handlePreviewModalOpen();
            }
        }
        else {
            toast.warning("You haven't selected any voucher to preview!");

        }


    }

    const clearFunc = () => {

    }

    const [vouchPreviewModalOpen, setVouchPreviewModalOpen] = useState(false);
    const handlePreviewModalOpen = () => setVouchPreviewModalOpen(true);
    const handlePreviewModalClose = () => {
        setShowPanel(true);
        setShowNavbar(true);
        setVouchPreviewModalOpen(false);
    }

    const prevVouchSelectionModalstyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '98%',
        overflow: 'scroll',
        maxHeight: '98%',
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };


    //optionally access the underlying virtualizer instance
    const rowVirtualizerInstanceRef = useRef(null);

    const [isLoading, setIsLoading] = useState(true);
    const [sorting, setSorting] = useState([]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            //   setData(makeData(10_000));
            fetchDataForVoucherTable();
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        //scroll to the top of the table when the sorting changes
        try {
            rowVirtualizerInstanceRef.current?.scrollToIndex?.(0);
        } catch (error) {
            console.error(error);
        }
    }, [sorting]);

    return (
        // return wrapper div
        <div className='mt-16 md:mt-2'>

            <div className="m-2 flex justify-center">
                <div className="block w-11/12 ">

                    {/* Main Card */}
                    <div className="block rounded-lg shadow-lg bg-white dark:bg-secondary-dark-bg  text-center">
                        {/* Main Card header */}
                        <div className="py-3 'bg-white text-xl dark:text-gray-200 text-start px-6 border-b border-gray-300">
                            Voucher Approval
                        </div>
                        {/* Main Card header--/-- */}

                        {/* Main Card body */}
                        <div className=" px-6 pb-4 text-start grid grid-cols-4 gap-4 mt-2">

                            <div className="col-span-4">

                                <form className='' >
                                    <div className='w-full grid-cols-4 grid gap-x-4 gap-y-1'>
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


                                                            fetch(`${userInfo.Ip}/API/VoucherApproval/Get_VouchersForApproval?dateFrom=${dfrom}&dateTo=${dto}&voucherType=${voucherTypeOutput.Value}&locationId=${locationOutput.LocationId}&companyId=${userInfo.CompanyId}`)
                                                                .then(res =>
                                                                    res.json()
                                                                    // console.log(res);
                                                                )
                                                                .then((data) => {
                                                                    console.log(data);
                                                                    setVoucherTableData(data);
                                                                })
                                                        }
                                                        else { setVoucherTableData([]) }
                                                    }
                                                    else { setVoucherTableData([]) }
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

                                                            fetch(`${userInfo.Ip}/API/VoucherApproval/Get_VouchersForApproval?dateFrom=${dfrom}&dateTo=${dto}&voucherType=${voucherTypeOutput.Value}&locationId=${locationOutput.LocationId}&companyId=${userInfo.CompanyId}`)
                                                                .then(res =>
                                                                    res.json()
                                                                    // console.log(res);
                                                                )
                                                                .then((data) => {
                                                                    console.log(data);
                                                                    setVoucherTableData(data);
                                                                })
                                                        }
                                                        else { setVoucherTableData([]) }
                                                    }
                                                    else { setVoucherTableData([]) }
                                                }}
                                            />
                                        </LocalizationProvider>

                                        <Autocomplete
                                            id="VoucherType"
                                            clearOnEscape
                                            size="small"

                                            options={voucherTypeOptions}
                                            // defaultValue={(locationOutput) ? locationOutput : { Name: "", LocationId: "" }}
                                            // value={ }

                                            defaultValue={{ Name: 'All Voucher Types', Value: null }}
                                            getOptionLabel={(option) => (option.Name) ? option.Name : ""}

                                            onChange={(e, selectedOption) => {
                                                setVoucherTypeOutput(selectedOption);
                                                if (dateTo && dateFrom) {
                                                    if (dateFrom.diff(dateTo) <= 0) {
                                                        let dto = dayjs(dateTo).format('YYYY/MM/DD') + " 23:59";
                                                        let dfrom = dayjs(dateFrom).format('YYYY/MM/DD') + " 00:00";

                                                        fetch(`${userInfo.Ip}/API/VoucherApproval/Get_VouchersForApproval?dateFrom=${dfrom}&dateTo=${dto}&voucherType=${selectedOption.Value}&locationId=${locationOutput.LocationId}&companyId=${userInfo.CompanyId}`)
                                                            .then(res =>
                                                                res.json()
                                                            )
                                                            .then((data) => {
                                                                console.log(data);
                                                                setVoucherTableData(data);
                                                            })

                                                    }
                                                    else { setVoucherTableData([]) }
                                                }
                                                else { setVoucherTableData([]) }
                                                // setLocationOutput(selectedOption);
                                            }}
                                            renderInput={(params) => (
                                                <TextField
                                                    sx={{ width: '100%', marginTop: 1 }}
                                                    {...params}
                                                    {...register("VoucherType")}

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
                                            id="location"
                                            clearOnEscape
                                            size="small"

                                            options={locationOptions}
                                            // defaultValue={(locationOutput) ? locationOutput : { Name: "", LocationId: "" }}
                                            defaultValue={{ LocationId: null, Name: 'All Location' }}
                                            // defaultValue={locationOutput?.Name ? locationOutput?.Name : ''}
                                            getOptionLabel={(option) => (option.Name) ? option.Name : ""}

                                            onChange={(e, selectedOption) => {
                                                setLocationOutput(selectedOption);
                                                if (dateTo && dateFrom) {
                                                    if (dateFrom.diff(dateTo) <= 0) {
                                                        let dto = dayjs(dateTo).format('YYYY/MM/DD') + " 23:59";
                                                        let dfrom = dayjs(dateFrom).format('YYYY/MM/DD') + " 00:00";

                                                        fetch(`${userInfo.Ip}/API/VoucherApproval/Get_VouchersForApproval?dateFrom=${dfrom}&dateTo=${dto}&voucherType=${voucherTypeOutput.Value}&locationId=${selectedOption.LocationId}&companyId=${userInfo.CompanyId}`)
                                                            .then(res =>
                                                                res.json()
                                                            )
                                                            .then((data) => {
                                                                console.log(data);
                                                                setVoucherTableData(data);
                                                            })

                                                    }
                                                    else { setVoucherTableData([]) }
                                                }
                                                else { setVoucherTableData([]) }
                                                // setLocationOutput(selectedOption);
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

                                        <div className='col-span-4 '>
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
                                                    // initialState={{ density: 'compact' }}
                                                    enableStickyHeader
                                                    enableStickyFooter
                                                    enableColumnResizing
                                                    enableRowSelection
                                                    onRowSelectionChange={setRowSelection}
                                                    // state={{ rowSelection }}
                                                    // muiTableContainerProps={{ sx: { height: '180px' } }} //ekhane table er data height
                                                    muiTableHeadCellProps={{
                                                        //simple styling with the `sx` prop, works just like a style prop in this example
                                                        sx: {
                                                            fontWeight: 'Bold',
                                                            fontSize: '13px',
                                                        },
                                                        // align: 'left',
                                                    }}
                                                    enableRowVirtualization
                                                    muiTableContainerProps={{ sx: { maxHeight: '450px' } }}
                                                    onSortingChange={setSorting}
                                                    state={{ rowSelection, isLoading, sorting }}
                                                    rowVirtualizerInstanceRef={rowVirtualizerInstanceRef} //optional
                                                    rowVirtualizerProps={{
                                                        overscan: 10, //adjust the number or rows that are rendered above and below the visible area of the table
                                                        estimateSize: () => 100, //if your rows are taller than normal, try tweaking this value to make scrollbar size more accurate
                                                    }}//optionally customize the virtualizer
                                                />
                                            </div>
                                        </div>

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
                                    onClick={approveVoucherFunc}
                                >Approve Voucher</button>
                                <button
                                    type="button"
                                    data-mdb-ripple="true"
                                    data-mdb-ripple-color="light"
                                    className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out"
                                    onClick={voucherPrevFunc}
                                >Preview</button>
                                <button
                                    type="button"
                                    data-mdb-ripple="true"
                                    data-mdb-ripple-color="light"
                                    className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out"
                                    onClick={clearFunc}
                                >Clear</button>
                            </div>

                        </div>
                        {/* Main Card footer--/-- */}
                    </div>
                    {/* Main Card--/-- */}

                </div>
            </div>

            {/* // modals --- out of html normal body/position */}
            <Modal
                open={vouchPreviewModalOpen}
                onClose={handlePreviewModalClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={prevVouchSelectionModalstyle}>
                    <VoucherPreview panelShow={false} navbarShow={false} voucherToPreview={voucherToPreview} />
                    <button
                        type="button"
                        data-mdb-ripple="true"
                        data-mdb-ripple-color="light"
                        className=" w-[5%] mt-5 ml-20 block py-1.5 bg-blue-600 text-white font-medium text-xs leading-tight rounded shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out"
                        onClick={() => {
                            handlePreviewModalClose();
                        }}
                    >Close
                    </button>
                </Box>
            </Modal>


        </div >
        // return wrapper div--/--
    )


}

export default VoucherApproval