import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { FiSettings } from 'react-icons/fi';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Navbar, Footer, Sidebar, ThemeSettings } from './components';
import { useStateContext } from './contexts/ContextProvider';
import './App.css'
import { ThemeProvider, createTheme } from '@mui/material';
import JournalVoucher from './pages/JournalVoucher/JournalVoucher';
import FileLoader from './pages/FileLoader';
import Login_BR from './pages/Login/Login_BR';
import VoucherEdit from './pages/VoucherEdit/VoucherEdit';
import DebitVoucher from './pages/DebitVoucher/DebitVoucher';
import CreditVoucher from './pages/CreditVoucher/CreditVoucher';
import ContraVoucher from './pages/ContraVoucher/ContraVoucher';
import VoucherAgainstVoucher from './pages/VoucherAgainstVoucher/VoucherAgainstVoucher';
import ProductionPlantAndGroup from './pages/ProductionPlantAndGroup/ProductionPlantAndGroup';
import NameAgtAccSetup from './pages/NameAgtAccSetup/NameAgtAccSetup';
import AnalysisHeadAndGroup from './pages/AnalysisHeadAndGroup/AnalysisHeadAndGroup';

const App = () => {

    const { initialState, activeMenu, showPanel, showNavbar, setActiveMenu, themeSettings, setThemeSettings, currentColor, currentMode, screenSize, setIsClicked } = useStateContext();


    const hideAllOpened = () => {
        setThemeSettings(false);
        setIsClicked(initialState);
        // console.log("function e dhukse");

        if (activeMenu && screenSize <= 900) {
            setActiveMenu(false);
        }
    }


    return (
        <div className={currentMode === 'Dark' ? 'dark' : ''}>
            <ThemeProvider theme={createTheme({
                palette: {
                    mode: currentMode === 'Dark' ? 'dark' : 'light',
                },
            })}>

                <BrowserRouter>
                    {/* <Routes>
                        <Route path="/login" element={<Login />} />
                    </Routes> */}
                    {/* --the most super background on which everything is situated-- */}
                    <div className='flex relative dark:bg-main-dark-bg'>

                        {/* --Settings Icon & button-- */}
                        <div className={`fixed right-4 bottom-4 ${showPanel ? '' : 'hidden'}`} style={{ zindex: '1000' }}>

                            <TooltipComponent content="Settings" position="Top">

                                <button type="button" onClick={() => setThemeSettings(true)} className="text-2xl p-3 hover:drop-shadow-2xl hover:scale-110 transform-all duration-300 hover:transform-all hover:bg-light-gray text-white" style={{ background: currentColor, borderRadius: '50%' }}>
                                    <FiSettings />
                                </button>

                            </TooltipComponent>

                        </div>

                        {/* --Sidebar depending on 'activeMenu' var--  */}
                        {activeMenu ?
                            (

                                <div className={`w-72 fixed sidebar drop-shadow-lg bg-white dark:bg-secondary-dark-bg transition-all duration-300 ${showPanel ? '' : 'hidden'}`} id="sidebarDiv">
                                    <Sidebar />
                                </div>
                            )
                            :
                            (
                                <div className={`transition-all duration-300 w-0 drop-shadow-2xl  bg-white dark:bg-secondary-dark-bg ${showPanel ? '' : 'hidden'}`}>
                                    <Sidebar />
                                </div>
                            )
                        }

                        {/* --main background--  */}
                        <div className={
                            `dark:bg-main-dark-bg bg-main-bg min-h-screen w-full
                        ${(activeMenu && showPanel) ? 'md:ml-72' : 'flex-2'}`}
                        >
                            <div className={`fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full ${showNavbar ? '' : 'invisible'}`}>
                                <Navbar />
                            </div>


                            <div>
                                {themeSettings && <ThemeSettings />}
                                {/* --declaring routes of components/pages--  */}
                                <div onClick={() => hideAllOpened()}>
                                    <Routes>
                                        {/* Dahsboard */}
                                        <Route path="/" element={<Login_BR panelShow={false} navbarShow={false} />} />

                                        {/* databiz Bizness Roots Pages */}
                                        <Route path="/journalVoucher" element={<JournalVoucher panelShow={true} navbarShow={true} />} />
                                        {/* <Route path="/nameAgtAccSetup" element={<NameAgtAccSetup panelShow={true} navbarShow={true} />} /> */}


                                        {/* <Route path="/journalVoucherEdit" element={<JournalVoucherEdit panelShow={true} navbarShow={true} />} /> */}
                                        {/* <Route path="/journalVoucherSaveEdit" element={<JournalVoucherSaveEdit panelShow={true} navbarShow={true} />} /> */}


                                        {/* <Route path="/newJournalVoucher" element={<NewJournalVoucher panelShow={true} navbarShow={true} />} /> */}

                                        <Route path="/fileloader" element={<FileLoader />} />
                                        <Route path="/loginbr" element={<Login_BR panelShow={true} navbarShow={true} />} />

                                        {/* dashboard hidden options */}
                                        <Route path="/journalVoucherIfrm" element={<JournalVoucher panelShow={false} navbarShow={true} />} />
                                        {/* <Route path="/journalVoucherTest" element={<JournalVoucherCopy panelShow={true} navbarShow={true} />} /> */}

                                        <Route path="/voucherEdit" element={<VoucherEdit panelShow={true} navbarShow={true} />} />

                                        <Route path="/debitVoucher" element={<DebitVoucher panelShow={true} navbarShow={true} />} />
                                        <Route path="/creditVoucher" element={<CreditVoucher panelShow={true} navbarShow={true} />} />
                                        <Route path="/contraVoucher" element={<ContraVoucher panelShow={true} navbarShow={true} />} />
                                        <Route path="/vouchAgtVouch" element={<VoucherAgainstVoucher panelShow={true} navbarShow={true} />} />
                                        <Route path="/nameAgtAccSetup" element={<NameAgtAccSetup panelShow={true} navbarShow={true} />} />
                                        <Route path="/analysisHeadAndGroup" element={<AnalysisHeadAndGroup panelShow={true} navbarShow={true} />} />

                                        <Route path="/prodPlantAndGroup" element={<ProductionPlantAndGroup panelShow={true} navbarShow={true} />} />






                                        {/* <Route path="/journalVoucherIfrm" element={<JournalVoucher panelShow={false} navbarShow={true} />} /> */}
                                        <Route path="/loginbrmain" element={<Login_BR panelShow={false} navbarShow={false} />} />
                                        {/* <Route path="/voucherEdit" element={<VoucherEdit panelShow={false} navbarShow={false} />} /> */}
                                        {/* <Route path="/jv" element={<JournalVoucher panelShow={false} navbarShow={false} />} /> */}



                                        {/* <Route path="/test" element={<TestMRT />} /> */}



                                    </Routes>

                                </div>

                            </div>
                        </div>
                    </div>
                </BrowserRouter>
                <ToastContainer
                    theme='colored'
                    position="bottom-right"
                    autoClose={2000}
                    pauseOnHover={true}
                    draggable={true}
                    closeOnClick={true}
                    hideProgressBar={false}
                    newestOnTop={false}
                    pauseOnFocusLoss
                />

            </ThemeProvider>
        </div>
    )
}

export default App