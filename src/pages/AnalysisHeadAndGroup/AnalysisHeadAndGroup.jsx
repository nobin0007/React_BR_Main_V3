import React from 'react';
import axios from 'axios';
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import * as _ from 'lodash';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

import {
    Autocomplete,
    Box,
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    Grid,
    Modal,
    Radio,
    RadioGroup,
    TextField,
    List,
    ListItem,
    ListItemText,
    Slider,
    Select,
    MenuItem,
    IconButton,
    Tooltip,
    Stack
} from "@mui/material";
import { Delete, Edit } from '@mui/icons-material';
import MaterialReactTable, { MRT_ColumnDef } from 'material-react-table';

import { useForm, Controller } from "react-hook-form";

import './AnalysisHeadAndGroup.css';

import Popper from "@material-ui/core/Popper";
import { ExportToCsv } from 'export-to-csv';
import { useStateContext } from '../../contexts/ContextProvider';
// import muiStyleCustom from '../muiStyleCustom';
import { redirect, useNavigate } from 'react-router-dom';

//----[loading 10 dummy empty rows on load]----//

const modalStyle = {
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


const AnalysisHeadAndGroup = (props) => {


    const [accGroupOptions, setAccGroupOptions] = useState([]);
    const [accGroupSel, setAccGroupSel] = useState({ Name: '', Id: '' });

    const [accHeadTb, setAccHeadTb] = useState([]);

    const [analysisGroupModalOpen, setAnalysisGroupModalOpen] = useState(false);
    const [analysisHeadModalOpen, setAnalysisHeadModalOpen] = useState(false);
    const [watchAnalysisGroupOptions, setWatchAnalysisGroupOptions] = useState(false);
    const [currentTrigger, setCurrentTrigger] = useState('Add');
    // const [currentHeadTbIndex, setCurrentHeadTbIndex] = useState();

    const [currentEditingIndex, setCurrentEditingIndex] = useState();
    const [currentEditingRow, setCurrentEditingRow] = useState({});



    const { register, getValues, reset, control, setValue } = useForm();


    // ---[show/hide panel,navbar]---
    const navigate = useNavigate();

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

    //---------------------------------------------------[STATES DECLARATIONS]------------------------------------------------

    const [buyerGroupOptions, setBuyerGroupOptions] = useState([]);

    // const [accAnalysis2Options, setAccAnalysis2Options] = useState(false);

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


    //--------------------[USE EFFECT FETCHING DATA]--------------------------------
    useEffect(() => {

        //fetch options for group autocomplete
        // then setAccGroupOptions()

    }, [])




    useEffect(() => {

        //---------[get autocomplete options]----------------

        // console.log(`${userInfo.Ip}/API/AnalysisHeadAndGroup/Get_AllAnalysisGroup?companyId=${userInfo.CompanyId}&locationId=${userInfo.LocationId}`);
        fetch(`${userInfo.Ip}/API/AnalysisHeadAndGroup/GetAllAnalysisGroup2?companyId=${userInfo.CompanyId}&locationId=${userInfo.LocationId}`)
            .then(res =>
                res.json()
                // console.log(res);

            )
            .then((data) => {
                console.log("Fetched data AllBuyerGroup.....................");
                console.log(data);
                setAccGroupOptions(data);
            })


        // fetch(`${userInfo.Ip}/API/AnalysisHeadAndGroup/GetAllAnalysisGroup2?companyId=${userInfo.CompanyId}&locationId=${userInfo.LocationId}`)
        //     .then(res =>
        //         res.json()
        //         // console.log(res);

        //     )
        //     .then((data) => {
        //         console.log("Fetched data AllBuyerGroup.....................");
        //         console.log(data);
        //         // setAccGroupOptions(data);
        //     })



    }, [watchAnalysisGroupOptions])






    let groupOptionTable = [
        {
            accessorKey: 'Name',
            header: 'Head/Option Name',
            // enableSorting: false,
            // enableColumnActions: false,
            Cell: ({ cell }) => (
                <TextField
                    sx={{ width: '100%' }}
                    value={(cell.getValue()) ? cell.getValue() : ""}
                    InputProps={{ style: { fontSize: 13 }, disableUnderline: true, readOnly: true }}
                    variant="standard" size="small" />
            )
        },
        {
            accessorKey: 'Code', //access nested data with dot notation
            header: 'Code',
            enableSorting: false,
            enableColumnActions: false,
            Cell: ({ cell, column, table }) => {
                // let options = [];
                // if (true) {
                //     options = [{ Name: "rupom", Id: 1 }, { Name: "rupom2", Id: 2 }];
                // }
                return (
                    <TextField
                        sx={{ width: '100%' }}
                        value={(cell.getValue()) ? cell.getValue() : ""}
                        InputProps={{ style: { fontSize: 13 }, disableUnderline: true, readOnly: true }}
                        variant="standard" size="small" />
                )
            }
        },
        {
            accessorKey: 'Notes', //access nested data with dot notation
            header: 'Notes',
            enableSorting: false,
            enableColumnActions: false,
            Cell: ({ cell, column, table }) => (
                <TextField
                    sx={{ width: '100%' }}
                    value={(cell.getValue()) ? cell.getValue() : ""}
                    InputProps={{ style: { fontSize: 13 }, disableUnderline: true, readOnly: true }}
                    variant="standard" size="small" />
            )
        },
        {
            accessorKey: 'actions', //access nested data with dot notation
            // header: 'Actions',
            header: 'Actions',
            size: 60, //small column
            enableSorting: false,
            enableColumnActions: false,
            // enableResizing: false,
            enableColumnFilter: false,
            muiTableHeadCellProps: ({ column }) => ({
                align: 'left',
            }),
            Cell: ({ cell }) => (
                (
                    <div className='flex'>
                        <Tooltip className='' arrow placement="top" title="Edit">
                            <IconButton onClick={() => {
                                handleEditRow(cell.row.index);
                            }
                            }>
                                <Edit />
                            </IconButton>
                        </Tooltip>
                        <Tooltip className='' arrow placement="top" title="Delete">
                            <IconButton onClick={() => {
                                handleDeleteRow(cell.row.index);
                            }}>
                                <Delete />
                            </IconButton>
                        </Tooltip>

                    </div>
                )
            ),
        },
    ]

    const fetchAnalysisHeadsByGroupId = (selectedOption) => {
        fetch(`${userInfo.Ip}/API/AnalysisHeadAndGroup/Get_AnalysisHeadByGroupId?companyId=${userInfo.CompanyId}&locationId=${userInfo.LocationId}&analysisGroupId=${selectedOption.Id}`)
            .then(res =>
                res.json()
                // console.log(res);

            )
            .then((data) => {
                console.log("Fetched data accountHeads.....................");
                console.log(data);
                setAccHeadTb(data);
            })
    }
    const onSelectAccGroup = (selectedOption) => {
        setAccGroupSel(selectedOption);
        //call fetch to load options for that Group Option
        fetchAnalysisHeadsByGroupId(selectedOption);
    }

    const btnAddAnalysisGroup = () => {
        console.log("Analysis group name");
        console.log(getValues().AnalysisGroupName);

        let postData = {
            CompanyId: userInfo.CompanyId,
            LocationId: userInfo.LocationId,
            EntryBy: userInfo.SecurityUserId,
            Name: getValues().AnalysisGroupName,
            Code: getValues().AnalysisGroupCode
        }
        let allOkToPost = true;

        if (!postData.Name) {
            allOkToPost = false;
            toast.warning("You must write a group name!");
        }

        if (allOkToPost) {
            axios.post(`${userInfo.Ip}/API/AnalysisHeadAndGroup/Post_NewAnalysisGroup`, postData)
                .then(res => {
                    console.log("insert er axios!!")
                    if (res.data > 0) {
                        console.log("group id ashar kotha")

                        console.log(res);
                        setAnalysisGroupModalOpen(false);
                        toast.success(`Analysis Group: "${getValues().AnalysisGroupName}" has been successfully added`);
                        setWatchAnalysisGroupOptions(((prev) => !prev));
                        reset();
                        setAccGroupSel({ Name: '', Id: '' });
                        setAccHeadTb([]);
                    }
                    else {
                        toast.error(`Error occured: ${res.data}" `);
                    }
                })
        }
    }

    const btnDeleteAccountGroup = () => {
        let allOkToDeleteGroup = true;
        if (!(accGroupSel?.Id)) {
            toast.error(`Select an Account Group to delete!`);
            allOkToDeleteGroup = false;
        }

        let postData = {
            AnalysisGroupId: accGroupSel.Id,
            Name: ""
        };

        if (allOkToDeleteGroup) {


            console.log(postData);
            Swal.fire({
                title: `CAREFUL! Are Sure? You want to delete?`,
                text: `If you delete this group, all analysis head assciated with group name:"${accGroupSel.Name}"  will get deleted and all account heads that were permitted for this Group:"${accGroupSel.Name}" will be prohibited!`,
                showDenyButton: true,
                icon: 'question',
                showCancelButton: false,
                confirmButtonText: 'Yes, I am!',
                denyButtonText: `No, I'm Not!`,
            }).then((result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {


                    fetch(`${userInfo.Ip}/API/AnalysisHeadAndGroup/CheckIfHeadExistsByGroup?analysisGroupId=${postData.AnalysisGroupId}`)
                        .then(res =>
                            res.json()
                            // console.log(res);
                        )
                        .then((data) => {
                            console.log("Checking ig the group's head exists in vouchDet analysis field.....................");
                            console.log(data);

                            if (data.length == 0) {
                                axios.post(`${userInfo.Ip}/API/AnalysisHeadAndGroup/Delete_AnalysisGroup`, postData)
                                    .then(res => {
                                        console.log("insert er axios!!")
                                        if (res.data > 0) {
                                            console.log(res);
                                            setAnalysisHeadModalOpen(false);
                                            toast.success(`Analysis Group: "${accGroupSel.Name}" and its options have been successfully deleted`);
                                            setAccGroupSel({ Name: '', Id: '' });
                                            setAccHeadTb([]);
                                            setCurrentEditingIndex();
                                            setCurrentEditingRow({});
                                            reset();
                                            setWatchAnalysisGroupOptions(((prev) => !prev));
                                        }
                                        else {
                                            toast.error(`Error occured: ${res.data}" `);
                                        }
                                    })
                            }
                            else {
                                toast.error(`This group can't be deleted, related data exists in Voucher!`);
                            }
                        })

                }
            }
            )

        }
    }

    const btnAddAnalysisHead = () => {

        console.log("Analysis head name");
        console.log(getValues().AnalysisHeadName);

        let postData = {
            CompanyId: userInfo.CompanyId,
            LocationId: userInfo.LocationId,
            EntryBy: userInfo.SecurityUserId,
            AnalysisGroupId: (accGroupSel?.Id) ? accGroupSel.Id : null,
            Name: getValues().AnalysisHeadName,
            Code: getValues().AnalysisHeadCode,
            Notes: getValues().AnalysisHeadNotes
        }
        let allOkToPost = true;

        if (!postData.AnalysisGroupId) {
            allOkToPost = false;
            toast.warning("You have to select a Analysis Group to save!");
        }
        if (!postData.Name) {
            allOkToPost = false;
            toast.warning("You have to write a Head/Option Name!");
        }


        if (allOkToPost) {
            axios.post(`${userInfo.Ip}/API/AnalysisHeadAndGroup/Post_NewAnalysisHead`, postData)
                .then(res => {
                    console.log("insert er axios!!")
                    if (res.data > 0) {
                        console.log(res);
                        // setAnalysisHeadModalOpen(false);
                        toast.success(`Analysis Head: "${getValues().AnalysisHeadName}" has been successfully added`);

                        reset(formValues => ({
                            ...formValues,
                            AnalysisHeadName: '',
                            AnalysisHeadCode: '',
                            AnalysisHeadNotes: ''
                        }))
                        // setWatchAnalysisHeadOptions(((prev) => !prev));
                        // setProdnSubPlantOptionsWatch(((prev) => !prev));
                        fetchAnalysisHeadsByGroupId(accGroupSel);
                    }
                    else {
                        toast.error(`Error occured: ${res.data}" `);
                    }
                })
        }

    }

    const btnUpdateAnalysisHead = () => {

        let tempCurrentObj = {
            AnalysisHeadId: currentEditingRow.AnalysisHeadId,
            Name: getValues().AnalysisHeadName,
            Code: getValues().AnalysisHeadCode,
            Notes: getValues().AnalysisHeadNotes
        };
        console.log(tempCurrentObj);
        let allOkToUpdate = true;

        if (JSON.stringify(tempCurrentObj) == JSON.stringify(currentEditingRow)) {
            toast.error(`You didn't change anything!`);
            allOkToUpdate = false;
        }
        else {
            if (!tempCurrentObj.Name) {
                toast.error(`You cannot update a Head without a Head/Option Name!`);
                allOkToUpdate = false;
            }
            else {
                if (!accGroupSel.Id) {
                    toast.error(`You cannot update a Head without a selecting Accounts Id!`);
                    allOkToUpdate = false;
                }
            }
        }

        let postData = tempCurrentObj;
        if (allOkToUpdate) {

            axios.post(`${userInfo.Ip}/API/AnalysisHeadAndGroup/Update_AnalysisHead`, postData)
                .then(res => {
                    console.log("insert er axios!!");
                    console.log(res);
                    if (res.data > 0) {
                        console.log(res);
                        setAnalysisHeadModalOpen(false);
                        toast.success(`Analysis Head: "${tempCurrentObj.Name}" has been successfully updated`);
                        // setWatchAnalysisHeadOptions(((prev) => !prev));
                        // setProdnSubPlantOptionsWatch(((prev) => !prev));
                        fetchAnalysisHeadsByGroupId(accGroupSel);
                        setCurrentEditingRow({});
                        setCurrentEditingIndex();
                        reset();
                    }
                    else {
                        toast.error(`Error occured: ${res.data}" `);
                    }
                })
        }

    }

    const handleEditRow = (index) => {
        console.log("edit");
        console.log(index);
        console.log(accHeadTb[index]);

        setCurrentTrigger("Edit");

        let tempCurrentRow = {
            AnalysisHeadId: accHeadTb[index].AnalysisHeadId,
            Name: accHeadTb[index].Name,
            Code: accHeadTb[index].Code,
            Notes: accHeadTb[index].Notes
        }
        setValue('AnalysisHeadName', accHeadTb[index].Name);
        setValue('AnalysisHeadCode', accHeadTb[index].Code);
        setValue('AnalysisHeadNotes', accHeadTb[index].Notes);

        setCurrentEditingIndex(index);
        setCurrentEditingRow(tempCurrentRow);
        setAnalysisHeadModalOpen(true);
    };

    const handleDeleteRow = (index) => {
        console.log("delete");
        console.log(index);
        let postData = {
            AnalysisHeadId: accHeadTb[index].AnalysisHeadId,
            Name: "",
            Code: "",
            Notes: ""
        };

        console.log("post data to delete");
        console.log(postData);
        Swal.fire({
            title: `Are you sure you want to delete?`,
            showDenyButton: true,
            icon: 'question',
            showCancelButton: false,
            confirmButtonText: 'Yes, I am!',
            denyButtonText: `No, I'm Not!`,
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                axios.post(`${userInfo.Ip}/API/AnalysisHeadAndGroup/Delete_AnalysisHead`, postData)
                    .then(res => {
                        console.log("insert er axios!!")
                        console.log(res);
                        if (res.data == 'successfullyDeleted') {
                            console.log(res);
                            toast.success(`Analysis Head: "${accHeadTb[index].Name}" has been successfully deleted!`);
                            // setWatchAnalysisHeadOptions(((prev) => !prev));
                            // setProdnSubPlantOptionsWatch(((prev) => !prev));
                            fetchAnalysisHeadsByGroupId(accGroupSel);
                            setCurrentEditingRow({});
                            setCurrentEditingIndex();
                            reset();
                        }
                        else if (res.data == 'exists') {
                            toast.error(`You can't this this Head, related data exists in Voucher`);
                        }
                        else {
                            toast.error(`Error occured: ${res.data}" `);
                        }
                    })
            }
        }
        )



    };

    return (
        // return wrapper div
        <div className='mt-16 md:mt-2'>

            <div className="m-2 flex justify-center">
                <div className="block w-11/12 ">

                    {/* Main Card */}
                    <div className="block rounded-lg shadow-lg bg-white dark:bg-secondary-dark-bg  text-center">
                        {/* Main Card header */}
                        <div className="py-3 'bg-white text-xl dark:text-gray-200 text-start px-6 border-b border-gray-300">
                            Analysis Head & Group
                        </div>
                        {/* Main Card header--/-- */}

                        {/* Main Card body */}
                        <div className=" px-6 pb-4 text-start grid grid-cols-4 gap-4 mt-2">

                            <div className="col-span-4">
                                <form className='' >
                                    <div className='w-full grid-cols-1 grid gap-x-4 gap-y-1'>
                                        <div className=' flex mt-2'>
                                            <Autocomplete
                                                id="accGroupSel"
                                                clearOnEscape
                                                size="small"
                                                sx={{ width: "100%" }}
                                                options={accGroupOptions}
                                                value={accGroupSel}
                                                getOptionLabel={(option) => (option.Name) ? option.Name : ""}
                                                onChange={(e, selectedOption) => {
                                                    if (selectedOption) {
                                                        onSelectAccGroup(selectedOption);
                                                    }
                                                }}
                                                renderInput={(params) => (
                                                    <TextField
                                                        sx={{ width: '100%' }}
                                                        {...params}
                                                        // {...register("plantNameSel")}
                                                        InputProps={{ ...params.InputProps, style: { fontSize: 13 } }}
                                                        InputLabelProps={{
                                                            ...params.InputLabelProps, style: { fontSize: 14 },

                                                        }}
                                                        inputRef={(node) => {
                                                            if (node) {
                                                                node.value = (accGroupSel?.Name) ? accGroupSel.Name : "";
                                                            }
                                                        }}
                                                        label="Select Analysis Group" variant="outlined" />
                                                )}
                                            />

                                            <button
                                                type="button"
                                                data-mdb-ripple="true"
                                                data-mdb-ripple-color="light"
                                                className="inline-block px-0 py-0 ml-2 w-[9%] bg-blue-600 text-white font-medium text-xs leading-tight rounded shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900 active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out"
                                                onClick={() => {
                                                    btnDeleteAccountGroup();
                                                }}
                                            >Delete</button>

                                            <button
                                                type="button"
                                                data-mdb-ripple="true"
                                                data-mdb-ripple-color="light"
                                                className="inline-block px-1 py-0 ml-2 w-[9%] bg-blue-600 text-white font-medium text-xs leading-tight rounded shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900 active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out"
                                                onClick={() => {
                                                    reset();
                                                    setAnalysisGroupModalOpen(true);
                                                }}
                                            > Create Group</button>

                                            <button
                                                type="button"
                                                data-mdb-ripple="true"
                                                data-mdb-ripple-color="light"
                                                className="inline-block px-0 py-0 ml-2 w-[9%] bg-blue-600 text-white font-medium text-xs leading-tight rounded shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900 active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out"
                                                onClick={() => {
                                                    // setProdnPlantSel();
                                                    // setProdnSubPlantSel();
                                                    // setProdGroupSel();
                                                    // setProdPlantGroupTbRowIndx();
                                                    // setCurrentTrigger('Add')
                                                    // setProdGroupModalOpen(true);
                                                    if (accGroupSel?.Id) {
                                                        reset();
                                                        setCurrentTrigger("Add");
                                                        setAnalysisHeadModalOpen(true);
                                                    }
                                                    else {
                                                        toast.error(`You must select a Analysis Group to add a head!`);
                                                    }

                                                }}
                                            > Create Head</button>


                                        </div>


                                        <div className='modifiedEditTable mb-5 mt-2'>
                                            <MaterialReactTable
                                                columns={groupOptionTable}
                                                data={accHeadTb}
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
                                                enableTopToolbar={true}
                                                enableColumnResizing
                                                muiTableContainerProps={{ sx: { maxHeight: '380px' } }} //ekhane table er data height
                                                muiTableHeadCellProps={{
                                                    //simple styling with the `sx` prop, works just like a style prop in this example
                                                    sx: {
                                                        fontWeight: 'Bold',
                                                        fontSize: '13px',
                                                    },
                                                    // align: 'left',
                                                }}

                                            // renderTopToolbarCustomActions={({ table }) => (
                                            //     // <Box
                                            //     //   sx={{ display: 'flex', gap: '1rem', p: '0.5rem', flexWrap: 'wrap' }}
                                            //     // >
                                            //     //   <Button
                                            //     //     color="primary"
                                            //     //     //export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)
                                            //     //     onClick={handleExportData}
                                            //     //     startIcon={<FileDownloadIcon />}
                                            //     //     variant="contained"
                                            //     //   >
                                            //     //     Export All Data
                                            //     //   </Button>
                                            //     // </Box>
                                            //     <div className='flex justify-end gap-1'>
                                            //         <button
                                            //             type="button"
                                            //             data-mdb-ripple="true"
                                            //             data-mdb-ripple-color="light"
                                            //             className="inline-block px-[6px] py-1 bg-[#757575] text-white font-medium text-xs leading-tight rounded-full cursor-pointer hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out"
                                            //             onClick={() => {
                                            //                 // setProdnPlantSel();
                                            //                 // setProdnSubPlantSel();
                                            //                 // setProdGroupSel();
                                            //                 // setProdPlantGroupTbRowIndx();
                                            //                 // setCurrentTrigger('Add')
                                            //                 // setProdGroupModalOpen(true);
                                            //                 if (accGroupSel?.Id) {
                                            //                     reset();
                                            //                     setCurrentTrigger("Add");
                                            //                     setAnalysisHeadModalOpen(true);
                                            //                 }
                                            //                 else {
                                            //                     toast.error(`You must select a Analysis Group to add a head!`);
                                            //                 }

                                            //             }}
                                            //         ><i className="fas fa-plus"></i> Add Head</button>
                                            //         {/* <button
                                            //         type="button"
                                            //         data-mdb-ripple="true"
                                            //         data-mdb-ripple-color="light"
                                            //         className="inline-block px-[6px] py-1 bg-[#757575] text-white font-medium text-xs leading-tight rounded-full cursor-pointer hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out"
                                            //         onClick={handleExportData}
                                            //       ><i className="fas fa-file-excel"></i></button> */}
                                            //     </div>

                                            // )
                                            // }
                                            />
                                        </div>
                                    </div>
                                </form>
                            </div>

                        </div>
                        {/* Main Card Body--/-- */}
                        {/* Main Card footer */}
                        {/* <div className="py-3 px-6 border-t text-start border-gray-300 text-gray-600"> */}
                        <div className="py-3 px-6 text-start border-gray-300 text-gray-600">

                            <div className="flex gap-x-3">
                                {/* <button
                                    type="button"
                                    data-mdb-ripple="true"
                                    data-mdb-ripple-color="light"
                                    className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out"
                                    onClick={() => {

                                    }}
                                >Save</button> */}
                                {/* <button
                                    type="button"
                                    data-mdb-ripple="true"
                                    data-mdb-ripple-color="light"
                                    className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out"
                                    onClick={() => {
                                        console.log(permissionRows);

                                    }}
                                >TEST YO</button> */}

                            </div>

                        </div>
                        {/* Main Card footer--/-- */}

                    </div>
                    {/* Main Card--/-- */}

                </div>
            </div>


            {/* ---------------------------------------[Modals]--------------------------------------- */}

            {/* --------------Modal for adding AnalysisGroup--------------- */}
            <Modal
                open={analysisGroupModalOpen}
                onClose={() => {
                    setAnalysisGroupModalOpen(false);
                }}
                aria-labelledby="parent-modal-title"
                aria-describedby="parent-modal-description"
            >
                <Box sx={{ ...modalStyle }}>
                    <fieldset className="border border-solid border-gray-300 px-3 pt-1 pb-3 dark:text-slate-50">
                        <legend className="text-sm">Add a Analysis Group</legend>
                        <div className='mt-2 w-full'>


                            <div>



                                <div className='mt-3'>
                                    <TextField
                                        {...register("AnalysisGroupName")}
                                        id="analysisGroup" variant="outlined" label="Analysis Group Name" size="small"
                                        sx={{ width: '100%' }} InputProps={{ style: { fontSize: 13 } }}
                                        InputLabelProps={{
                                            style: { fontSize: 14 }
                                        }}
                                    />
                                </div>
                                <div className='mt-3 mb-3'>
                                    <TextField
                                        {...register("AnalysisGroupCode")}
                                        id="analysisGroup" variant="outlined" label="Code" size="small"
                                        sx={{ width: '100%' }} InputProps={{ style: { fontSize: 13 } }}
                                        InputLabelProps={{
                                            style: { fontSize: 14 }
                                        }}
                                    />
                                </div>





                                {/* {currentTrigger == "Add" ? (<button
                                type="button"
                                data-mdb-ripple="true"
                                data-mdb-ripple-color="light"
                                className=" mt-2 inline-block px-4 py-1.5 bg-blue-600 text-white font-medium text-xs leading-tight rounded shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out"
                                onClick={() => { btnAddProdGroupAndPlant() }}
                                >Add </button>) : (<button
                                type="button"
                                data-mdb-ripple="true"
                                data-mdb-ripple-color="light"
                                className=" mt-2 inline-block px-4 py-1.5 bg-blue-600 text-white font-medium text-xs leading-tight rounded shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out"
                                onClick={() => { btnUpdateProdGroupAndPlant() }}
                                >Update </button>)} */}

                                <button
                                    type="button"
                                    data-mdb-ripple="true"
                                    data-mdb-ripple-color="light"
                                    className=" mt-2 inline-block px-4 py-1.5 bg-blue-600 text-white font-medium text-xs leading-tight rounded shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out"
                                    onClick={() => { btnAddAnalysisGroup() }}
                                >Add </button>


                                <button
                                    type="button"
                                    data-mdb-ripple="true"
                                    data-mdb-ripple-color="light"
                                    className=" mt-2 ml-2 inline-block px-4 py-1.5 bg-blue-600 text-white font-medium text-xs leading-tight rounded shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out"
                                    onClick={() => { setAnalysisGroupModalOpen(false) }}
                                >Cancel </button>
                            </div>

                        </div>
                    </fieldset>
                    {/* <Button onClick={handleClose}>Close Grand Child Modal</Button> */}


                </Box>
            </Modal>

            <Modal
                open={analysisHeadModalOpen}
                onClose={() => {
                    setAnalysisHeadModalOpen(false);
                }}
                aria-labelledby="parent-modal-title"
                aria-describedby="parent-modal-description"
            >
                <Box sx={{ ...modalStyle }}>
                    <fieldset className="border border-solid border-gray-300 px-3 pt-1 pb-3 dark:text-slate-50">
                        <legend className="text-sm">{(currentTrigger == 'Add') ? "Add an" : "Editing this"} Analysis Head against <b>"{accGroupSel.Name}"</b></legend>
                        <div className='mt-2 w-full'>

                            <div className='mt-3'>
                                <TextField
                                    {...register("AnalysisHeadName")}
                                    id="analysisHead" variant="outlined" label="Head/Option Name" size="small"
                                    sx={{ width: '100%' }} InputProps={{ style: { fontSize: 13 } }}
                                    InputLabelProps={{
                                        style: { fontSize: 14 }
                                    }}
                                />
                            </div>

                            <div className='mt-3'>
                                <TextField
                                    {...register("AnalysisHeadCode")}
                                    id="analysisHead" variant="outlined" label="Code" size="small"
                                    sx={{ width: '100%' }} InputProps={{ style: { fontSize: 13 } }}
                                    InputLabelProps={{
                                        style: { fontSize: 14 }
                                    }}
                                />
                            </div>

                            <div className='mt-3'>
                                <TextField
                                    {...register("AnalysisHeadNotes")}
                                    id="analysisHead" variant="outlined" label="Notes" size="small"
                                    sx={{ width: '100%' }} InputProps={{ style: { fontSize: 13 } }}
                                    InputLabelProps={{
                                        style: { fontSize: 14 }
                                    }}
                                />
                            </div>



                            <div className='mt-4'>
                                {/* {currentTrigger == "Add" ? (<button
                                type="button"
                                data-mdb-ripple="true"
                                data-mdb-ripple-color="light"
                                className=" mt-2 inline-block px-4 py-1.5 bg-blue-600 text-white font-medium text-xs leading-tight rounded shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out"
                                onClick={() => { btnAddProdGroupAndPlant() }}
                                >Add </button>) : (<button
                                type="button"
                                data-mdb-ripple="true"
                                data-mdb-ripple-color="light"
                                className=" mt-2 inline-block px-4 py-1.5 bg-blue-600 text-white font-medium text-xs leading-tight rounded shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out"
                                onClick={() => { btnUpdateProdGroupAndPlant() }}
                                >Update </button>)} */}

                                <button
                                    type="button"
                                    data-mdb-ripple="true"
                                    data-mdb-ripple-color="light"
                                    className=" mt-2 inline-block px-4 py-1.5 bg-blue-600 text-white font-medium text-xs leading-tight rounded shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out"
                                    onClick={() => { (currentTrigger == 'Add') ? btnAddAnalysisHead() : btnUpdateAnalysisHead() }}
                                >{(currentTrigger == 'Add') ? "Add" : "Update"} </button>


                                <button
                                    type="button"
                                    data-mdb-ripple="true"
                                    data-mdb-ripple-color="light"
                                    className=" mt-2 ml-2 inline-block px-4 py-1.5 bg-blue-600 text-white font-medium text-xs leading-tight rounded shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out"
                                    onClick={() => { setAnalysisHeadModalOpen(false) }}
                                >Cancel </button>
                            </div>

                        </div>
                    </fieldset>
                    {/* <Button onClick={handleClose}>Close Grand Child Modal</Button> */}


                </Box>
            </Modal>

        </div >
        // return wrapper div--/--
    )
}

export default AnalysisHeadAndGroup