import React from 'react';
import axios from 'axios';
import { useState, useEffect, useCallback, useRef } from 'react';
import * as _ from 'lodash';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Modal,
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
import MaterialReactTable, { MRT_ColumnDef } from 'material-react-table';

import { useForm, Controller } from "react-hook-form";

import './ProductionPlantAndGroup.css';

import Popper from "@material-ui/core/Popper";
import { ExportToCsv } from 'export-to-csv';
import { useStateContext } from '../../contexts/ContextProvider';
// import muiStyleCustom from '../muiStyleCustom';
import { redirect, useNavigate } from 'react-router-dom';
//----[loading 10 dummy empty rows on load]----//



const prodGroupModalStyle = {
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

const SubPlantModal = (props) => {
  const { register, getValues, reset, control, setValue } = useForm();

  const btnAddSubPlant = () => {

    if (getValues().subplantNameField) {
      if (props?.prodnPlantSel?.PlantId) {
        //axios diye save in db
        let newPlantName = getValues().subplantNameField;

        let postData = { SubPlantName: newPlantName, PlantId: props.prodnPlantSel.PlantId };
        axios.post(`${userInfo.Ip}/API/ProductionPlantAndGroup/Post_NewSubPlant`, postData)
          .then(res => {
            console.log("insert er axios!!")
            if (res.data > 0) {
              console.log(res);
              toast.success(`Plant named "${getValues().subplantNameField}" has been successfully added`);
              props.setSubPlantModalOpen(false);
              props.setProdnSubPlantOptionsWatch(((prev) => !prev));

            }
            else {
              toast.error(`Error occured: ${res.data}" `);
            }
          })
      }
      else {
        toast.error(`You haven't selected any Plant!`);
      }


      //selection e notun plant selected hoye thaka
    }
    else {
      toast.error(`No data to add!`);
    }


  }

  const subPlantModalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 1,
    px: 1,
    pb: 1,
  };
  return (
    <Modal
      open={props.subPlantModalOpen}
      onClose={() => {
        props.setSubPlantModalOpen(false);
      }}
      aria-labelledby="child-modal-title"
      aria-describedby="child-modal-description"
    >
      <Box sx={{ ...subPlantModalStyle }}>
        <fieldset className="border border-solid border-gray-300 px-3 pt-1 pb-3 dark:text-slate-50">
          <legend className="text-sm">Create a new Sub-plant</legend>
          <div className='mt-2 w-full'>
            <TextField id="subPlantName"
              {...register("subplantNameField")}
              variant="outlined" label="Sub Plant Name" size="small"
              sx={{ width: '100%' }} InputProps={{ style: { fontSize: 13 } }}
              InputLabelProps={{
                style: { fontSize: 14 }
              }}
            />
            <div className='flex w-full mt-3'>
              <Autocomplete
                id="plantNameSel"
                clearOnEscape
                size="small"
                sx={{ width: "100%" }}
                options={props.prodnPlantOptions}
                value={(props.prodnPlantSel) ? props.prodnPlantSel : { PlantId: "", PlantName: "" }}
                getOptionLabel={(option) => (option.PlantName) ? option.PlantName : ""}
                onChange={(e, selectedOption) => {
                  if (selectedOption) {
                    props.setProdnPlantSel({ PlantId: selectedOption.PlantId, PlantName: selectedOption.PlantName });
                  }
                  else {
                    props.setProdnPlantSel({ PlantId: '', PlantName: '' });
                  }
                }
                }
                renderInput={(params) => (
                  <TextField
                    sx={{ width: '100%', marginTop: 1 }}
                    {...params}
                    // {...register("plantNameSel")}

                    InputProps={{ ...params.InputProps, style: { fontSize: 13 } }}
                    InputLabelProps={{
                      ...params.InputLabelProps, style: { fontSize: 14 },

                    }}
                    label="Select a Plant" variant="outlined" />
                )}
              />
              <button
                type="button"
                data-mdb-ripple="true"
                data-mdb-ripple-color="light"
                className=" w-[30%] ml-1 block px-1.5 py-1.5 bg-blue-600 text-white font-medium text-xs leading-tight rounded shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out"
                onClick={() => { props.setPlantModalOpen(true) }}
              >Create Plant</button>
            </div>

            <div>
              <button
                type="button"
                data-mdb-ripple="true"
                data-mdb-ripple-color="light"
                className=" mt-2 inline-block px-4 py-1.5 bg-blue-600 text-white font-medium text-xs leading-tight rounded shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out"
                onClick={() => { btnAddSubPlant() }}
              >Add Sub Plant
              </button>
              <button
                type="button"
                data-mdb-ripple="true"
                data-mdb-ripple-color="light"
                className=" mt-2 ml-2 inline-block px-4 py-1.5 bg-blue-600 text-white font-medium text-xs leading-tight rounded shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out"
                onClick={() => { props.setSubPlantModalOpen(false) }}
              >Cancel
              </button>
            </div>


          </div>
        </fieldset>
        {/* <Button onClick={handleClose}>Close Grand Child Modal</Button> */}
        <PlantModal plantModalOpen={props.plantModalOpen} setPlantModalOpen={props.setPlantModalOpen}
          prodnPlantOptions={props.prodnPlantOptions} prodnPlantSel={props.prodnPlantSel}
          setProdnPlantOptionsWatch={props.setProdnPlantOptionsWatch}
        />
      </Box>
    </Modal>
  );
}

