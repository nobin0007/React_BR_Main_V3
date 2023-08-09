import React, { createContext, useContext, useState } from 'react';
const StateContext = createContext();

const initialState = {
    chat: false,
    cart: false,
    userProfile: false,
    notification: false,
}

export const ContextProvider = ({ children }) => {
    const [showPanel, setShowPanel] = useState(true);
    const [showNavbar, setShowNavbar] = useState(true);

    const [activeMenu, setActiveMenu] = useState(undefined);
    const [screenSize, setScreenSize] = useState(undefined);
    const [currentColor, setCurrentColor] = useState('#1c64f2');
    const [currentMode, setCurrentMode] = useState('Light');
    const [themeSettings, setThemeSettings] = useState(false);
    const [isClicked, setIsClicked] = useState(initialState);



    //states for databiz
    const [voucherToEdit, setVoucherToEdit] = useState(0);

    const [jvToEdit, setJvToEdit] = useState(0);
    const [contraVouchToEdit, setContraVouchToEdit] = useState(0);
    const [debitVouchToEdit, setDebitVouchToEdit] = useState(0);
    const [creditVouchToEdit, setCreditVouchToEdit] = useState(0);
    const [vouchAgtVouchToEdit, setVouchAgtVouchToEdit] = useState(0);




    const setMode = (e) => {
        // console.log(e);
        setCurrentMode(e.target.value);
        localStorage.setItem('themeMode', e.target.value);
        setThemeSettings(false);
    }
    const setColor = (color) => {
        console.log(color);
        setCurrentColor(color);
        localStorage.setItem('colorMode', color);
        setThemeSettings(false);
    }

    const handleClick = (clicked) => {
        // console.log(isClicked);

        //ekhane toggle er kaaj ta if else diye kora
        if (initialState.hasOwnProperty(clicked)) {
            setIsClicked({ ...initialState, [clicked]: !isClicked[clicked] });
        }
        else {
            setIsClicked({ ...initialState, [clicked]: true });
        }


    }

    return (
        <StateContext.Provider value={{
            activeMenu,
            setActiveMenu,
            showNavbar, setShowNavbar,
            showPanel, setShowPanel,
            isClicked, initialState,
            setIsClicked,
            handleClick,
            screenSize, setScreenSize,
            currentColor, currentMode,
            setCurrentColor, setCurrentMode,
            themeSettings, setThemeSettings,
            setMode, setColor,

            // databiz states share
            voucherToEdit, setVoucherToEdit,

            jvToEdit, setJvToEdit,
            contraVouchToEdit, setContraVouchToEdit,
            debitVouchToEdit, setDebitVouchToEdit,
            creditVouchToEdit, setCreditVouchToEdit,
            vouchAgtVouchToEdit, setVouchAgtVouchToEdit
        }}>
            {children}
        </StateContext.Provider>
    )
}
export const useStateContext = () => useContext(StateContext);