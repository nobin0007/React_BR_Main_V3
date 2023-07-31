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

import './NameAgtAccSetup.css';

import Popper from "@material-ui/core/Popper";
import { ExportToCsv } from 'export-to-csv';
import { useStateContext } from '../../contexts/ContextProvider';
// import muiStyleCustom from '../muiStyleCustom';
import { redirect, useNavigate } from 'react-router-dom';
//----[loading 10 dummy empty rows on load]----//



const setupModalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 700,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 1,
    px: 1,
    pb: 1,
};

const permissionRowsWritten = [
    { DefaultGroup: "Buyer", GroupCheck: false, Group: { Id: '', Name: '', onlyRead: true }, SubGroup: { Name: '', Id: '', onlyRead: true } },
    { DefaultGroup: "Supplier", GroupCheck: false, Group: { Id: '', Name: '', onlyRead: true }, SubGroup: { Name: '', Id: '', onlyRead: true } },
    { DefaultGroup: "Employee", GroupCheck: false, Group: { Id: '', Name: '', onlyRead: true }, SubGroup: { Name: '', Id: '', onlyRead: true } },
    { DefaultGroup: "Location", GroupCheck: false, Group: { Id: '', Name: '', onlyRead: true }, SubGroup: { Name: '', Id: '', onlyRead: true } },

    { DefaultGroup: "AccountsAnalysis1", GroupCheck: false, Group: { Id: '', Name: '', onlyRead: true }, SubGroup: { Name: '', Id: '', onlyRead: true } },
    { DefaultGroup: "AccountsAnalysis2", GroupCheck: false, Group: { Id: '', Name: '', onlyRead: true }, SubGroup: { Name: '', Id: '', onlyRead: true } }
]

