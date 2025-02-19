import React, { useState } from 'react';
import { Box, Button, TextField, Slider, IconButton, Typography, Stack } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CircleIcon from '@mui/icons-material/Circle';

const ActualGame = () => {
  const [guesses, setGuesses] = useState([false, false, false, false, false, false]);
  const [inputValue, setInputValue] = useState('');
  const [currentStep, setCurrentStep] = useState(0);

  const handlePlay = () => {
    // Handle play logic here
  };

  const handleSkip = () => {
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

  const handleSliderChange = (event, newValue) => {
    setCurrentStep(newValue);
  };

  const marks = [
    { value: 0.1 },
    { value: 0.5 },
    { value: 2 },
    { value: 4 },
    { value: 8 },
    { value: 15 },
    { value: 30 }
  ];

  return (
    <Box sx={{ bgcolor: 'background.default', color: 'text.primary', p: 2 }}>
      {/* Guess Circles */}
      <Stack direction="row" justifyContent="center" mb={2} spacing={1}>
        {guesses.map((guess, index) => (
          <CircleIcon key={index} color={guess ? 'primary' : 'disabled'} />
        ))}
      </Stack>

      {/* Current Step Display */}
      <Box display="flex" justifyContent="center" mb={1}>
        <Typography variant="h6">
          {currentStep} seconds
        </Typography>
      </Box>

      {/* Timeline */}
      <Box mb={2} sx={{ px: 1 }}>
        <Slider
          value={currentStep}
          onChange={handleSliderChange}
          aria-label="Song Timeline"
          step={0.1}
          marks={marks}
          min={0}
          max={30}
          sx={{
            '& .MuiSlider-mark': {
              height: 8,
              width: 2,
            },
            '& .MuiSlider-thumb': {
              display: 'none',
            },
          }}
          disabled
        />
      </Box>

      {/* Controls */}
      <Stack direction="row" alignItems="center" spacing={1}>
        <IconButton onClick={handlePlay} color="primary">
          <PlayArrowIcon />
        </IconButton>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type your guess here..."
          value={inputValue}
          onChange={handleInputChange}
          sx={{ bgcolor: 'background.paper' }}
        />
        <Button onClick={handleSkip} variant="contained" color="secondary">
          Skip
        </Button>
      </Stack>
    </Box>
  );
};

export default ActualGame;
