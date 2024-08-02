'use client'
import Image from "next/image";
import { useState, useEffect } from "react";
import { firestore } from "@/firebase";
import { Box, Button, Modal, Stack, TextField, Typography, Snackbar, Alert } from "@mui/material";
import { collection, query, getDocs, setDoc, deleteDoc, getDoc, doc } from 'firebase/firestore';





export default function Home() {

  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')
  const [searchTerm, setSearchTerm] = useState('');


  const updateInventory = async () => {

    const snapshot = await getDocs(query(collection(firestore, 'inventory')))
    const inventoryList = snapshot.docs.map((doc) => ({
      name: doc.id,
      ...doc.data(),

    }))


    console.log("THIS IS THE INVENTORY LIST", inventoryList);
    setInventory(inventoryList)


  }







  const addItem = async (item) => {
    const docRef = doc(firestore, 'inventory', item)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {

      const { quantity } = docSnap.data()
      await setDoc(docRef, { quantity: quantity + 1 }, { merge: true })
    }
    else {
      await setDoc(docRef, { quantity: 1 })

    }
    await updateInventory()
  }





  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {

      const { quantity } = docSnap.data()
      if (quantity === 1) {

        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, { quantity: quantity - 1 })
      }

    }

    await updateInventory()

  }




  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );





  useEffect(() => {
    updateInventory()
  }, [])

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)



  return (
    <Box width="100vw" height="100vh" display="flex" flexDirection="column" p={2} bgcolor={"#000000"}>
      {/* Inventory title and items */}
      <Box width="100%" flex={1} display="flex" flexDirection="column">
        <Box
          width="100%"
          height="200px"
          bgcolor="#003366"
          display="flex"
          alignItems="center"
          justifyContent="center"
          padding={2}
          mb={2}
          borderRadius={2}
          boxShadow={3}
        >
          <Typography variant="h2" color='#ffffff'>All Inventory</Typography>
        </Box>

        <Modal open={open} onClose={handleClose}>
          <Box
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            width="400px"
            bgcolor="black"
            border="2px solid #000"
            boxShadow={24}
            p={4}
            display="flex"
            flexDirection="column"
            gap={3}
          >
            <Typography variant="h6" color="#d3d3d3">Add Item</Typography>
            <Stack width="100%" direction="row" spacing={2}>
              <TextField
                variant="outlined"
                fullWidth
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder="Item name"
                InputProps={{ style: { color: '#d3d3d3' } }} // Input text color
                InputLabelProps={{ style: { color: '#d3d3d3' } }} // Input label color
                sx={{ borderColor: '#d3d3d3' }} // Input border color
              />
              <Button
                variant="contained"
                onClick={() => {
                  addItem(itemName);
                  setItemName('');
                  handleClose();
                }}
              >
                Add
              </Button>
            </Stack>
          </Box>
        </Modal>

        {/* Search bar and add button */}
        <Box width="100%" padding={2} display="flex" flexDirection="row" alignItems="center" gap={2}>
          <TextField
            variant="outlined"
            fullWidth
            placeholder="Search inventory..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{ style: { color: '#d3d3d3' } }}
            InputLabelProps={{ style: { color: '#d3d3d3' } }}
            sx={{
              borderColor: '#d3d3d3', // Light gray border color
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#d3d3d3' // Light gray border color for the outlined field
                },
                '&:hover fieldset': {
                  borderColor: '#b0b0b0' // Slightly darker gray for the border on hover
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#d3d3d3' // Light gray border color when focused
                }
              }
            }
            }
          />
          <Button variant="contained" onClick={handleOpen}>
            Add New Item
          </Button>
        </Box>

        <Stack width="100%" height="100%" spacing={2} overflow="auto" bgcolor="#000000">
          {filteredInventory.map(({ name, quantity }) => (
            <Box
              key={name}
              width="100%"
              minHeight="150px"
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              bgcolor="#333333"
              padding={3}
              borderRadius={2}
              boxShadow={1}
            >
              <Typography variant="h3" color='#d3d3d3' textAlign="center">
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant="h3" color='#d3d3d3' textAlign="center">
                {quantity}
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button variant="contained" onClick={() => addItem(name)}>Add</Button>
                <Button variant="contained" onClick={() => removeItem(name)}>Remove</Button>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>


    </Box>
  );
}