import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext';
import {
    Container,
    TextField,
    Button,
    Typography,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    Snackbar,
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';

const RegisterForm = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('Employee');
    const [image, setImage] = useState(null);
    const [message, setMessage] = useState('');
    const [open, setOpen] = useState(false);

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const { baseurl } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('username', username);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('role', role);
        formData.append('image', image);

        try {
            const res = await axios.post(`${baseurl}/register`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setMessage(res.data.message);
            setOpen(true);
        } catch (error) {
            setMessage(error.response?.data?.message || 'An error occurred');
            setOpen(true);
        }
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Container maxWidth="sm">
            <Typography variant="h4" gutterBottom>
                Register
            </Typography>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <TextField
                    label="Username"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <TextField
                    label="Email"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <TextField
                    label="Password"
                    type="password"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <FormControl variant="outlined" fullWidth margin="normal">
                    <InputLabel>Role</InputLabel>
                    <Select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        label="Role"
                        required
                    >
                        <MenuItem value="Admin">Admin</MenuItem>
                        <MenuItem value="Employee">Employee</MenuItem>
                    </Select>
                </FormControl>
                <input
                className='mb-3'
                    type="file"
                    onChange={handleImageChange}
                    accept="image/*"
                />
                <Button type="submit" variant="contained" color="primary" fullWidth margin="normal">
                    Register
                </Button>
            </form>
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <MuiAlert elevation={6} variant="filled" onClose={handleClose} severity={message.includes('success') ? 'success' : 'error'}>
                    {message}
                </MuiAlert>
            </Snackbar>
        </Container>
    );
};

export default RegisterForm;
