import { React, useState, useEffect } from 'react';
import { useStateContext } from '../../contexts/ContextProvider';
import { useNavigate } from 'react-router-dom';
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
import { useForm } from "react-hook-form";

const Login_BR = (props) => {

    const { setShowPanel, setShowNavbar } = useStateContext();
    useEffect(() => {
        setShowPanel(props.panelShow);
        setShowNavbar(props.navbarShow);
    }, [])

    const { register, unregister, getValues } = useForm();
    const [showPassword, setShowPassword] = useState(false);
    const [location, setLocation] = useState([]);
    const [company, setCompany] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {


        fetch('http://221.120.99.25:8082/API/Login/Get_Company')
            .then(res =>
                res.json()
                // console.log(res);
            )
            .then((data) => { console.log(data); setCompany(data) })
    }, [])



    //password eye button to show/hide pass
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };


    const submitLogin = () => {
        console.log("login button clicked");
        var formData = getValues();
        console.log(formData);
        ;
        axios.get('http://221.120.99.25:8082/API/Login/Get_UserPassMatch', { params: formData })
            .then(res => {
                console.log("insert er axios!!")
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
                        Ip: 'http://221.120.99.25:8082',

                    };
                    fetch(`http://221.120.99.25:8082/API/JournalVoucher/CheckBrFeatures?companyId=${res.data.CompanyId}`)
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

                            //ekhane local and session storage overwrite hoye jaitese,,,, so ekta object er moddhe duita jinish, userInfo and brFeature rakhte hobe.... jekhane jekhane userInfo purata pathaisos oigula thik korte hobe


                            // var rupom = sessionStorage.getItem("userInfo");
                            // console.log(rupom);
                            // navigate.push("https://www.youtube.com");

                            navigate('/journalVoucher')
                        })


                    // reset();
                }
                else {
                    toast.error(`Your User Id and Password didn't match!`);
                    if (localStorage.getItem("userInfo") && localStorage.getItem("brFeature")) {
                        localStorage.removeItem('userInfo');
                        // sessionStorage.removeItem('userInfo');
                        localStorage.removeItem('userInfo');
                    }
                }

            })




    }
    return (
        <div className='mt-16 md:mt-2'>

            <div className="m-2 flex justify-center">
                <div className="block w-3/5">

                    {/* Main Card */}
                    <div className="block rounded-lg shadow-lg bg-white dark:bg-secondary-dark-bg  text-center">
                        {/* Main Card header */}
                        <div className="py-3 'bg-white text-xl dark:text-gray-200 text-center px-6 border-b border-gray-300">
                            LOGIN
                        </div>
                        {/* Main Card header--/-- */}

                        {/* Main Card body */}
                        <div className=" px-6 pb-4 text-start grid grid-cols-4 gap-4 mt-6">

                            <div className=" col-span-4">

                                <Autocomplete
                                    id="company"
                                    clearOnEscape
                                    size="small"
                                    options={company}
                                    getOptionLabel={(option) => option.Name.toString()}
                                    onChange={(e, selectedOption) => {

                                        unregister("companyId");
                                        unregister("companyName");
                                        register("companyId", { value: selectedOption.CompanyId })
                                        register("companyName", { value: selectedOption.Name })
                                        fetch(`http://221.120.99.25:8082/API/Login/Get_Location?companyId=${selectedOption.CompanyId}`)
                                            .then(res =>
                                                res.json()
                                                // console.log(res);
                                            )
                                            .then((data) => { console.log(data); setLocation(data) })
                                        console.log(selectedOption);
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            sx={{ width: '100%', margin: 1 }}
                                            {...params}

                                            InputProps={{ ...params.InputProps, style: { fontSize: 16 } }}
                                            InputLabelProps={{
                                                ...params.InputLabelProps, style: { fontSize: 16 },

                                            }}
                                            onChange={(newValue) => {
                                                console.log("autocomp Changed")
                                            }}
                                            label="Company" variant="outlined" />
                                    )}
                                />
                                <Autocomplete
                                    id="location"
                                    clearOnEscape
                                    size="small"
                                    options={location}
                                    getOptionLabel={(option) => option.Name.toString()}
                                    onChange={(e, selectedOption) => {
                                        console.log(selectedOption);
                                        unregister("locationId");
                                        unregister("locationName");

                                        register("locationId", { value: selectedOption.LocationId })
                                        register("locationName", { value: selectedOption.Name })
                                        console.log("values after selection");

                                        console.log(getValues());
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            sx={{ width: '100%', margin: 1 }}
                                            {...params}
                                            InputProps={{ ...params.InputProps, style: { fontSize: 16 } }}
                                            InputLabelProps={{
                                                ...params.InputLabelProps, style: { fontSize: 16 },

                                            }}
                                            onChange={(newValue) => {
                                                console.log("autocomp Changed")
                                            }}
                                            label="Location" variant="outlined" />
                                    )}
                                />

                                <FormControl sx={{ m: 1, width: '100%' }} size="small" variant="outlined">
                                    <InputLabel htmlFor="outlined-adornment-username">User Name</InputLabel>
                                    <OutlinedInput
                                        {...register("userName")}
                                        id="outlined-adornment-username"
                                        type='text'
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <AccountCircle />
                                            </InputAdornment>
                                        }
                                        label="User Name"
                                    />
                                </FormControl>

                                <FormControl sx={{ m: 1, width: '100%' }} size="small" variant="outlined">
                                    <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                                    <OutlinedInput
                                        id="outlined-adornment-password"
                                        {...register("password")}
                                        type={showPassword ? 'text' : 'password'}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                    edge="end"
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                        label="Password"
                                    />
                                </FormControl>
                            </div>



                        </div>
                        {/* Main Card Body--/-- */}

                        {/* Main Card footer */}
                        <div className="py-3 px-6 border-t text-start flex justify-center border-gray-300 text-gray-600">
                            <div className="flex gap-x-3">
                                <button
                                    type="button"
                                    data-mdb-ripple="true"
                                    data-mdb-ripple-color="light"
                                    className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out"
                                    onClick={() => { submitLogin() }}
                                >Login</button>

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

export default Login_BR