import React from 'react'
import Grid from '@material-ui/core/Grid'
import ProductionByProductTypeTable from './tables/ProductionByProductTypeTable'
import useFetch from '../../../helpers/useFetch'
import apiUrl from '../../../helpers/apiUrl'
import moment from 'moment'
import {dateFormat} from '../../../helpers/dateFormat'
import CircularProgress from '@material-ui/core/CircularProgress'
import Typography from '@material-ui/core/Typography'
import MauAutocomplete from '../../ui/inputs/Autocomplete'

export default function ProductionSummary(props) {

  const dateOptions = [
    {name: 'Mes'},
    {name: 'Dia'}
  ]
  const [dateOption, setDateOption] = React.useState(dateOptions[0])

  const daysBack = 30
  const monthsBack = 12

  let initialDate = moment().subtract(daysBack, 'days').format(dateFormat);
  let initialDateMonth = moment().subtract(12, 'months').startOf('month').format(dateFormat)

  const materialProductionsDays = useFetch(apiUrl + 'analytics/production?dateGroup=day&entityGroup=material|branch&initialDate=' + initialDate)
  const materialProductionsMonths = useFetch(apiUrl + 'analytics/production?dateGroup=month&entityGroup=material|branch&initialDate=' + initialDateMonth)

  let loading = !materialProductionsDays || !materialProductionsMonths

  return (
    loading
      ? <CircularProgress
        size={40}
        style={{marginLeft: '.5em'}}
      />
      : <Grid
        container
        direction={'column'}
      >
         <Grid
          item
          xs
          sm={8}
          md={6}
          style={{marginBottom: '1em'}}
         >
           <MauAutocomplete
            options={dateOptions}
            value={dateOption}
            displayName="name"
            onChange={(e, data) => {
              setDateOption(data)
            }}
           />
         </Grid>
          <Grid
            item
            container
            direction={'column'}
            style={{display: dateOption.name === 'Mes' ? 'inherit' : 'none'}}
          >
             <Grid
               item
               style={{marginBottom: '1em'}}
             >
              <Typography
                variant={'h4'}
              >
                Bolseo en Caucel
              </Typography>
            </Grid>
            <Grid
              item
              style={{marginBottom: '3em'}}
              xs
              sm={12}
            >
              <ProductionByProductTypeTable
                productions={materialProductionsMonths}
                branchId={1}
                productTypeId={1}
                monthsBack={monthsBack}
              />
            </Grid>
            <Grid
              item
              style={{marginBottom: '1em'}}
            >
              <Typography
                variant={'h4'}
              >
                Extrusión en Caucel
              </Typography>
            </Grid>
            <Grid
              item
              style={{marginBottom: '3em'}}
              xs
              sm={12}
            >
              <ProductionByProductTypeTable
                productions={materialProductionsMonths}
                branchId={1}
                productTypeId={2}
                monthsBack={monthsBack}
              />
            </Grid>
          </Grid>
          <Grid
            item
            container
            direction={'column'}
            style={{display: dateOption.name === 'Dia' ? 'inherit' : 'none'}}
          >
            <Grid
              item
              style={{marginBottom: '1em'}}
            >
              <Typography
                variant={'h4'}
              >
                Bolseo en Caucel
              </Typography>
            </Grid>
            <Grid
              item
              style={{marginBottom: '3em'}}
              xs
              sm={12}
            >
              <ProductionByProductTypeTable
                productions={materialProductionsDays}
                branchId={1}
                productTypeId={1}
                daysBack={daysBack}
              />
            </Grid>
            <Grid
              item
              style={{marginBottom: '1em'}}
            >
              <Typography
                variant={'h4'}
              >
                Extrusión en Caucel
              </Typography>
            </Grid>
            <Grid
              item
              style={{marginBottom: '3em'}}
              xs
              sm={12}
            >
              <ProductionByProductTypeTable
                productions={materialProductionsDays}
                branchId={1}
                productTypeId={2}
                daysBack={daysBack}
              />
            </Grid>
          </Grid>
        </Grid>
  )
}