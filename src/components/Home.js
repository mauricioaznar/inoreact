import React, {useEffect, useState} from 'react'
import {makeStyles} from '@material-ui/core/styles'
import {connect} from 'react-redux'
import {getApiEntities} from '../store/generalActions'
import Sales from './pages/Sales'
import Equilibrium from './pages/Equilibrium'
import {Switch, Route} from 'react-router-dom'
import Navbar from './ui/Navbar'
import Expenses from './pages/Expenses'
import Maintenance from './pages/Maintenance'


const useStyles = makeStyles((theme) => ({
  toolbarMargin: theme.mixins.toolbar
}));

const Home = (props) => {
  const classes = useStyles()
  const [counter, setCounter] = useState(0)
  useEffect(() => {
    props.getApiEntities()
  }, [counter])
  if (props.areEntitiesLoading) { //props.areEntitiesLoading
    return (
      <div>
        Loading...
      </div>
    )
  } else {
    return (
      <div>
       <Navbar />
        <div className={classes.toolbarMargin}/>
        <Switch>
          <Route path={'/sales'} component={() => <Sales />}/>
          <Route path={'/equilibrium'} component={() => <Equilibrium />}/>
          <Route path={'/expenses'} component={() => <Expenses />}/>
          <Route path={'/maintenance'} component={() => <Maintenance />}/>
        </Switch>
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