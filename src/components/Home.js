import React, {useEffect, useState} from 'react'
import {makeStyles} from '@material-ui/core/styles'
import {connect} from 'react-redux'
import {getApiEntities} from '../store/generalActions'
import {Switch, Route} from 'react-router-dom'
import Navbar from './ui/Navbar'
import Equilibrium from './pages/Equilibrium'
import Production from './pages/Production'
import InventoryDrawer from './ui/InventoryDrawer'
import Expenses from './pages/Expenses'


const useStyles = makeStyles((theme) => ({
  toolbarMargin: theme.mixins.toolbar
}));

const Home = (props) => {
  const classes = useStyles()

  useEffect(() => {
    props.getApiEntities()
  }, [])

  if (props.areEntitiesLoading) { //props.areEntitiesLoading
    return (
      <div>
        Loading...
      </div>
    )
  } else {
    return (
      <div>
        <Navbar/>
        <div className={classes.toolbarMargin}/>
        <Switch>
          <Route path={'/'} exact component={() => <Equilibrium />}/>
          <Route path={'/production'} component={() => <Production />}/>
          <Route path={'/expenses'} component={() => <Expenses />}/>
        </Switch>
        <InventoryDrawer/>
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    getApiEntities: () => {dispatch(getApiEntities())}
  }
}


const mapStateToProps = (state, ownProps) => {
  return {
    areEntitiesLoading: state.general.areEntitiesLoading
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)