const PlantModal = (props) => {
  const { register, getValues, reset, control, setValue } = useForm();
  const plantModalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 300,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 1,
    px: 1,
    pb: 1,
  };

  const btnAddPlant = () => {

    if (getValues().plantNameField) {
      //axios diye save in db
      let newPlantName = getValues().plantNameField;

      let postData = { PlantName: newPlantName };
      axios.post(`${userInfo.Ip}/API/ProductionPlantAndGroup/Post_NewPlant`, postData)
        .then(res => {
          console.log("insert er axios!!")
          if (res.data > 0) {
            console.log(res);
            toast.success(`Plant named "${getValues().plantNameField}" has been successfully added`);
            props.setPlantModalOpen(false);
            props.setProdnPlantOptionsWatch((prev) => !prev);
          }
          else {
            toast.error(`Error occured: ${res.data}" `);
          }
        })


      //selection e notun plant selected hoye thaka
    }
    else {
      toast.error(`No data to add!`);
    }


  }

  return (
    <Modal
      open={props.plantModalOpen}
      onClose={() => {
        props.setPlantModalOpen(false);
      }}
      aria-labelledby="child-modal-title"
      aria-describedby="child-modal-description"
    >
      <Box sx={{ ...plantModalStyle }}>
        <fieldset className="md:col-span-4 col-span-4 border border-solid border-gray-300 px-3 pt-1 pb-3 dark:text-slate-50">
          <legend className="text-sm">Create a new plant</legend>
          <div className='mt-2'>
            <TextField
              {...register("plantNameField")}
              id="plantName" variant="outlined" label="Plant Name" size="small"
              sx={{ width: '100%' }} InputProps={{ style: { fontSize: 13 } }}
              InputLabelProps={{
                style: { fontSize: 14 }
              }}
            />
            <div>
              <button
                type="button"
                data-mdb-ripple="true"
                data-mdb-ripple-color="light"
                className=" mt-2 inline-block px-4 py-1.5 bg-blue-600 text-white font-medium text-xs leading-tight rounded shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out"
                onClick={() => { btnAddPlant() }}
              >Add Plant</button>
              <button
                type="button"
                data-mdb-ripple="true"
                data-mdb-ripple-color="light"
                className=" mt-2 ml-2 inline-block px-4 py-1.5 bg-blue-600 text-white font-medium text-xs leading-tight rounded shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out"
                onClick={() => { props.setPlantModalOpen(false) }}
              >Cancel </button>
            </div>

          </div>
        </fieldset>
      </Box>
    </Modal>
  );
}

