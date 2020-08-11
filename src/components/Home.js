import React, {useEffect, useState} from 'react'
import {makeStyles} from '@material-ui/core/styles'
import {connect} from 'react-redux'
import {getApiEntities} from '../store/generalActions'
import Equilibrium from './pages/Equilibrium'
import {Switch, Route} from 'react-router-dom'
import Navbar from './ui/Navbar'
import Production from './pages/Production'


const useStyles = makeStyles((theme) => ({
  toolbarMargin: theme.mixins.toolbar
}));

const Home = (props) => {
  const classes = useStyles()
  const [counter, setCounter] = useState(null)
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
          <Route path={'/'} exact component={() => <Equilibrium />}/>
          <Route path={'/production'} component={() => <Production />}/>
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