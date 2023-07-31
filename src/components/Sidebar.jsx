import React from 'react'
import { Link, NavLink } from 'react-router-dom';
import { SiShopware } from 'react-icons/si';
import { MdOutlineCancel } from 'react-icons/md';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';

import { links } from '../data/dummy';
import { useStateContext } from '../contexts/ContextProvider';

const Sidebar = () => {
    const { activeMenu, setActiveMenu, screenSize, currentColor } = useStateContext();

    const handleCloseSidebar = () => {
        if (activeMenu && screenSize <= 900) {
            setActiveMenu(false)
        }
    }

    const activeLink = 'flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-white text-md m-2';

    const normalLink = 'flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-white text-md text-gray-700 transform-all duration-300 dark:text-gray-200 dark:hover:text-black  dark:hover:transform-all duration-300 hover:transform-all duration-300  hover:scale-105 hover:bg-light-gray m-2'

    const subactiveLink = 'flex items-center gap-5 pl-9 pt-2 pb-2.5 rounded-lg text-white text-md m-2';

    const subnormalLink = 'flex items-center gap-5 pl-9 pt-3 pb-2.5 rounded-lg text-white text-md text-gray-700 transform-all duration-300 dark:text-gray-200 dark:hover:text-black dark:hover:transform-all duration-300 hover:transform-all duration-300  hover:scale-105 hover:bg-light-gray m-2'

    return (
        <div className='ml-3 scroller h-screen md:overflow-hidden overflow-auto md:hover:overflow-auto pb-10'>
            {activeMenu && (<>
                <div className='flex justify-between items-center'>

                    {/* Company name & logo */}
                    <Link to="/" className='items-center gap-3 ml-3 mt-4 flex text-xl font-extrabold tracking-tight dark:text-white text-slate-900' onClick={handleCloseSidebar}>
                        <div className="hover:animate-bounce flex items-center gap-5"><SiShopware /> <span>Bizness Roots</span></div>
                    </Link>

                    {/* Close button Dashboard */}
                    <TooltipComponent content="Menu" position="BottomCenter" >
                        <button type="button" onClick={() => setActiveMenu((prevActiveMenu) => !prevActiveMenu)} className="text-xl rounded-full p-3 hover:bg-light-gray mt-4 block md:hidden">
                            <MdOutlineCancel />
                        </button>
                    </TooltipComponent>
                </div>

                {/* menus of Dashboard */}
                <div className="mt-10">

                    {links.map((item) => (

                        <div key={item.title}>
                            <p className='text-gray-400 dark:text-gray-400 m-3 mt-4 uppercase'>
                                {item.title}
                            </p>

                            {item.links.map((link) => (

                                <div key={link.name}>

                                    {!(link.sublinks) &&
                                        <NavLink
                                            to={`/${link.path}`}
                                            onClick={handleCloseSidebar}
                                            style={({ isActive }) => ({
                                                backgroundColor: isActive ? currentColor : ''
                                            })}
                                            className={({ isActive }) => isActive ? activeLink : normalLink}
                                        >
                                            {link.icon}
                                            <span className='capitalize'>
                                                {link.name}
                                            </span>
                                        </NavLink>
                                    }

                                    {(link.sublinks) &&
                                        <>
                                            <div className="accordion" id="menuAccordion">

                                                <div className="accordion-item">

                                                    <button className="
                                                            accordion-button
                                                            menu-accordion-button
                                                            collapsed
                                                            relative
                                                            flex
                                                            items-center
                                                            w-[94%]
                                                            
                                                            gap-5 px-4 pt-3 pb-2.5 rounded-lg  text-md  transform-all duration-300 hover:scale-105 dark:text-gray-200 dark:hover:text-black   hover:bg-light-gray m-2

                                                            text-base text-gray-700 text-left"
                                                        type="button" data-bs-toggle="collapse" data-bs-target={`#${link.name}`} aria-expanded="false"
                                                        aria-controls={link.name}>
                                                        {link.icon}
                                                        <span className='capitalize'>
                                                            {link.name}
                                                        </span>
                                                    </button>

                                                    <div id={link.name} className="accordion-collapse collapse" aria-labelledby={link.name}
                                                        data-bs-parent="#menuAccordion">
                                                        <div className="accordion-body ">
                                                            {link.sublinks && link.sublinks.map((sublink) => (
                                                                <NavLink
                                                                    to={`/${sublink.name}`}
                                                                    key={sublink.name}
                                                                    onClick={handleCloseSidebar}
                                                                    style={({ isActive }) => ({
                                                                        backgroundColor: isActive ? currentColor : ''
                                                                    })}
                                                                    className={({ isActive }) => isActive ? subactiveLink : subnormalLink}
                                                                >
                                                                    {sublink.icon}
                                                                    <span className='capitalize'>
                                                                        {sublink.name}
                                                                    </span>
                                                                </NavLink>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>








                                            {/* <NavLink
                                                to={`/${link.name}`}
                                                key={link.name}
                                                onClick={handleCloseSidebar}
                                                style={({ isActive }) => ({
                                                    backgroundColor: isActive ? currentColor : ''
                                                })}
                                                className={({ isActive }) => isActive ? activeLink : normalLink}
                                            >
                                                {link.icon}
                                                <span className='capitalize'>
                                                    {link.name}
                                                </span>
                                            </NavLink>

                                            {link.sublinks && link.sublinks.map((sublink) => (
                                                <NavLink
                                                    to={`/${sublink.name}`}
                                                    key={sublink.name}
                                                    onClick={handleCloseSidebar}
                                                    style={({ isActive }) => ({
                                                        backgroundColor: isActive ? currentColor : ''
                                                    })}
                                                    className={({ isActive }) => isActive ? subactiveLink : subnormalLink}
                                                >
                                                    {sublink.icon}
                                                    <span className='capitalize'>
                                                        {sublink.name}
                                                    </span>
                                                </NavLink>
                                            ))} */}
                                        </>
                                    }


                                </div>

                            ))}

                        </div>

                    ))}

                </div>

            </>)}

        </div>
    )
}

export default Sidebar