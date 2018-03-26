import Button from 'material-ui/Button'

import styled from 'styled-components'

import { WHITE, TEAL, RED_ORANGE } from 'styles/colors'

const BaseButton = styled(Button)`
  border-radius: 8px !important;
  font-size: 24px !important;
  width: 360px !important;
  height: 64px !important;
  max-width: 100% !important;
`

export const DefaultButton = styled(BaseButton)`
  border: 1px solid ${WHITE} !important;
`

export const PrimaryButton = styled(BaseButton)`
  background-color: ${TEAL} !important;
`

export const SecondaryButton = styled(BaseButton)`
  background-color: ${RED_ORANGE} !important;
`
