import React from 'react';
import { MdOutlineCancel } from 'react-icons/md';

import { Button } from '.';
import { userProfileData } from '../data/dummy';
import { BsKanban, BsBarChart, BsBoxSeam, BsCurrencyDollar, BsShield, BsChatLeft, BsBuilding } from 'react-icons/bs';
import { useStateContext } from '../contexts/ContextProvider';
import avatar from '../data/avatar.jpg';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect, useCallback, useRef } from 'react';
import * as _ from 'lodash';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

import {
    Autocomplete,
    Paper,
    Box,
    // Button,
    Checkbox,
    FormControlLabel,
    Grid,
    Radio,
    RadioGroup,
    Modal,
    TextField,
    List,
    Slider,
    Select,
    MenuItem,
    IconButton,
    Tooltip,
    Stack
} from "@mui/material";


const companyChangeModalStyle = {
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

const UserProfile = () => {
    const { currentColor } = useStateContext();
    const navigate = useNavigate();
    const { setIsClicked, initialState } = useStateContext();

    var userSession = JSON.parse(localStorage.getItem("userInfo"));
    console.log("yo yo rupom");
    console.log(userSession);


    const [companyOptions, setCompanyOptions] = useState([]);
    const [activeCompany, setActiveCompany] = useState({ Name: (userSession?.CompanyName ? userSession?.CompanyName : ''), CompanyId: (userSession?.CompanyId ? userSession.CompanyId : ''), Ip: (userSession?.Ip ? userSession.Ip : '') });

    const [locationOptions, setLocationOptions] = useState([]);
    const [selLocation, setSelLocation] = useState({ Name: (userSession?.LocationName ? userSession.LocationName : ''), LocationId: (userSession?.LocationId ? userSession.LocationId : '') });






    const logoutBtn = () => {
        console.log("rupom");
        setIsClicked(initialState);
        if (localStorage.getItem("userInfo") && localStorage.getItem("brFeature")) {
            localStorage.removeItem('userInfo');
            localStorage.removeItem('brFeature');
        }
        navigate('/');
    }

    const changeCompany = () => {
        console.log("change company");
        setCompanyChangeModalOpen(true);

        // window.location.reload(true);
        // setIsClicked(initialState);
    }




    const [companyChangeModalOpen, setCompanyChangeModalOpen] = useState(false);
    // const handlePrevModalOpen = () => setPrevVouchSelectModalOpen(true);
    const handleCompanyModalClose = () => {
        setCompanyChangeModalOpen(false);
    }

    const onSelCompany = (e, selectedOption) => {

        if (selectedOption) {
            console.log(selectedOption);

            fetch(`${selectedOption.Ip}/API/Login/Get_Location?companyId=${selectedOption.CompanyId}`)
                .then(res =>
                    res.json()
                    // console.log(res);
                )
                .then((data) => {
                    console.log(data);
                    setLocationOptions(data);

                    let session = JSON.parse(localStorage.getItem("userInfo"));

                    const obj = data.find(item => item.Name === session.LocationName);
                    if (obj) {
                        //select that obj for location
                        setSelLocation(obj);
                    }
                    else {
                        //select nothing for location
                        setSelLocation({});
                    }
                })

            setActiveCompany(selectedOption);
        }

    }

    const changeCompanyBtn = () => {

        //modalClose
        setCompanyChangeModalOpen(false);

        Swal.fire({
            title: `Are you sure you want to change company?`,
            text: `If you change your compnay, any unsaved data will be lost!`,
            showDenyButton: true,
            icon: 'question',
            showCancelButton: false,
            confirmButtonText: 'Yes',
            denyButtonText: `No`,
        }).then((result) => {
            if (result.isConfirmed) {
                handleOnYesChangeCompany();
            }
            else {
                setSelLocation({ Name: userSession.LocationName, LocationId: userSession.LocationId });
                setActiveCompany({ Name: userSession.CompanyName, CompanyId: userSession.CompanyId });
                setCompanyChangeModalOpen(true);
            }
        })
    }

    const handleOnYesChangeCompany = () => {
        let formData = { userName: userSession.UserName, password: userSession.Password, companyId: activeCompany.CompanyId, companyName: activeCompany.Name, locationId: selLocation.LocationId, locationName: selLocation.Name };

        console.log("form data");
        console.log(formData);

        axios.get(`${activeCompany.Ip}/API/Login/Get_UserPassMatch`, { params: formData })
            .then(res => {
                console.log("insert er axios!!");
                if (res.data.UserName) {
                    console.log(res.data.UserName);

                    var userInfo = {
                        UserName: res.data.UserName,
                        SecurityUserId: res.data.SecurityUserId,
                        EmployeeId: res.data.EmployeeId,
                        EmailAddress: res.data.EmailAddress,
                        CompanyName: res.data.CompanyName,
                        CompanyId: res.data.CompanyId,
                        LocationName: formData.locationName,
                        LocationId: res.data.LocationId,
                        Password: formData.password,

                        //ekhane ip var er value change hobe
                        Ip: activeCompany.Ip

                    };
                    fetch(`${activeCompany.Ip}/API/JournalVoucher/CheckBrFeatures?companyId=${res.data.CompanyId}`)
                        .then(res =>
                            res.json()
                            // console.log(res);
                        )
                        .then((data) => {
                            console.log("BR Feature check raw data.....");
                            console.log(data);

                            let brFeature = {};

                            for (let i = 0; i < data.length; i++) {
                                brFeature[data[i].Name] = data[i].IsAllowed;
                            }


                            console.log("Hello RUPOM 32 KILLS YO....");
                            console.log(brFeature);


                            localStorage.setItem('userInfo', JSON.stringify(userInfo));
                            // cacheStorage.setItem('userInfo', JSON.stringify(formData));
                            localStorage.setItem('brFeature', JSON.stringify(brFeature));
                            // sessionStorage.setItem('brFeature', JSON.stringify(brFeature));



                            window.location.reload();

                        })
                }
                else {
                    Swal.fire({
                        title: `Sorry, you cannot change into this company!`,
                        text: `Your account with the user name:"${userSession.UserName}" is not registered for this company. Do you want to enter your credentials again?`,
                        showDenyButton: true,
                        icon: 'question',
                        showCancelButton: false,
                        confirmButtonText: 'Yes, Logout!',
                        denyButtonText: `No!`,
                    }).then((result) => {
                        /* Read more about isConfirmed, isDenied below */
                        if (result.isConfirmed) {
                            // setVoucherNumber(res.data);
                            // vouchNoInpRef.current.value = res.data;
                            if (localStorage.getItem("userInfo") && localStorage.getItem("brFeature")) {
                                localStorage.removeItem('userInfo');
                                localStorage.removeItem('brFeature');
                            }
                            navigate('/');
                        }
                        else {
                            setSelLocation({ Name: userSession.LocationName, LocationId: userSession.LocationId });
                            setActiveCompany({ Name: userSession.CompanyName, CompanyId: userSession.CompanyId });
                        }
                    })
                }
            })
    }

    useEffect(() => {

        var companyOpts = [
            { Name: 'Startech Retail Server 2', Ip: 'https://221.120.99.28:44331', CompanyId: 1 },
            { Name: 'THE DATABIZ SOFTWARE LTD.', Ip: 'https://retail.startech.com.bd:48081', CompanyId: 1 },
            { Name: 'Trade International Ltd.', Ip: 'https://retail.startech.com.bd:48081', CompanyId: 2 }
        ];

        setCompanyOptions(companyOpts);


        fetch(`${userSession.Ip}/API/Login/Get_Location?companyId=${userSession.CompanyId}`)
            .then(res =>
                res.json()
                // console.log(res);
            )
            .then((data) => {
                console.log(data);
                setLocationOptions(data);
            })


    }, [])


    return (
        <div className="nav-item absolute right-1 top-16 bg-white dark:bg-[#42464D] p-8 rounded-lg w-96">
            <div className="flex justify-between items-center">
                <p className="font-semibold text-lg dark:text-gray-200">User Profile</p>
                <Button
                    icon={<MdOutlineCancel />}
                    color="rgb(153, 171, 180)"
                    bgHoverColor="light-gray"
                    size="2xl"
                    borderRadius="50%"
                />
            </div>
            <div className="flex gap-5 items-center mt-6 border-color border-b-1 pb-6">
                <img
                    className="rounded-full h-24 w-24"
                    src={avatar}
                    alt="user-profile"
                />
                <div>
                    <p className="font-semibold text-xl dark:text-gray-200"> {userSession?.UserName ? userSession.UserName : 'Not Found'} </p>
                    <p className="text-gray-500 text-sm dark:text-gray-400">  Employee   </p>
                    <p className="text-gray-500 text-sm font-semibold dark:text-gray-400"> {userSession?.EmailAddress ? userSession.EmailAddress : 'Not Found'}</p>
                </div>
            </div>
            <div>
                {userProfileData.map((item, index) => (
                    <div key={index} className="flex gap-5 border-b-1 border-color p-4 hover:bg-light-gray cursor-pointer  dark:hover:bg-[#42464D]">
                        <button
                            type="button"
                            style={{ color: item.iconColor, backgroundColor: item.iconBg }}
                            className=" text-xl rounded-lg p-3 hover:bg-light-gray"
                        >
                            {item.icon}
                        </button>

                        <div>
                            <p className="font-semibold dark:text-gray-200 ">{item.title}</p>
                            <p className="text-gray-500 text-sm dark:text-gray-400"> {item.desc} </p>
                        </div>
                    </div>
                ))}






                {/* //Change Compnay er button ta comment kora, cz customer er lagbena */}

                {/* <div className="flex gap-5 border-b-1 border-color p-4 hover:bg-light-gray cursor-pointer  dark:hover:bg-[#42464D]"
                    onClick={changeCompany}
                >
                    <button
                        type="button"
                        // style={{ color: item.iconColor, backgroundColor: item.iconBg }}
                        className=" text-xl rounded-lg p-3 hover:bg-light-gray"
                    >
                        <BsBuilding />
                    </button>

                    <div>
                        <p className="font-semibold dark:text-gray-200 ">Change Company</p>
                        <p className="text-gray-500 text-sm dark:text-gray-400">Now Selected: {userSession?.CompanyName ? userSession.CompanyName : ''}{`(${userSession?.LocationName ? userSession.LocationName : ''})`} </p>
                    </div>
                </div> */}


            </div>
            <div className="mt-5">
                {/* <Button
                    color="white"
                    bgColor={currentColor}
                    text="Logout"
                    borderRadius="10px"
                    width="full"
                    onClick={logoutBtn}
                /> */}
                <button
                    type="button"
                    onClick={() => logoutBtn()}
                    style={{ backgroundColor: currentColor, color: 'white', borderRadius: '10px' }}
                    className={`transform-all duration-300 hover:scale-105 transform-gpu focus:shadow-lg focus:outline-none focus:ring-0 active:-translate-y-1 active:shadow-lg p-3 w-full hover:drop-shadow-xl`}
                >
                    Logout
                </button>
            </div>


            {/* // modals --- out of html normal body/position */}
            <Modal
                open={companyChangeModalOpen}
                onClose={handleCompanyModalClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={companyChangeModalStyle}>
                    <fieldset className=" border border-solid border-gray-300 px-3 pt-1 pb-3 dark:text-slate-50">
                        <legend className="text-sm">Change Company and Location</legend>
                        <div className=' grid-cols-3 grid gap-x-4 gap-y-1'>

                            <div className=' col-span-2'>

                                <Autocomplete
                                    id=""
                                    clearOnEscape
                                    size="small"
                                    // options={[{ Name: 'Startech Hub 1', Ip: '111.1.1.1', Id: 'CompanyId1' }, { Name: 'Startech Hub 2', Ip: '222.2.2.2', Id: 'CompanyId2' }]}
                                    options={companyOptions}
                                    // defaultValue={(locationOutput) ? locationOutput : { Name: "", LocationId: "" }}
                                    value={activeCompany}
                                    // defaultValue={locationOutput?.Name ? locationOutput?.Name : ''}
                                    getOptionLabel={(option) => (option.Name) ? option.Name : ""}

                                    onChange={(e, selectedOption) => {
                                        onSelCompany(e, selectedOption);
                                    }}
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
                                            label="Company" variant="standard" />
                                    )}
                                />

                            </div>


                            <div className=''>
                                <Autocomplete
                                    id=""
                                    clearOnEscape
                                    size="small"

                                    // options={[{ Name: 'Head Office', Id: '6' }, { Name: 'Idb', Id: '3' }]}

                                    options={locationOptions}

                                    // defaultValue={(locationOutput) ? locationOutput : { Name: "", LocationId: "" }}
                                    value={selLocation}
                                    // defaultValue={locationOutput?.Name ? locationOutput?.Name : ''}
                                    getOptionLabel={(option) => (option.Name) ? option.Name : ""}

                                    onChange={(e, selectedOption) => {
                                        console.log(selectedOption);
                                        if (selectedOption) {
                                            setSelLocation(selectedOption);
                                        }
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            sx={{ width: '100%', marginTop: 1 }}
                                            {...params}

                                            InputProps={{ ...params.InputProps, style: { fontSize: 13 } }}
                                            InputLabelProps={{
                                                ...params.InputLabelProps, style: { fontSize: 14 },

                                            }}
                                            onChange={(newValue) => {

                                                console.log("autocomp Changed");
                                            }}
                                            label="Location" variant="standard" />
                                    )}
                                />
                            </div>


                            <div className=''>
                                <button
                                    type="button"
                                    data-mdb-ripple="true"
                                    data-mdb-ripple-color="light"
                                    className="inline-block mt-5 px-4 py-1.5 bg-blue-600 text-white font-medium text-xs leading-tight rounded shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out"
                                    onClick={() => { changeCompanyBtn() }}
                                >Change</button>
                            </div>
                        </div>
                    </fieldset>
                </Box>
            </Modal>


        </div>

    );
};

export default UserProfile;
