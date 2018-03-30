import * as React from 'react'

import styled from 'styled-components'

import MUIList, { ListItem as MUIListItem, ListItemText } from 'material-ui/List'
import Divider from 'material-ui/Divider'

import { Loader } from 'components/Loader'
import { Link } from 'components/Link'
import { PrimaryButton } from 'components/Button'

interface ListItemProps {
  text: string
  id: string
  link?: string
}

export interface ListProps {
  items: ListItemProps[]
  loading: boolean
  error: boolean
  errorText: string
  onRefresh: React.MouseEventHandler<any>
  addLink?: string
  addText?: string
}

export interface ListState {}

const AddLink = styled(Link)`
  max-width: 80%;
  align-self: center;
`

const ListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`

const ListContents = styled(MUIList)`
  overflow: auto;
  flex: 1;
  h3 {
    font-size: 1.5rem !important;
  }
`

export const ListItem = ({ text, id, link }: ListItemProps) => {
  if (link) {
    return (
      <Link to={link} key={id}>
        <MUIListItem button={true}>
          <ListItemText primary={text} />
          <Divider />
        </MUIListItem>
      </Link>
    )
  }

  return (
    <MUIListItem key={id}>
      <ListItemText primary={text} />
      <Divider />
    </MUIListItem>
  )
}

export const List = ({ loading, error, addLink, items, onRefresh, errorText, addText }: ListProps) => {
  if (loading) return <Loader />

  return (
    <ListWrapper>
      <ListContents component='nav'>
        {
          error && <MUIListItem button={true} onClick={onRefresh}>
            <ListItemText primary={errorText} />
            <Divider />
          </MUIListItem>
        }
        {
          items.length > 0 && items.map((itemProps) =>
            <ListItem {...itemProps} key={itemProps.id} />
          )
        }
      </ListContents>
      {
        addLink && <AddLink to={addLink}>
          <PrimaryButton>
            {addText}
          </PrimaryButton>
        </AddLink>
      }
    </ListWrapper>
  )
}
