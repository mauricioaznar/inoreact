import InputLabel from '@material-ui/core/InputLabel'
import {Controller} from 'react-hook-form'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import React from 'react'
import mapDispatchToProps from 'react-redux/lib/connect/mapDispatchToProps'
import {makeStyles} from '@material-ui/core/styles'
import {connect} from 'react-redux'


const useStyles = makeStyles((theme) => {
  return {
    item: {
      paddingLeft: theme.spacing(3),
    },
    group: {
      fontWeight: theme.typography.fontWeightMedium,
      opacity: 1,
    },
  }
})



const ExpenseSubcategoriesSelect = (props) => {

  const classes = useStyles()

  return (
    <>
      <InputLabel htmlFor="grouped-select">{props.label}</InputLabel>
      <Controller
        as={
          <Select defaultValue="" id="grouped-select">
            {props.expenseCategories.map(expenseCategory => {

              const filteredExpenseSubcategories = props.expenseSubcategories
                .filter(expenseSubcategory => {
                  return expenseCategory.id === expenseSubcategory.expense_category_id
                })
                .sort((a, b) => {
                  return a.name.localeCompare(b.name)
                })

              return [expenseCategory].concat(filteredExpenseSubcategories)
                .map((expenseSubcategory, index) => {
                  if (index === 0) {
                    return (
                      <MenuItem disabled className={classes.group}>
                        {expenseSubcategory.name}
                      </MenuItem>
                    )
                  }
                  return (
                    <MenuItem
                      dense
                      className={classes.item}
                      key={expenseSubcategory.id}
                      value={String(expenseSubcategory.id)}
                    >
                      {expenseSubcategory.name}
                    </MenuItem>
                  )
                })
            })}
          </Select>
        }
        name={props.name}
        rules={props.rules}
        control={props.control}
        defaultValue={props.defaultValue}
      />

    </>
  )
}


const mapStateToProps = (state) => {
  return {
    expenseSubcategories: state.expenses.expenseSubcategories.sort((a, b) => {
      return a.expense_category_id > b.expense_category_id ? 1 : -1
    }),
    expenseCategories: state.expenses.expenseCategories
  }
}

export default connect(mapStateToProps, mapDispatchToProps) (ExpenseSubcategoriesSelect)