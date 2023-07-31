import * as React from 'react';
import * as _ from 'lodash';
import { useState, useEffect, useRef } from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MobileStepper from '@mui/material/MobileStepper';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

//modal
import Backdrop from '@mui/material/Backdrop';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Grid from '@mui/material/Grid';

import Tooltip from '@mui/material/Tooltip';
import Slider from "react-slick";
import { maxHeight } from '@mui/system';

const previewModalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 'auto',
    height: 'auto',
    maxWidth: '90%',
    maxHeight: '90%',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 0,
};

const FileLoader = (props) => {

    // const attachments = props.attachments;
    // const setAttachments = props.setAttachments;
    // const imgPerSlide = props.imgPerSlide;


    const [attachments, setAttachments] = useState([]);
    const [boole, setBoole] = useState(true);
    const [previwModalOpen, setPreviwModalOpen] = useState(false);
    const [prevImg, setPrevImg] = useState('');
    // const sliderRef = useRef(null);

    const handlePreviwModalClose = () => {
        console.log("camera closed");
        setPreviwModalOpen(false);
    };

    var settings = {
        dots: true,
        infinite: false,
        speed: 500,
        // slidesToShow: imgPerSlide,
        slidesToShow: 3,
        slidesToScroll: 1,
        // initialSlide: 0,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    // initialSlide: 2
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };


    const attachmentsChanged = async (e) => {
        var fileList = e.target.files;
        console.log(fileList);
        // let allAttachments = _.cloneDeep(attachments);
        if (fileList && fileList.length > 0) {
            const newFilesPromises = []
            for (let i = 0; i < e.target.files.length; i++) {
                newFilesPromises.push(fileToDataUri(fileList[i]))
            }
            const newFiles = await Promise.all(newFilesPromises);
            setAttachments([...newFiles, ...attachments]);
            setBoole(false);
            setTimeout(() => {
                setBoole(true);
            }, 1);

        }
    }

    const fileToDataUri = (file) => {
        return new Promise((res) => {
            const reader = new FileReader();
            const { name } = file;

            let fileExtension = name.substr((name.lastIndexOf('.') + 1)).toLowerCase();
            // let fileExtension = name.split('.').pop()
            let fileThumbnail = '';
            let downloadable = true;

            if (fileExtension == 'jpg' || fileExtension == 'jpeg' || fileExtension == 'png' || fileExtension == 'gif') {
                downloadable = false;
            }
            else if (fileExtension == 'mp4' || fileExtension == 'webm' || fileExtension == 'mkv' || fileExtension == 'wmv') {
                fileThumbnail = "https://i.ibb.co/cNLBwjY/Video-File-Icon.png";
                downloadable = true;
            }
            else if (fileExtension == 'xlsx' || fileExtension == 'xls' || fileExtension == 'csv') {
                fileThumbnail = "https://i.ibb.co/5THHDGH/Excel-File-Icon-svg.png";
                downloadable = true;
            }
            else if (fileExtension == 'doc' || fileExtension == 'docx' || fileExtension == 'dot' || fileExtension == 'dotx') {
                fileThumbnail = "https://i.ibb.co/Z219ZB3/Word-File-Icon.png";
                downloadable = true;
            }
            else if (fileExtension == 'pdf') {
                fileThumbnail = "https://i.ibb.co/b5Dq1Q3/Pdf-File-Icon-svg.png";
                downloadable = true;
            }
            else {
                fileThumbnail = "https://i.ibb.co/hsnss8w/general-File-Icon.png";
                downloadable = true;
            }

            reader.addEventListener('load', () => {
                res({
                    fileB64format: reader.result,
                    fileName: name,
                    fileExtension: fileExtension,
                    fileThumbnail: fileThumbnail,
                    downloadable: downloadable
                })
            });
            reader.readAsDataURL(file);
        })
    }


    const previewFile = (e) => {
        console.log("prev file");
        setPrevImg(e.target.currentSrc);
        setPreviwModalOpen(true);

    }

    const downloadFile = (e) => {
        window.location = e.target.getAttribute('data-fileb64');
        // console.log(e.target.getAttribute('data-fileb64'));
    }

    const deleteFile = (index) => {
        let allAttachments = _.cloneDeep(attachments);

        console.log("whole array b4 delete");
        console.log(allAttachments);
        console.log("index no delete");
        console.log(index);
        allAttachments.splice(index, 1);
        console.log("after delete");
        console.log(allAttachments);
        setAttachments(allAttachments);

    }

    function rupom() {
        // setBoole((prevVal) => !prevVal);
        // sliderRef.current.slickGoTo(1);
    }


    return (
        // return wrapper div
        <div className='mt-16 md:mt-2'>

            <div className="m-2 flex justify-center">
                <div className="block w-11/12 ">

                    {/* Main Card */}
                    <div className="block rounded-lg shadow-lg bg-white dark:bg-secondary-dark-bg  text-center">
                        {/* Main Card header */}
                        <div className="py-3 text-xl dark:text-gray-200 text-start px-6 border-b border-gray-300">
                            File Loader
                        </div>
                        {/* Main Card header--/-- */}

                        {/* Main Card body */}
                        <div className=" px-6 pb-4 text-start md:min-h-[60vh] grid md:grid-cols-3 grid-cols-1 gap-4 mt-2">

                            <div >
                                {/* <h2> Responsive </h2> */}
                                <div className='relative -mb-[11px] -ml-[11px] z-[1]'>
                                    <input type="file" id="fileAttachInput" multiple="multiple" onChange={attachmentsChanged} hidden="hidden" />

                                    {attachments.length ? (
                                        <Tooltip title="Attach File" arrow>
                                            <label htmlFor="fileAttachInput" id="attachmentLabel" className='inline-block px-[6px] py-1 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded-full shadow-md cursor-pointer hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 transition ease-in-out'><i className="fas fa-plus"></i>
                                            </label>
                                        </Tooltip>) : (
                                        <label htmlFor="fileAttachInput" id="attachmentLabel" className='inline-block px-[6px] py-1 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded-full shadow-md cursor-pointer hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 transition ease-in-out '><i className="fas fa-plus"></i> Attach Files
                                        </label>
                                    )}


                                </div>

                                {/* <button>
                                    <input type="file" id="fileAttachInput" multiple="multiple" hidden="hidden" />
                                </button> */}
                                {attachments.length ? (<Slider {...settings} className='pt-2 pb-1 px-1 border-1 rounded border-zinc-300 min-h-[25%]'>
                                    {attachments.map((perAttachment, index) => (
                                        <div key={index} className='border-x-4 border-transparent hover:translate-y-1 active:translate-y-0 transform-all ease-in-out duration-150'>
                                            <div className='flex'>
                                                {/* <img src={(perAttachment.downloadable) ? perAttachment.fileThumbnail : perAttachment.fileB64format}  */}
                                                <img src={(perAttachment.downloadable) ? perAttachment.fileThumbnail : perAttachment.fileB64format} data-fileb64={(perAttachment.downloadable) ? perAttachment.fileB64format : ''} className='rounded-t-md border-t-2 border-x-2 border-zinc-300 cursor-zoom-in object-cover w-full h-20' alt="" onClick={(perAttachment.downloadable) ? downloadFile : previewFile} />

                                                <div className='-mt-[3px] mr-[0px] -ml-[17px]'>
                                                    <Tooltip title="Delete" arrow>
                                                        <i className="fas fa-times p-[2px] py-[0px] text-[12px] rounded-sm bg-opacity-50 bg-gray-100 text-rose-700 hover:bg-opacity-90 cursor-pointer hover:scale-110 hover:text-gray-100 hover:bg-rose-600 transform-all duration-150 ease-in-out" onClick={() => deleteFile(index)}></i>
                                                    </Tooltip>

                                                </div>

                                            </div>

                                            {/* {(perImage.label.length > 5) ? (<Tooltip title={perImage.label} arrow>
                                                <p className=' px-[2px] text-sm bg-gray-300 rounded-b-md text-center'>{perImage.label.slice(0, 5) + "..."}</p>
                                            </Tooltip>) : <p className='px-[2px] text-sm bg-gray-300 rounded-b-md text-center'>{perImage.label}</p>} */}

                                            <Tooltip title={perAttachment.fileName} arrow>
                                                <p className='px-[5px] truncate text-sm bg-zinc-300 cursor-help rounded-b-md text-center'>
                                                    {perAttachment.fileName}
                                                </p>
                                            </Tooltip>
                                        </div>
                                    ))}
                                </Slider>) : ''}

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
                                    onClick={() => rupom()}
                                >Save & Continue</button>
                            </div>

                        </div>
                        {/* Main Card footer--/-- */}
                    </div>
                    {/* Main Card--/-- */}

                </div>
            </div>



            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={previwModalOpen}
                onClose={handlePreviwModalClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={previwModalOpen}>
                    <Box sx={previewModalStyle}>
                        {/* <Button onClick={handlePreviwModalClose}>close modal</Button> */}

                        <div className='flex'>
                            <img src={prevImg} className='w-auto max-h-[80vh]' alt="" />
                            <div className='-ml-[25px] mt-[5px]'>
                                <Tooltip title="Close" arrow>
                                    <i className="fas fa-minus p-[2px] py-[0px] text-[16px] rounded-sm bg-opacity-70 bg-gray-100 text-blue-900  cursor-pointer hover:scale-110 hover:bg-opacity-90 hover:text-gray-100 hover:bg-blue-900 transform-all duration-150 ease-in-out" onClick={handlePreviwModalClose}></i>
                                </Tooltip>
                            </div>

                        </div>



                    </Box>
                </Fade>
            </Modal>


        </div>
        // return wrapper div--/--


    )
}

export default FileLoader