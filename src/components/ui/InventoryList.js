import React from 'react'
import {connect} from 'react-redux'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItemText from '@material-ui/core/ListItemText'
import Drawer from '@material-ui/core/Drawer'
import Collapse from '@material-ui/core/Collapse';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import SendIcon from '@material-ui/icons/Send';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import StarBorder from '@material-ui/icons/StarBorder';

import {setInventoryDrawerOpen} from '../../store/generalActions'
import formatNumber from '../../helpers/formatNumber'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import {makeStyles} from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Switch from '@material-ui/core/Switch'


const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    width: '100%'
  },
  secondaryClass: {
    width: '100%'
  }
}));


const InventoryList = (props) => {


  // props.inventory.map(product => {
  //
  // })

  const classes = useStyles();
  const [isKilosOn, setIsKilosOn] = React.useState(false)
  const [inventory, setInventory] = React.useState(
    props.bagsMaterials
      .map(material => {

        const {kilosBalance, groupsBalance} = props.inventory.reduce((acc, product) => {
          return product.material_id === material.id ?
            {
              kilosBalance: acc.kilosBalance + product.kilos_balance,
              groupsBalance: acc.groupsBalance + product.groups_balance
            } :
            acc
        }, {kilosBalance: 0, groupsBalance: 0})

        return {
          ...material,
          kilos_balance: kilosBalance,
          groups_balance: groupsBalance,
          products: props.inventory.filter(product => {
            return product.material_id === material.id
          })
        }
      })
      .map(material => {
        return {data: {...material}, open: false}
      })
      .sort(material => {

      })
  )


  const handleClick = (e, index) => {
    const updatedInventory = inventory.slice()
    updatedInventory[index] = {
      ...updatedInventory[index],
      open: !updatedInventory[index].open
    }
    setInventory(updatedInventory)

  };

  return (
      <List
        component="nav"
        aria-labelledby="nested-list-subheader"
        subheader={
          <ListSubheader
            component="div"
            id="nested-list-subheader"
          >
            <Switch
              color="default"
              checked={isKilosOn}
              onChange={(e) => {setIsKilosOn(!isKilosOn)}}
              name="checkedA"
              inputProps={{ 'aria-label': 'secondary checkbox' }}
            />
            {isKilosOn ? 'kilos' : 'bultos'}
          </ListSubheader>
        }
        className={classes.root}
      >
        {
          inventory.map(({data: material, open}, index) => {
            return (
              <React.Fragment key={material.id}>
                <ListItem
                  button
                  onClick={(e) => {
                    handleClick(e, index)
                  }}
                >
                  <ListItemText
                    primary={material.name}
                    secondary={
                      <React.Fragment>
                        <Typography
                          style={{
                            width: '100%'
                          }}
                          align={'right'}
                          color="textPrimary"
                        >
                          {
                            formatNumber(isKilosOn ? material.kilos_balance : material.groups_balance) + (isKilosOn ? ' kilos' : ' bultos' )
                          }
                        </Typography>
                      </React.Fragment>
                    }
                  />
                </ListItem>
                <Collapse
                  in={open}
                  timeout="auto"
                  unmountOnExit
                >
                  {
                    material.products.map(product => {
                      return (
                        <List
                          component="div"
                          disablePadding
                          dense
                        >
                          <ListItem button>
                            <ListItemText
                              primary={product.description}
                              inset
                              secondary={
                                <React.Fragment>
                                  <Typography
                                    style={{
                                      width: '100%'
                                    }}
                                    align={'right'}
                                    color="textPrimary"
                                  >
                                    {
                                      formatNumber(isKilosOn ? product.kilos_balance : product.groups_balance) + (isKilosOn ? ' kilos' : ' bultos' )
                                    }
                                  </Typography>
                                </React.Fragment>
                              }
                            />
                          </ListItem>
                        </List>
                      )
                    })
                  }
                </Collapse>
              </React.Fragment>
            )
          })
        }
      </List>
  )
}

const mapStateToProps = (state, ownProps) => {
  return {
    openDrawer: state.general.inventoryDrawerOpen,
    inventory: state.general.inventory,
    bagsMaterials: state.production.materials
      .filter(material => {
        return material.product_type_id === 1 || material.product_type_id === 4
      })
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    setOpenDrawer: (isOpen) => {
      dispatch(setInventoryDrawerOpen(isOpen))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(InventoryList)