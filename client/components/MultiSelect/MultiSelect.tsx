
import * as React from 'react'

import styled from 'styled-components'

import Input, { InputLabel } from 'material-ui/Input'
import { MenuItem } from 'material-ui/Menu'
import { FormControl } from 'material-ui/Form'
import Select from 'material-ui/Select'
import Chip from 'material-ui/Chip'

const Chips = styled.div`
  display: 'flex';
  flexWrap: 'wrap';
`

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
}

type MultiSelectValue = {
  text: string
  id: string
}

export interface MultiSelectProps {
  onChange: React.ChangeEventHandler<{}>
  values: MultiSelectValue[]
  selectedValues: MultiSelectValue[]
  label: string
}

export const MultiSelect = ({ onChange, values, selectedValues, label }: MultiSelectProps) => (
  <FormControl>
    <InputLabel htmlFor='select-multiple-chip'>{label}</InputLabel>
    <Select
      multiple={true}
      value={selectedValues.map(({ id }) => id)}
      onChange={onChange}
      input={<Input id='select-multiple-chip' />}
      renderValue={(selectedIds: string[]) => (
        <Chips>
          {
            selectedIds
            .map((id) => {
              const value = values.find((val) => val.id === id)
              const text = value ? value.text : ''
              return <Chip key={id} label={text}/>
            })
          }
        </Chips>
      )}
      MenuProps={MenuProps}
    >
      {values.map(({ text, id }) => (
        <MenuItem
          key={id}
          value={id}
        >
          {text}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
)
