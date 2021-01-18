import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";


const useStyles = makeStyles((theme) => {
  return {
    rowContainer: {
      paddingLeft: '2em',
      paddingRight: '2em'
    }
  }
})

export default function GridRowItem (
  {
    children,
    style = {marginTop: '2em',  marginBottom: '2em'}
  }) {

  const classes = useStyles();

   return (
     <Grid
       item
       className={classes.rowContainer}
       style={style}
       xs
     >
       {children}
     </Grid>
   )

}