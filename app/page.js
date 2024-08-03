'use client';
import { useState, useEffect } from 'react';
import { firestore } from '@/firebase';
import { Box, Modal, Stack, TextField, Typography, Button, IconButton, Paper } from "@mui/material";
import { collection, getDocs, query, doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredInventory, setFilteredInventory] = useState([]);

  const updateInventory = async () => {
    const q = query(collection(firestore, 'inventory'));
    const docs = await getDocs(q);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
    setFilteredInventory(inventoryList); // Initialize filtered inventory
  };

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }
    await updateInventory();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }
    await updateInventory();
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleAddItem = () => {
    if (itemName) {
      addItem(itemName);
      setItemName('');
      handleClose();
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredInventory(inventory.filter(item => item.name.toLowerCase().includes(query)));
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap={3}
      sx={{ bgcolor: '#f5f5f5', padding: 4 }}
    >
      <Typography variant="h2" sx={{ mb: 4, color: '#2196f3', fontWeight: 'bold' }}>PantryGantry</Typography>
      <TextField
        variant="outlined"
        label="Search Item"
        value={searchQuery}
        onChange={handleSearch}
        sx={{ mb: 4, width: '60%', bgcolor: '#fff' }}
      />
      <Button variant="contained" color="secondary" onClick={handleOpen} sx={{ borderRadius: 20 }}>
        Add New Item
      </Button>
      <Box
        width="60%"
        display="flex"
        flexDirection="column"
        alignItems="center"
        gap={2}
        sx={{ mt: 4, bgcolor: '#fff', p: 4, borderRadius: 2, boxShadow: 3 }}
      >
        {filteredInventory.map((item) => (
          <Paper key={item.name} elevation={3} sx={{ width: '100%', padding: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: '#e3f2fd' }}>
            <Typography variant="h6" sx={{ color: '#1976d2', fontWeight: 'medium' }}>{item.name}</Typography>
            <Box display="flex" alignItems="center" gap={1}>
              <IconButton color="primary" onClick={() => addItem(item.name)}>
                <AddIcon />
              </IconButton>
              <Typography>{item.quantity}</Typography>
              <IconButton color="error" onClick={() => removeItem(item.name)}>
                <RemoveIcon />
              </IconButton>
            </Box>
          </Paper>
        ))}
      </Box>
      <Modal
        open={open}
        onClose={handleClose}
      >
        <Box
          position="absolute" top="50%" left="50%"
          width={400}
          bgcolor="white"
          border="1px solid #ccc"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{
            transform: "translate(-50%, -50%)",
            borderRadius: 2,
            outline: 'none',
          }}
        >
          <Typography variant="h6" sx={{ color: '#1976d2' }}>Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              fullWidth
              variant="outlined"
              label="Item Name"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              sx={{ bgcolor: '#f9f9f9' }}
            />
            <Button variant="contained" color="secondary" onClick={handleAddItem}>
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
    </Box>
  );
}



