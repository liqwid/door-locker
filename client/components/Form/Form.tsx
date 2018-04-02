import styled from 'styled-components'

import { DefaultButton } from 'components/Button'

export const FormContent = styled.div`
display: flex;
flex-direction: column;
align-items: center;
margin: 0 16px 0 16px;
height: 100%;
`

export const FormFields = styled.div`
display: flex;
flex-direction: column;
align-items: center;
width: 100%;
>* {
  width: 100%;
}
flex: 1;
overflow: auto;
`

export const RefreshButton = styled(DefaultButton)`
  max-width: 80% !important
`