const ProductionPlantAndGroup = (props) => {
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

  const [prodPlantGroupTb, setProdPlantGroupTb] = useState([]);
  const [prodPlantGroupTbWatch, setProdPlantGroupTbWatch] = useState(true);

  const [prodPlantGroupTbRowIndx, setProdPlantGroupTbRowIndx] = useState();

  const [prodnPlantOptions, setProdnPlantOptions] = useState([]);
  const [prodnPlantOptionsWatch, setProdnPlantOptionsWatch] = useState(true);
  const [prodnPlantSel, setProdnPlantSel] = useState();

  const [prodnSubPlantOptions, setProdnSubPlantOptions] = useState([]);
  const [prodnSubPlantOptionsWatch, setProdnSubPlantOptionsWatch] = useState(true);
  const [prodnSubPlantSel, setProdnSubPlantSel] = useState();

  const [prodGroupOptions, setProdGroupOptions] = useState([]);
  const [prodGroupSel, setProdGroupSel] = useState();

  const [prodGroupModalOpen, setProdGroupModalOpen] = useState(false);
  const [subPlantModalOpen, setSubPlantModalOpen] = useState(false);
  const [plantModalOpen, setPlantModalOpen] = useState(false);

  const [currentTrigger, setCurrentTrigger] = useState('Add');
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

  //get all prod plant and group tb data
  useEffect(() => {

    fetch(`${userInfo.Ip}/API/ProductionPlantAndGroup/Get_AllPrdctnPlantAndProdGroup`)
      .then(res =>
        res.json()
        // console.log(res);
      )
      .then((data) => {
        console.log("Fetched Raw data for ProductionPlantsAndProductGroup.....................");
        console.log(data);
        setProdPlantGroupTb(data);
      })
  }, [prodPlantGroupTbWatch])

  //get all plant data
  useEffect(() => {

    fetch(`${userInfo.Ip}/API/ProductionPlantAndGroup/Get_AllProductionPlant`)
      .then(res =>
        res.json()
        // console.log(res);
      )
      .then((data) => {
        console.log("Fetched Raw data for ProductionPlants.....................");
        console.log(data);
        setProdnPlantOptions(data);
      })
  }, [prodnPlantOptionsWatch])

  //get all sub-plant data
  useEffect(() => {

    fetch(`${userInfo.Ip}/API/ProductionPlantAndGroup/Get_AllProductionSubPlant`)
      .then(res =>
        res.json()
        // console.log(res);
      )
      .then((data) => {
        console.log("Fetched Raw data for ProductionSubPlants.....................");
        console.log(data);
        setProdnSubPlantOptions(data);
      })
  }, [prodnSubPlantOptionsWatch])


  //get all prod-group data
  useEffect(() => {

    fetch(`${userInfo.Ip}/API/ProductionPlantAndGroup/Get_AllProductGroup?companyId=${userInfo.CompanyId}`)
      .then(res =>
        res.json()
        // console.log(res);
      )
      .then((data) => {
        console.log("Fetched Raw data for ProductGroup.....................");
        console.log(data);
        setProdGroupOptions(data);
      })
  }, [])



  const prodPlantGroupTbCol = [

    {
      accessorKey: 'ProductGroupName',
      header: 'Product Group Name',
      // enableSorting: false,
      // enableColumnActions: false,
      Cell: ({ cell }) => (
        <TextField
          sx={{ width: '100%' }}
          value={(cell.getValue()) ? cell.getValue() : ""}
          InputProps={{ style: { fontSize: 13 }, disableUnderline: true, readOnly: true }}
          variant="standard" size="small" />)

    },
    {
      accessorKey: 'PlantName', //access nested data with dot notation
      header: 'Plant Name',
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
      accessorKey: 'SubPlantName', //access nested data with dot notation
      header: 'Sub Plant Name',
      // enableSorting: false,
      // enableColumnActions: false,
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
              <IconButton onClick={() => handleEditRow(cell.row.index)}>
                <Edit />
              </IconButton>
            </Tooltip>
            <Tooltip className='' arrow placement="top" title="Delete">
              <IconButton onClick={() => handleDeleteRow(cell.row.index)}>
                <Delete />
              </IconButton>
            </Tooltip>

          </div>
        )
      ),
    },

  ]

  const handleDeleteRow = (index) => {
    console.log("delete");

    let deleteData = { ProductionPlantAndProductGroupId: prodPlantGroupTb[index].ProductionPlantAndProductGroupId };


    Swal.fire({
      title: `Are you sure you want to delete this row?`,
      // text: `If you delete this group, all analysis head assciated with group name:"${accGroupSel.Name}"  will get deleted and all account heads that were permitted for this Group:"${accGroupSel.Name}" will be prohibited!`,
      showDenyButton: true,
      icon: 'question',
      showCancelButton: false,
      confirmButtonText: 'Yes, I am!',
      denyButtonText: `No, I'm Not!`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        axios.post(`${userInfo.Ip}/API/ProductionPlantAndGroup/Delete_ProdPlantAndGroup`, deleteData)
          .then(res => {
            console.log("delete er axios!!")
            if (res.data > 0) {
              console.log(res);
              toast.success(`This row has been successfully deleted`);
              setProdGroupModalOpen(false);
              setProdPlantGroupTbWatch((prev) => !prev);
            }
            else {
              toast.error(`Error occured: ${res.data}" `);
            }
          })
      }

    })

  }

  const handleEditRow = (index) => {
    setCurrentTrigger('Edit')
    setProdnPlantSel({ PlantId: prodPlantGroupTb[index].PlantId, PlantName: prodPlantGroupTb[index].PlantName });

    //fetching the subplant options of that selected plant.......
    fetch(`${userInfo.Ip}/API/ProductionPlantAndGroup/Get_ProductionSubPlantsByPlant?plantId=${prodPlantGroupTb[index].PlantId}`)
      .then(res =>
        res.json()
        // console.log(res);
      )
      .then((data) => {
        console.log("Fetched Raw data for ProductionSubPlants.....................");
        console.log(data);
        setProdnSubPlantOptions(data);
      })

    setProdnSubPlantSel({ SubPlantId: prodPlantGroupTb[index].SubPlantId, SubPlantName: prodPlantGroupTb[index].SubPlantName });
    setProdGroupSel({ ProductGroupId: prodPlantGroupTb[index].ProductGroupId, Name: prodPlantGroupTb[index].ProductGroupName });
    setProdPlantGroupTbRowIndx(index);
    setProdGroupModalOpen(true);
  }

  const btnAddProdGroupAndPlant = () => {
    if (prodGroupSel?.ProductGroupId && prodnPlantSel?.PlantId && prodnSubPlantSel?.SubPlantId) {
      //axios diye save in db
      let postData = { PlantId: prodnPlantSel.PlantId, SubPlantId: prodnSubPlantSel.SubPlantId, ProductGroupId: prodGroupSel.ProductGroupId };
      axios.post(`${userInfo.Ip}/API/ProductionPlantAndGroup/Post_NewProdPlantAndGroup`, postData)
        .then(res => {
          console.log("insert er axios!!")
          if (res.data > 0) {
            console.log(res);
            toast.success(`Plant and ProductGroup has been added successfully`);
            setProdGroupModalOpen(false);
            setProdPlantGroupTbWatch((prev) => !prev);
          }
          else {
            toast.error(`Error occured: ${res.data}" `);
          }
        })

      //selection e notun plant selected hoye thaka
    }
    else {
      toast.error(`You have to fillup all the fields!`);
    }
  }

  const btnUpdateProdGroupAndPlant = () => {
    if (prodGroupSel?.ProductGroupId && prodnPlantSel?.PlantId && prodnSubPlantSel?.SubPlantId) {
      //axios diye save in db
      let particularRow = prodPlantGroupTb[prodPlantGroupTbRowIndx];
      let prevData = {
        ProductionPlantAndProductGroupId: particularRow.ProductionPlantAndProductGroupId,
        PlantId: particularRow.PlantId,
        // PlantName: particularRow.PlantName,
        SubPlantId: particularRow.SubPlantId,
        // SubPlantName: particularRow.SubPlantName,
        ProductGroupId: particularRow.ProductGroupId
      }
      let updatedData = {
        ProductionPlantAndProductGroupId: particularRow.ProductionPlantAndProductGroupId,
        PlantId: prodnPlantSel.PlantId,
        // PlantName: prodnPlantSel.PlantName,
        SubPlantId: prodnSubPlantSel.SubPlantId,
        // SubPlantName: prodnSubPlantSel.SubPlantName,
        ProductGroupId: prodGroupSel.ProductGroupId,
      }
      if (JSON.stringify(prevData) == JSON.stringify(updatedData)) {
        toast.error(`You haven't changed anything!`);
      }
      else {
        axios.post(`${userInfo.Ip}/API/ProductionPlantAndGroup/Update_ProdPlantAndGroup`, updatedData)
          .then(res => {
            console.log("insert er axios!!")
            if (res.data > 0) {
              console.log(res);
              toast.success(`Row-${prodPlantGroupTbRowIndx} has been updated successfully`);
              setProdGroupModalOpen(false);
              setProdPlantGroupTbWatch((prev) => !prev);
            }
            else {
              toast.error(`Error occured: ${res.data}" `);
            }
          })
      }
    }
    else {
      toast.error(`You have to fillup all the fields!`);
    }
  }

  /////////////////EXCEL CSV/////////////////////////////

  const prodPlantGroupTbColXcel = [

    {
      accessorKey: 'ProductGroupName',
      header: 'Product Group Name',
    },
    {
      accessorKey: 'PlantName', //access nested data with dot notation
      header: 'Plant Name',
    },
    {
      accessorKey: 'SubPlantName', //access nested data with dot notation
      header: 'Sub Plant Name',
    }
  ]

  const csvOptions = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalSeparator: '.',
    showLabels: true,
    useBom: true,
    useKeysAsHeaders: false,
    headers: prodPlantGroupTbColXcel.map((c) => c.header),
  };
  const csvExporter = new ExportToCsv(csvOptions);
  const handleExportData = () => {

    let prodPlantGroupTbXCEL = [];
    for (let i = 0; i < prodPlantGroupTb.length; i++) {
      let tempObj = {
        ProductGroupName: prodPlantGroupTb[i].ProductGroupName,
        PlantName: prodPlantGroupTb[i].PlantName,
        SubPlantName: prodPlantGroupTb[i].SubPlantName
      }
      prodPlantGroupTbXCEL.push(tempObj);
    }
    csvExporter.generateCsv(prodPlantGroupTbXCEL);
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
              Production Plant & Group
            </div>
            {/* Main Card header--/-- */}

            {/* Main Card body */}
            <div className=" px-6 pb-4 text-start grid grid-cols-4 gap-4 mt-2">

              <div className="col-span-4">

                <form className='' >
                  <div className='w-full grid-cols-1 grid gap-x-4 gap-y-1'>

                    <div className='modifiedEditTable'>
                      <MaterialReactTable
                        columns={prodPlantGroupTbCol}
                        data={prodPlantGroupTb}
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
                        enableColumnResizing
                        // sortingFns={{
                        //     //will add a new sorting function to the list of other sorting functions already available
                        //     myCustomSortingFn: (rowA, rowB, columnId) => {
                        //         console.log(rowA);
                        //         console.log(rowB);
                        //         console.log(columnId);

                        //         return (rowA)
                        //     }// your custom sorting logic
                        // }}

                        muiTableContainerProps={{ sx: { maxHeight: '380px' } }} //ekhane table er data height
                        muiTableHeadCellProps={{
                          //simple styling with the `sx` prop, works just like a style prop in this example
                          sx: {
                            fontWeight: 'Bold',
                            fontSize: '13px',
                          },
                          // align: 'left',
                        }}

                        renderTopToolbarCustomActions={({ table }) => (
                          // <Box
                          //   sx={{ display: 'flex', gap: '1rem', p: '0.5rem', flexWrap: 'wrap' }}
                          // >
                          //   <Button
                          //     color="primary"
                          //     //export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)
                          //     onClick={handleExportData}
                          //     startIcon={<FileDownloadIcon />}
                          //     variant="contained"
                          //   >
                          //     Export All Data
                          //   </Button>
                          // </Box>
                          <div className='flex justify-end gap-1'>
                            <button
                              type="button"
                              data-mdb-ripple="true"
                              data-mdb-ripple-color="light"
                              className="inline-block px-[6px] py-1 bg-[#757575] text-white font-medium text-xs leading-tight rounded-full cursor-pointer hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out"
                              onClick={() => {
                                setProdnPlantSel();
                                setProdnSubPlantSel();
                                setProdGroupSel();
                                setProdPlantGroupTbRowIndx();
                                setProdnSubPlantOptionsWatch(((prev) => !prev));
                                setCurrentTrigger('Add')
                                setProdGroupModalOpen(true);
                              }}
                            ><i className="fas fa-plus"></i> Add Row</button>
                            <button
                              type="button"
                              data-mdb-ripple="true"
                              data-mdb-ripple-color="light"
                              className="inline-block px-[6px] py-1 bg-[#757575] text-white font-medium text-xs leading-tight rounded-full cursor-pointer hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out"
                              onClick={handleExportData}
                            ><i className="fas fa-file-excel"></i></button>
                          </div>

                        )
                        }


                      />
                    </div>

                  </div>
                </form>
              </div>

            </div>
            {/* Main Card Body--/-- */}

            {/* Main Card footer */}
            <div className="py-3 px-6 text-start border-gray-300 text-gray-600">
              <div className="flex gap-x-3">

                {/* <button
                  type="button"
                  data-mdb-ripple="true"
                  data-mdb-ripple-color="light"
                  className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out"
                  onClick={() => {
                    setProdnPlantSel();
                    setProdnSubPlantSel();
                    setProdGroupSel();
                    setProdPlantGroupTbRowIndx();
                    setCurrentTrigger('Add')
                    setProdGroupModalOpen(true);
                  }}
                >Yo yo</button> */}

              </div>

            </div>
            {/* Main Card footer--/-- */}
          </div>
          {/* Main Card--/-- */}

        </div>
      </div>



      {/* --------------Modals--------------- */}
      <Modal
        open={prodGroupModalOpen}
        onClose={() => {
          setProdGroupModalOpen(false);
        }}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...prodGroupModalStyle }}>
          <fieldset className="border border-solid border-gray-300 px-3 pt-1 pb-3 dark:text-slate-50">
            <legend className="text-sm">Add a Production Plant & Group</legend>
            <div className='mt-2 w-full'>
              <Autocomplete
                id="prodGroupSel"
                clearOnEscape
                size="small"
                sx={{ width: "100%", marginTop: 1 }}
                options={prodGroupOptions}
                value={(prodGroupSel) ? prodGroupSel : { ProductGroupId: "", Name: "" }}
                getOptionLabel={(option) => (option.Name) ? option.Name : ""}
                onChange={(e, selectedOption) => {
                  if (selectedOption) {
                    console.log(selectedOption);
                    setProdGroupSel({ ProductGroupId: selectedOption.ProductGroupId, Name: selectedOption.Name });
                  }
                  else {
                    setProdGroupSel({ ProductGroupId: '', Name: '' });
                  }

                }}
                renderInput={(params) => (
                  <TextField
                    sx={{ width: '100%', marginTop: 1 }}
                    {...params}
                    // {...register("plantNameSel")}

                    InputProps={{ ...params.InputProps, style: { fontSize: 13 } }}
                    InputLabelProps={{
                      ...params.InputLabelProps, style: { fontSize: 14 },

                    }}
                    // inputRef={(node) => {
                    //   if (node) {
                    //     node.value = (prodGroupSel?.ProductGroupName) ? prodGroupSel.ProductGroupName : "";
                    //   }
                    // }}

                    label="Select a Product Group" variant="outlined" />
                )}
              />
              <div className='flex w-full mt-2'>
                <Autocomplete
                  id="plantSel"
                  clearOnEscape
                  size="small"
                  sx={{ width: "100%" }}
                  options={prodnPlantOptions}
                  value={(prodnPlantSel) ? prodnPlantSel : { PlantId: "", PlantName: "" }}
                  getOptionLabel={(option) => (option.PlantName) ? option.PlantName : ""}
                  onChange={(e, selectedOption) => {
                    // console.log(selectedOption);
                    if (selectedOption) {
                      setProdnPlantSel({ PlantId: selectedOption.PlantId, PlantName: selectedOption.PlantName })

                      fetch(`${userInfo.Ip}/API/ProductionPlantAndGroup/Get_ProductionSubPlantsByPlant?plantId=${selectedOption.PlantId}`)
                        .then(res =>
                          res.json()
                          // console.log(res);
                        )
                        .then((data) => {
                          console.log("Fetched Raw data for ProductionSubPlants.....................");
                          console.log(data);
                          setProdnSubPlantOptions(data);
                          //unselecting any previous selection for subPlant if doesn't exists in the option of the newly fetched subPlants associated with selected plants
                          let IfExistsIndex = data.findIndex((row) => row.SubPlantId == prodnSubPlantSel.SubPlantId)
                          if (!(IfExistsIndex > -1)) { //jodi array te na thake, exist na kore
                            setProdnSubPlantSel({ SubPlantId: '', SubPlantName: '' });
                          }
                        })

                    }
                    else {
                      setProdnPlantSel({ PlantId: '', PlantName: '' })
                      setProdnSubPlantOptionsWatch(((prev) => !prev));
                      //unselecting any previous selection for subPlant
                      setProdnSubPlantSel({ SubPlantId: '', SubPlantName: '' });
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
                      label="Select a Plant" variant="outlined" />
                  )}

                />

                <button
                  type="button"
                  data-mdb-ripple="true"
                  data-mdb-ripple-color="light"
                  className=" w-[40%] ml-2 block py-1.5 bg-blue-600 text-white font-medium text-xs leading-tight rounded shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out"
                  onClick={() => {
                    setPlantModalOpen(true);
                  }}
                >Create Plant
                </button>
              </div>

              <div className='flex w-full mt-2'>
                <Autocomplete
                  id="subPlantSel"
                  clearOnEscape
                  size="small"
                  sx={{ width: "100%" }}
                  options={prodnSubPlantOptions}
                  value={(prodnSubPlantSel) ? prodnSubPlantSel : { SubPlantId: "", SubPlantName: "" }}
                  getOptionLabel={(option) => (option.SubPlantName) ? option.SubPlantName : ""}
                  onChange={(e, selectedOption) => {
                    if (selectedOption) {
                      setProdnSubPlantSel({ SubPlantId: selectedOption.SubPlantId, SubPlantName: selectedOption.SubPlantName });

                      fetch(`${userInfo.Ip}/API/ProductionPlantAndGroup/Get_ProductionPlantBySubPlant?subPlantId=${selectedOption.SubPlantId}`)
                        .then(res =>
                          res.json()
                          // console.log(res);
                        )
                        .then((data) => {
                          console.log("Fetched Raw data for ProductionPlants.....................");
                          console.log(data);
                          // setProdnPlantOptions(data);
                          setProdnPlantSel(data[0]);
                        })
                    }
                    else {
                      setProdnSubPlantSel({ SubPlantId: '', SubPlantName: '' });
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
                      label="Select a Sub Plant" variant="outlined" />
                  )}

                />

                <button
                  type="button"
                  data-mdb-ripple="true"
                  data-mdb-ripple-color="light"
                  className=" w-[40%] ml-2 block py-1.5 bg-blue-600 text-white font-medium text-xs leading-tight rounded shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out"
                  onClick={() => {
                    setSubPlantModalOpen(true);
                  }}
                >Create Sub Plant
                </button>
              </div>

              <div>
                {currentTrigger == "Add" ? (<button
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
                >Update </button>)}


                <button
                  type="button"
                  data-mdb-ripple="true"
                  data-mdb-ripple-color="light"
                  className=" mt-2 ml-2 inline-block px-4 py-1.5 bg-blue-600 text-white font-medium text-xs leading-tight rounded shadow-md hover:bg-blue-700 hover:shadow-lg hover:scale-110 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-900  active:-translate-y-1 active:shadow-lg transform-all duration-150 ease-in-out"
                  onClick={() => { setProdGroupModalOpen(false) }}
                >Cancel </button>
              </div>

              <PlantModal plantModalOpen={plantModalOpen} setPlantModalOpen={setPlantModalOpen}
                prodnPlantOptions={prodnPlantOptions}
                prodnPlantSel={prodnPlantSel} setProdnPlantSel={setProdnPlantSel}
                setProdnPlantOptionsWatch={setProdnPlantOptionsWatch}
              />

              <SubPlantModal plantModalOpen={plantModalOpen} setPlantModalOpen={setPlantModalOpen} subPlantModalOpen={subPlantModalOpen} setSubPlantModalOpen={setSubPlantModalOpen}
                prodnSubPlantOptions={prodnSubPlantOptions}
                prodnSubPlantSel={prodnSubPlantSel} setProdnSubPlantSel={setProdnSubPlantSel}
                prodnPlantOptions={prodnPlantOptions}
                prodnPlantSel={prodnPlantSel} setProdnPlantSel={setProdnPlantSel}
                setProdnPlantOptionsWatch={setProdnPlantOptionsWatch}
                setProdnSubPlantOptionsWatch={setProdnSubPlantOptionsWatch}

              />

            </div>
          </fieldset>
          {/* <Button onClick={handleClose}>Close Grand Child Modal</Button> */}


        </Box>
      </Modal>

    </div >
    // return wrapper div--/--
  )
}

export default ProductionPlantAndGroup