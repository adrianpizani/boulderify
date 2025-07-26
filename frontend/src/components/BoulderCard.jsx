import React, { useState } from 'react';
import { Card, CardContent, CardMedia, Typography, IconButton, Menu, MenuItem, Box } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const BoulderCard = ({ boulder, onDelete }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleDelete = () => {
        onDelete(boulder._id);
        handleClose();
    };

    return (
        <Card sx={{ display: 'flex', my: 2, width: '100%' }}>
            <CardMedia
                component="img"
                sx={{ width: 100, height: 100, objectFit: 'cover' }}
                image={boulder.thumbnailUrl || boulder.imageUrl}
                alt={boulder.name}
            />
            <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <CardContent sx={{ flex: '1 0 auto' }}>
                    <Typography component="div" variant="h6">
                        {boulder.name}
                    </Typography>
                    {boulder.grade && (
                        <Typography variant="subtitle2" color="text.secondary" component="div">
                            {boulder.grade}
                        </Typography>
                    )}
                </CardContent>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', pr: 1 }}>
                <IconButton
                    aria-label="settings"
                    id="long-button"
                    aria-controls={open ? 'long-menu' : undefined}
                    aria-expanded={open ? 'true' : undefined}
                    aria-haspopup="true"
                    onClick={handleClick}
                >
                    <MoreVertIcon />
                </IconButton>
                <Menu
                    id="long-menu"
                    MenuListProps={{
                        'aria-labelledby': 'long-button',
                    }}
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                >
                    <MenuItem onClick={handleClose}>Edit</MenuItem>
                    <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
                        Delete
                    </MenuItem>
                </Menu>
            </Box>
        </Card>
    );
};

export default BoulderCard;