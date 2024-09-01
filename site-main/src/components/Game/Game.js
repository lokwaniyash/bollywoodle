import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import ActualGame from '../ActualGame/ActualGame';

export default function Game() {
  const [value, setValue] = React.useState(1);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  
  const theme = useTheme();

  function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`full-width-tabpanel-${index}`}
        aria-labelledby={`full-width-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }
  
  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };

  return (
    <Box sx={{ width: '100%', height: '100%', bgcolor: 'background.paper' }}>
      <Tabs value={value} onChange={handleChange} centered>
        <Tab label="Day #" disabled />
        <Tab label="Bollywood" />
        <Tab label="Punjabi" />
        <Tab label="Rap" />
        <Tab label="Archive" />
      </Tabs>
      <TabPanel value={value} index={0} dir={theme.direction}>
      </TabPanel>
      <TabPanel value={value} index={1} dir={theme.direction}>
        <ActualGame />
      </TabPanel>
      <TabPanel value={value} index={2} dir={theme.direction}>
        <ActualGame />
      </TabPanel>
      <TabPanel value={value} index={3} dir={theme.direction}>
        <ActualGame />
      </TabPanel>
      <TabPanel value={value} index={4} dir={theme.direction}>
        Item Five
      </TabPanel>
    </Box>
  );
}

