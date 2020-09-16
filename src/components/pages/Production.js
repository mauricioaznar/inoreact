import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import ProductionsByMatMacTable from '../ui/ProductionsByMatMacTable'
import useFetch from '../../helpers/useFetch'
import RequestsProductsTable from '../ui/RequestsProductsTable'
import OrderRequestsDataTable from '../ui/datatables/OrderRequestsDataTable'
import apiUrl from '../../helpers/apiUrl'
import Paper from '@material-ui/core/Paper'
import Container from '@material-ui/core/Container'

function TabPanel(props) {
  const {children, value, index, classes, ...other} = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Container>
          <Box>
            {children}
          </Box>
        </Container>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `scrollable-auto-tab-${index}`,
    'aria-controls': `scrollable-auto-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function Production() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const machineProductions = useFetch(apiUrl + 'analytics/production?dateGroup=none&entityGroup=material|product|machine')
  const employeeProductions = useFetch(apiUrl + 'analytics/production?dateGroup=none&entityGroup=material|product|employee')
  const requestProducts = useFetch(apiUrl + 'stats/requestProducts')

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static" color="default" style={{marginBottom: '2.0em'}}>
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          aria-label="scrollable auto tabs example"
        >
          <Tab label="Promedios" {...a11yProps(0)} />
          <Tab label="Por producir" {...a11yProps(1)} />
          <Tab label="Pedidos" {...a11yProps(2)} />
          <Tab label="Item Four" {...a11yProps(3)} />
          <Tab label="Item Five" {...a11yProps(4)} />
          <Tab label="Item Six" {...a11yProps(5)} />
          <Tab label="Item Seven" {...a11yProps(6)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <ProductionsByMatMacTable
          machineProductions={machineProductions}
          employeeProductions={employeeProductions}
        />
      </TabPanel>
      <TabPanel value={value} index={1}>
          <RequestsProductsTable requestProducts={requestProducts}/>
      </TabPanel>
      <TabPanel value={value} index={2}>
          <OrderRequestsDataTable />
      </TabPanel>
      <TabPanel value={value} index={3}>
          Item Four
      </TabPanel>
      <TabPanel value={value} index={4}>
          Item Five
      </TabPanel>
      <TabPanel value={value} index={5}>
          Item Six
      </TabPanel>
      <TabPanel value={value} index={6}>
          Item Seven
      </TabPanel>
    </div>
  );
}