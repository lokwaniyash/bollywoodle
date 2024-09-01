import React, { useState } from 'react';
import { Box, Button, TextField, Grid, Typography, Slider, IconButton } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import CircleIcon from '@mui/icons-material/Circle';

const ActualGame = () => {
  const [guesses, setGuesses] = useState([false, false, false, false, false, false]);
  const [inputValue, setInputValue] = useState('');

  const handlePlay = () => {
    // Handle play logic here
  };

  const handleSkip = () => {
    // Handle skip logic here
    setGuesses(prevGuesses => {
      const newGuesses = [...prevGuesses];
      const firstFalseIndex = newGuesses.indexOf(false);
      if (firstFalseIndex !== -1) newGuesses[firstFalseIndex] = true;
      return newGuesses;
    });
  };

  const handleInputChange = (event) => {
    const value = event.target.value;
    setInputValue(value);
    // Trigger API call for suggestions here
  };

  return (
    <Box sx={{ bgcolor: 'background.default', color: 'text.primary', p: 2 }}>
      {/* Guess Circles */}
      <Box display="flex" justifyContent="center" mb={2}>
        {guesses.map((guess, index) => (
          <CircleIcon key={index} color={guess ? 'primary' : 'disabled'} />
        ))}
      </Box>

      {/* Timeline */}
      <Box mb={2}>
        <Slider
          defaultValue={0}
          aria-label="Song Timeline"
          step={0.5}
          marks={[
            { value: 0.5, label: '0.5s' },
            { value: 1, label: '1s' },
            { value: 5, label: '5s' },
            { value: 10, label: '10s' },
            { value: 15, label: '15s' },
            { value: 30, label: '30s' }
          ]}
          min={0}
          max={30}
          disabled
        />
      </Box>

      {/* Controls */}
      <Grid container spacing={1} alignItems="center">
        <Grid item>
          <IconButton onClick={handlePlay} color="primary">
            <PlayArrowIcon />
          </IconButton>
        </Grid>
        <Grid item xs>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type your guess here..."
            value={inputValue}
            onChange={handleInputChange}
            sx={{ bgcolor: 'background.paper' }}
          />
        </Grid>
        <Grid item>
          <Button onClick={handleSkip} variant="contained" color="secondary">
            Skip
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ActualGame;
