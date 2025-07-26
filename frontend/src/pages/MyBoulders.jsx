import React, { useState, useEffect } from 'react';
import { getAllBoulders, deleteBoulder } from '../services/boulderService.js';
import BoulderCard from '../components/BoulderCard.jsx';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Grid, Button, CircularProgress, Alert } from '@mui/material';

const MyBoulders = () => {
    const [boulders, setBoulders] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBoulders = async () => {
            try {
                const data = await getAllBoulders();
                setBoulders(data);
            } catch (err) {
                setError('Failed to fetch boulders. Please try again later.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchBoulders();
    }, []);

    const handleDelete = async (id) => {
        try {
            await deleteBoulder(id);
            setBoulders(prevBoulders => prevBoulders.filter(boulder => boulder._id !== id));
        } catch (err) {
            setError('Failed to delete boulder.');
            console.error(err);
        }
    };

    if (loading) return <Container sx={{ textAlign: 'center', p: 4 }}><CircularProgress /></Container>;
    if (error) return <Container sx={{ textAlign: 'center', p: 4 }}><Alert severity="error">{error}</Alert></Container>;

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom align="center">
                My Boulders
            </Typography>
            
            {boulders.length > 0 ? (
                <Grid container spacing={2} justifyContent="center">
                    {boulders.map(boulder => (
                        <Grid item xs={12} sm={12} md={12} key={boulder._id}>
                            <BoulderCard 
                                boulder={boulder} 
                                onDelete={handleDelete} 
                            />
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Typography align="center" color="text.secondary">
                    You haven't created any boulders yet.
                </Typography>
            )}

            <Button onClick={() => navigate('/')} variant="contained" sx={{ mt: 4, display: 'block', mx: 'auto' }}>
                Back to Home
            </Button>
        </Container>
    );
};

export default MyBoulders;