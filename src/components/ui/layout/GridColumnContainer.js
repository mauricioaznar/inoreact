import React from "react";
import Grid from "@material-ui/core/Grid";


export default function GridColumnContainer ({children}) {
  return <Grid
    container
    direction={'column'}
  >
    {children}
  </Grid>
}