const NameAgtAccSetup = (props) => {
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
    const [supplierGroupOptions, setSupplierGroupOptions] = useState([]);
    const [departmentOptions, setDepartmentOptions] = useState([]);
    const [parentLocationOptions, setParentLocationOptions] = useState([])
    const [accAnalysisOptions, setAccAnalysisOptions] = useState([]);

    const [accountHeadOptions, setAccountHeadOptions] = useState([]);

    const [permissionRows, setPermissionRows] = useState([]);
    const [permissionRowsEx, setPermissionRowsEx] = useState([]);

    const [accHeadSel, setAccHeadSel] = useState({ AccountsName: '', AccountsId: '' });
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

        // var prevTableDataOld = _.cloneDeep(voucherTableData);

        let copyPermissionRowsEmpty = _.cloneDeep(permissionRowsWritten);

        setPermissionRows(copyPermissionRowsEmpty);


    }, [])



    const onSelectAccHead = (selectedOption) => {
        setAccHeadSel(selectedOption);
        fetch(`${userInfo.Ip}/API/NameAgtAccSetup/Get_AccNamePermitsByAccId?companyId=${userInfo.CompanyId}&locationId=${userInfo.LocationId}&accountsId=${selectedOption.AccountsId}`)
            .then(res =>
                res.json()
                // console.log(res);
            )
            .then((data) => {
                console.log("Fetched data AllPermissions.....................");
                console.log(data);

                //eikhan theke funct koris parle

                let tempPermissionRows = [
                    { DefaultGroup: "Buyer", GroupCheck: false, Group: { Id: '', Name: '', onlyRead: true }, SubGroup: { Name: '', Id: '', onlyRead: true } },
                    { DefaultGroup: "Supplier", GroupCheck: false, Group: { Id: '', Name: '', onlyRead: true }, SubGroup: { Name: '', Id: '', onlyRead: true } },
                    { DefaultGroup: "Employee", GroupCheck: false, Group: { Id: '', Name: '', onlyRead: true }, SubGroup: { Name: '', Id: '', onlyRead: true } },
                    { DefaultGroup: "Location", GroupCheck: false, Group: { Id: '', Name: '', onlyRead: true }, SubGroup: { Name: '', Id: '', onlyRead: true } },

                    { DefaultGroup: "AccountsAnalysis1", GroupCheck: false, Group: { Id: '', Name: '', onlyRead: true }, SubGroup: { Name: '', Id: '', onlyRead: true } },
                    { DefaultGroup: "AccountsAnalysis2", GroupCheck: false, Group: { Id: '', Name: '', onlyRead: true }, SubGroup: { Name: '', Id: '', onlyRead: true } }
                ]


                let accAnalysisCount = 1;
                data.forEach(dataRow => {

                    const defaultGroup = dataRow.DefaultGroup;
                    switch (defaultGroup) {
                        case "Buyer":

                            let buyerRow = tempPermissionRows.find(item => item.DefaultGroup == 'Buyer');
                            buyerRow.GroupCheck = true;
                            buyerRow.Group.onlyRead = false;
                            if (dataRow.SubGroupName) {
                                buyerRow.Group.Id = dataRow.SubGroupName;
                                buyerRow.Group.Name = 'Buyer Group';
                                buyerRow.SubGroup.onlyRead = false;

                                if (dataRow.SubGroupId) {
                                    let option = buyerGroupOptions.find(item => item.Id == dataRow.SubGroupId);
                                    buyerRow.SubGroup.Id = option.Id;
                                    buyerRow.SubGroup.Name = option.Name;
                                }
                            }
                            else {
                                buyerRow.Group.Name = 'All';
                                buyerRow.SubGroup.Name = 'All';
                                buyerRow.SubGroup.onlyRead = true;
                            }
                            break;


                        case "Supplier":


                            let supplierRow = tempPermissionRows.find(item => item.DefaultGroup == 'Supplier');
                            supplierRow.GroupCheck = true;
                            supplierRow.Group.onlyRead = false;
                            if (dataRow.SubGroupName) {
                                supplierRow.Group.Id = dataRow.SubGroupName;
                                supplierRow.Group.Name = 'Supplier Group';
                                supplierRow.SubGroup.onlyRead = false;

                                if (dataRow.SubGroupId) {
                                    let option = supplierGroupOptions.find(item => item.Id == dataRow.SubGroupId);
                                    supplierRow.SubGroup.Id = option.Id;
                                    supplierRow.SubGroup.Name = option.Name;
                                }
                            }
                            else {
                                supplierRow.Group.Name = 'All';
                                supplierRow.SubGroup.Name = 'All';
                                supplierRow.SubGroup.onlyRead = true;
                            }
                            break;


                        case "Employee":

                            let employeeRow = tempPermissionRows.find(item => item.DefaultGroup == 'Employee');
                            employeeRow.GroupCheck = true;
                            employeeRow.Group.onlyRead = false;
                            if (dataRow.SubGroupName) {
                                employeeRow.Group.Id = dataRow.SubGroupName;
                                employeeRow.Group.Name = 'Department';
                                employeeRow.SubGroup.onlyRead = false;

                                if (dataRow.SubGroupId) {
                                    let option = departmentOptions.find(item => item.Id == dataRow.SubGroupId);
                                    employeeRow.SubGroup.Id = option.Id;
                                    employeeRow.SubGroup.Name = option.Name;
                                }
                            }
                            else {
                                employeeRow.Group.Name = 'All';
                                employeeRow.SubGroup.Name = 'All';
                                employeeRow.SubGroup.onlyRead = true;
                            }
                            break;

                        case "Location":

                            let locationRow = tempPermissionRows.find(item => item.DefaultGroup == 'Location');
                            locationRow.GroupCheck = true;
                            locationRow.Group.onlyRead = false;
                            if (dataRow.SubGroupName) {
                                locationRow.Group.Id = dataRow.SubGroupName;
                                locationRow.Group.Name = 'Parent Location';
                                locationRow.SubGroup.onlyRead = false;

                                if (dataRow.SubGroupId) {
                                    let option = parentLocationOptions.find(item => item.Id == dataRow.SubGroupId);
                                    locationRow.SubGroup.Id = option.Id;
                                    locationRow.SubGroup.Name = option.Name;
                                }
                            }
                            else {
                                locationRow.Group.Name = 'All';
                                locationRow.SubGroup.Name = 'All';
                                locationRow.SubGroup.onlyRead = true;
                            }
                            break;


                        case "AccountsAnalysis":


                            if (accAnalysisCount == 1) {
                                let accAnalysis1Row = tempPermissionRows.find(item => item.DefaultGroup == 'AccountsAnalysis1');
                                accAnalysis1Row.GroupCheck = true;
                                accAnalysis1Row.Group.onlyRead = false;
                                accAnalysis1Row.Group.Id = dataRow.SubGroupId;
                                accAnalysis1Row.Group.Name = dataRow.SubGroupName;
                                accAnalysis1Row.SubGroup.Id = dataRow.SubGroupId;
                                accAnalysis1Row.SubGroup.Name = "All";
                            }

                            if (accAnalysisCount == 2) {
                                let accAnalysis2Row = tempPermissionRows.find(item => item.DefaultGroup == 'AccountsAnalysis2');
                                accAnalysis2Row.GroupCheck = true;
                                accAnalysis2Row.Group.onlyRead = false;
                                accAnalysis2Row.Group.Id = dataRow.SubGroupId;
                                accAnalysis2Row.Group.Name = dataRow.SubGroupName;
                                accAnalysis2Row.SubGroup.Id = dataRow.SubGroupId;
                                accAnalysis2Row.SubGroup.Name = "All";
                            }

                            accAnalysisCount = accAnalysisCount + 1;


                            break;

                    }


                });
                // { DefaultGroup: "Buyer", GroupCheck: false, Group: { Id: '', Name: '', onlyRead: true }, SubGroup: { Name: '', Id: '', onlyRead: true } }
                let copyTempPermission = _.cloneDeep(tempPermissionRows);
                setPermissionRowsEx(copyTempPermission);
                setPermissionRows(tempPermissionRows);



            })
    }

    useEffect(() => {

        //---------[get autocomplete options]----------------

        fetch(`${userInfo.Ip}/API/NameAgtAccSetup/Get_AllBuyerGroup?companyId=${userInfo.CompanyId}`)
            .then(res =>
                res.json()
                // console.log(res);

            )
            .then((data) => {
                console.log("Fetched data AllBuyerGroup.....................");
                console.log(data);
                setBuyerGroupOptions(data);
            })

        fetch(`${userInfo.Ip}/API/NameAgtAccSetup/Get_AllSupplierGroup?companyId=${userInfo.CompanyId}`)
            .then(res =>
                res.json()
                // console.log(res);
            )
            .then((data) => {
                console.log("Fetched data AllSupplierGroup.....................");
                console.log(data);
                setSupplierGroupOptions(data);
            })
        fetch(`${userInfo.Ip}/API/NameAgtAccSetup/Get_AllDepartment?companyId=${userInfo.CompanyId}`)
            .then(res =>
                res.json()
                // console.log(res);
            )
            .then((data) => {
                console.log("Fetched data AllDepartmentGroup.....................");
                console.log(data);
                setDepartmentOptions(data);
            })

        fetch(`${userInfo.Ip}/API/NameAgtAccSetup/Get_ParentLocation?companyId=${userInfo.CompanyId}`)
            .then(res =>
                res.json()
                // console.log(res);
            )
            .then((data) => {
                console.log("Fetched data AllParentLocation.....................");
                console.log(data);
                setParentLocationOptions(data);
            })

        fetch(`${userInfo.Ip}/API/NameAgtAccSetup/Get_AllAnalysisGroup?companyId=${userInfo.CompanyId}&locationId=${userInfo.LocationId}`)
            .then(res =>
                res.json()
                // console.log(res);
            )
            .then((data) => {
                console.log("Fetched data Get All AnalysisGroup.....................");
                console.log(data);
                setAccAnalysisOptions(data);
            })

        fetch(`${userInfo.Ip}/API/NameAgtAccSetup/Get_AccountHead?companyId=${userInfo.CompanyId}&locationId=${userInfo.LocationId}`)
            .then(res =>
                res.json()
                // console.log(res);
            )
            .then((data) => {
                console.log("Fetched data AllAccountHead.....................");
                console.log(data);
                setAccountHeadOptions(data);
            })



    }, [])

    const handleOnclickCheckCell = (cell) => {
        permissionRows[cell.row.index].GroupCheck = !(permissionRows[cell.row.index].GroupCheck);
        if (permissionRows[cell.row.index].GroupCheck == false) {
            permissionRows[cell.row.index].Group = { Id: '', Name: '', onlyRead: true }
            permissionRows[cell.row.index].SubGroup = { Name: '', Id: '', onlyRead: true }
        }
        else {
            permissionRows[cell.row.index].Group.onlyRead = false;
        }
        setPermissionRows([...permissionRows]);
    };

    let permissionTbCols = [
        {
            accessorKey: 'group',
            header: 'Group Name',
            // enableSorting: false,
            // enableColumnActions: false,
            Cell: ({ cell }) => (
                <div className='cursor-pointer' onClick={() => { handleOnclickCheckCell(cell) }}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={permissionRows[cell.row.index].GroupCheck}
                                sx={{ '& .MuiSvgIcon-root': { fontSize: 19 } }}
                                onChange={(e) => {
                                    permissionRows[cell.row.index].GroupCheck = e.target.checked;
                                    if (e.target.checked == false) {
                                        permissionRows[cell.row.index].Group = { Id: '', Name: '', onlyRead: true }
                                        permissionRows[cell.row.index].SubGroup = { Name: '', Id: '', onlyRead: true }
                                    }
                                    else {
                                        permissionRows[cell.row.index].Group.onlyRead = false;
                                    }
                                    setPermissionRows([...permissionRows]);
                                }}
                            />
                        }
                        label={<Box component="div" fontSize={14}>
                            {permissionRows[cell.row.index].DefaultGroup}
                        </Box>}
                    />

                </div>

            )
        },
        {
            accessorKey: 'Group', //access nested data with dot notation
            header: 'Select By',
            enableSorting: false,
            enableColumnActions: false,
            Cell: ({ cell, column, table }) => {
                // let options = [];
                // if (true) {
                //     options = [{ Name: "rupom", Id: 1 }, { Name: "rupom2", Id: 2 }];
                // }
                return (
                    <Autocomplete
                        id=""
                        PopperComponent={PopperMy}
                        clearOnEscape
                        disableClearable
                        freeSolo
                        readOnly={permissionRows[cell.row.index].Group.onlyRead}
                        size="small"
                        options={(permissionRows[cell.row.index].DefaultGroup == 'Buyer') ? [{ Id: '', Name: 'All' }, { Id: 'GroupId', Name: 'Buyer Group' }] :
                            (permissionRows[cell.row.index].DefaultGroup == 'Supplier') ? [{ Id: '', Name: 'All' }, { Id: 'GroupId', Name: 'Supplier Group' }] :
                                (permissionRows[cell.row.index].DefaultGroup == 'Employee') ? [{ Id: '', Name: 'All' }, { Id: 'DepartmentId', Name: 'Department' }] :
                                    (permissionRows[cell.row.index].DefaultGroup == 'Location') ? [{ Id: '', Name: 'All' }, { Id: 'ParentLocation', Name: 'Parent Location' }] :
                                        (permissionRows[cell.row.index].DefaultGroup == 'AccountsAnalysis1') ? accAnalysisOptions :
                                            (permissionRows[cell.row.index].DefaultGroup == 'AccountsAnalysis2') ? accAnalysisOptions : []}

                        value={permissionRows[cell.row.index].Group}
                        onChange={(e, selectedOption) => {
                            if ((permissionRows[cell.row.index].DefaultGroup == 'AccountsAnalysis1') || (permissionRows[cell.row.index].DefaultGroup == 'AccountsAnalysis2')) {
                                permissionRows[cell.row.index].Group = selectedOption;

                                permissionRows[cell.row.index].SubGroup.Id = selectedOption.Id;
                                permissionRows[cell.row.index].SubGroup.Name = "All";
                                permissionRows[cell.row.index].SubGroup.onlyRead = true;
                            }
                            else {
                                permissionRows[cell.row.index].Group = selectedOption;
                                if (selectedOption.Name == 'All') {
                                    permissionRows[cell.row.index].SubGroup = { Name: 'All', Id: '', onlyRead: true };
                                }
                                else {
                                    permissionRows[cell.row.index].SubGroup.onlyRead = false;
                                }
                            }
                            setPermissionRows([...permissionRows]);
                        }}

                        getOptionLabel={(option) => ((option.Name) ? option.Name : "")}
                        renderOption={(props, option) => (
                            <List {...props} key={option.Id}>
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
                                onClick={() => {
                                    permissionRows[cell.row.index].GroupCheck = true;
                                    permissionRows[cell.row.index].Group.onlyRead = false;
                                    setPermissionRows([...permissionRows]);
                                }}
                                inputRef={(node) => {
                                    if (node) {
                                        node.value = permissionRows[cell.row.index].Group.Name;
                                    }
                                }}
                                // onBlur={() => { console.log(this) }}
                                onBlur={(e) => {
                                    if (!e.target.value && permissionRows[cell.row.index].GroupCheck) {
                                        if ((permissionRows[cell.row.index].DefaultGroup != 'AccountsAnalysis1') && (permissionRows[cell.row.index].DefaultGroup != 'AccountsAnalysis2')) {
                                            permissionRows[cell.row.index].Group.Id = '';
                                            permissionRows[cell.row.index].Group.Name = 'All';
                                            permissionRows[cell.row.index].SubGroup = { Id: '', Name: 'All', onlyRead: true };
                                            setPermissionRows([...permissionRows]);
                                        }
                                        // else {
                                        //     permissionRows[cell.row.index].Group.Id = '';
                                        //     permissionRows[cell.row.index].Group.Name = 'All';
                                        // }

                                    }
                                }}
                                InputProps={{ ...params.InputProps, style: { fontSize: 13 }, disableUnderline: true }}
                                variant="standard"
                                size="small"
                            />}
                    />
                )
            }
        },
        {
            accessorKey: 'SubGroupType', //access nested data with dot notation
            header: 'Sub Group Type',
            enableSorting: false,
            enableColumnActions: false,
            Cell: ({ cell, column, table }) => (
                <Autocomplete
                    id=""
                    PopperComponent={PopperMy}
                    clearOnEscape
                    disableClearable
                    freeSolo
                    size="small"
                    readOnly={permissionRows[cell.row.index].SubGroup.onlyRead}
                    options={(permissionRows[cell.row.index].DefaultGroup == 'Buyer') ? buyerGroupOptions :
                        (permissionRows[cell.row.index].DefaultGroup == 'Supplier') ? supplierGroupOptions :
                            (permissionRows[cell.row.index].DefaultGroup == 'Employee') ? departmentOptions :
                                (permissionRows[cell.row.index].DefaultGroup == 'Location') ? parentLocationOptions : []}
                    value={permissionRows[cell.row.index].SubGroup}
                    onChange={(e, selectedOption) => {
                        if ((permissionRows[cell.row.index].DefaultGroup != 'AccountsAnalysis1') || (permissionRows[cell.row.index].DefaultGroup != 'AccountsAnalysis2')) {
                            permissionRows[cell.row.index].SubGroup = selectedOption;
                            setPermissionRows([...permissionRows]);
                        }
                    }}
                    getOptionLabel={(option) => ((option.Name) ? option.Name : "")}
                    renderOption={(props, option) => (
                        <List {...props} key={option.Id}>
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
                                    node.value = permissionRows[cell.row.index].SubGroup.Name;
                                }
                            }}
                            // onBlur={(e) => {
                            //     if (!e.target.value) {
                            //         permissionRows[cell.row.index].SubGroup.Id = '';
                            //         permissionRows[cell.row.index].SubGroup.Name = '';
                            //         setPermissionRows([...permissionRows]);
                            //     }
                            // }}
                            // onBlur={() => { console.log(this) }}
                            InputProps={{ ...params.InputProps, style: { fontSize: 13 }, disableUnderline: true }}
                            variant="standard"
                            size="small"
                        />}
                />
            )
        },
    ]

    const saveBtn = () => {

        // new decision--- frontend theke pathabo, accountsId:'', stakeHolderTable:[], case3table:[]
        // let sampleData = { accountsId: 0, stakeHolderTable: [], case2table: [] };

        let stakeholderTable = [];
        let case2table = [];
        let allOk = true;
        for (let i = 0; i < permissionRows.length; i++) {
            if ((permissionRows[i].DefaultGroup == 'AccountsAnalysis1') || (permissionRows[i].DefaultGroup == 'AccountsAnalysis2')) {
                //data structure for case 2 table
                let tempobj =
                {
                    AccountsId: accHeadSel.AccountsId,
                    AnalysisGroupId: (permissionRows[i].SubGroup.Id ? permissionRows[i].SubGroup.Id : ((permissionRowsEx[i]?.SubGroup.Id) ? permissionRowsEx[i].SubGroup.Id : null)),
                    DefaultGroup: permissionRows[i].DefaultGroup,
                    Checked: permissionRows[i].GroupCheck,
                    CompanyId: userInfo.CompanyId,
                    LocationId: userInfo.LocationId
                }
                case2table.push(tempobj);
            }
            else {
                //data structure for stakeHolder table
                let tempobj =
                {
                    AccountsId: accHeadSel.AccountsId,
                    DefaultGroup: permissionRows[i].DefaultGroup,
                    Checked: permissionRows[i].GroupCheck,
                    SubGroupName: permissionRows[i].Group.Id,
                    SubGroupId: (permissionRows[i].SubGroup.Id ? permissionRows[i].SubGroup.Id : null),
                    CompanyId: userInfo.CompanyId,
                    LocationId: userInfo.LocationId
                }
                stakeholderTable.push(tempobj);
            }
        }

        console.log("stakeholderTable:-----");
        console.log(stakeholderTable);

        console.log("case2table:-----");
        console.log(case2table);

        let analysis1Row = case2table.find(item => item.DefaultGroup == 'AccountsAnalysis1');
        let analysis2Row = case2table.find(item => item.DefaultGroup == 'AccountsAnalysis2');


        //save er shomoykar kisu input validity check
        if (analysis1Row.Checked && !analysis1Row.AnalysisGroupId) {
            toast.error("'Select By' column can't be empty for checked Analysis1");
            allOk = false;

        }
        if (analysis2Row.Checked && !analysis2Row.AnalysisGroupId) {
            toast.error("'Select By' column can't be empty for checked Analysis2");
            allOk = false;
        }

        if (analysis1Row.AnalysisGroupId && analysis2Row.AnalysisGroupId) {
            if (analysis1Row.AnalysisGroupId == analysis2Row.AnalysisGroupId) {
                toast.error("Same value in 'Select By' column for Analysis1 and Analysis2");
                allOk = false;
            }
        }


        //i guess ei nicher duita if update er shomoy thakbena-----------


        if (accHeadSel.AccountsId) {
            console.log("permissionRowsEx:");
            console.log(permissionRowsEx);
            console.log("permissionRows:");

            console.log(permissionRows);
            if (JSON.stringify(permissionRowsEx) == JSON.stringify(permissionRows)) {
                toast.error(`You didn't change anything!`);
                allOk = false;
            }
        }
        else {
            toast.error(`You can't save a rule without selecting a Account Head`);
            allOk = false;
        }

        if (allOk) {
            let singleData = { AccountsId: accHeadSel.AccountsId, SecurityUserId: userInfo.SecurityUserId, StakeHolderTb: stakeholderTable, Case2Tb: case2table };

            Swal.fire({
                title: `Are you sure?`,
                showDenyButton: true,
                icon: 'success',
                showCancelButton: false,
                confirmButtonText: 'Yes!',
                denyButtonText: `No!`,
            }).then((result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                    console.log("yo yo backend e ei data jabe ONSAVE");
                    console.log(singleData);


                    axios.post(`${userInfo.Ip}/API/NameAgtAccSetup/Post_NameAgtAccPermits`, singleData)
                        .then(res => {
                            console.log("insert er axios!!")
                            if (res) {
                                console.log(res);


                                //Saved Successfully Notification....
                                Swal.fire({
                                    title: `Permission rules for ${accHeadSel.AccountsName} Saved Successfully`,
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
                                //clear all fields
                                let copyPermissionRowsEmpty = _.cloneDeep(permissionRowsWritten);
                                setPermissionRows(copyPermissionRowsEmpty);
                                setPermissionRowsEx([]);
                                setAccHeadSel({ AccountsName: '', AccountsId: '' });
                            }
                        })

                    //fetch call de..........successful hole modal er states gula clear kor and abar wholeTbValues retrieve kore assign kor....
                }
                else {
                    // setSetupModalOpen(true);

                }
            })
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
                            Name Against Account Setup
                        </div>
                        {/* Main Card header--/-- */}

                        {/* Main Card body */}
                        <div className=" px-6 pb-4 text-start grid grid-cols-4 gap-4 mt-2">

                            <div className="col-span-4">

                                <form className='' >
                                    <div className='w-full grid-cols-1 grid gap-x-4 gap-y-1'>
                                        <Autocomplete
                                            id=""
                                            clearOnEscape
                                            size="small"
                                            sx={{ width: "100%", marginTop: 1, marginBottom: 1 }}
                                            options={accountHeadOptions}
                                            value={accHeadSel.AccountsId ? accHeadSel : { AccountsName: "", AccountsId: "" }}
                                            getOptionLabel={(option) => (option.AccountsName) ? option.AccountsName : ""}
                                            onChange={(e, selectedOption) => {
                                                if (selectedOption) {
                                                    onSelectAccHead(selectedOption)
                                                }
                                            }}
                                            renderOption={(props, option) => (
                                                <List {...props} key={option.AccountsId}>
                                                    {/* <ListItem> */}
                                                    <p>{option.AccountsName}
                                                    </p>
                                                    {/* </ListItem> */}
                                                </List>
                                            )}
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
                                                            node.value = (accHeadSel.AccountsName) ? accHeadSel.AccountsName : "";
                                                        }
                                                    }}
                                                    label="Account Head" variant="outlined" />
                                            )}
                                        />

                                        <div className='modifiedEditTable mb-5'>
                                            <MaterialReactTable
                                                columns={permissionTbCols}
                                                data={permissionRows}
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
                                                enableTopToolbar={false}
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
                                            />
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
                                    onClick={() => {
                                        // rupom();
                                        // setSetupModalOpen(true);
                                        saveBtn();
                                    }}
                                >Save</button>
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
        </div >
        // return wrapper div--/--
    )
}

export default NameAgtAccSetup