import React from 'react'
import {connect} from 'react-redux'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Drawer from '@material-ui/core/Drawer'
import {setInventoryDrawerOpen} from '../../store/generalActions'

import formatNumber from '../../helpers/formatNumber'


const InventoryDrawer = (props) => {
  return (
    <Drawer anchor={'right'} open={props.openDrawer} onClose={() => {props.setOpenDrawer(false)}}>
      <List>
        {props.inventory
          .filter(product => {
            return product.kilos_balance > 0
          })
          .sort((a,b) => {
            return a.kilos_balance > b.kilos_balance ? -1 : 1
          })
          .map(product => {
            return (
              <ListItem>
                <ListItemText primary={product.description} secondary={formatNumber(product.kilos_balance)} />
              </ListItem>
            )
          })
        }
      </List>
    </Drawer>
  )
}

const mapStateToProps = (state, ownProps) => {
  return {
    openDrawer: state.general.inventoryDrawerOpen,
    inventory: state.general.inventory,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    setOpenDrawer: (isOpen) => {
      dispatch(setInventoryDrawerOpen(isOpen))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(InventoryDrawer)