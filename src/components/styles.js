import styled from 'styled-components'

export const Button = styled.button`
  background: lightblue;
  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border: 2px solid Chocolate;
  border-radius: 3px;
`

export const Input = styled.input`
  margin: 0.25em;
  width: 300px;  
`
export const Page = styled.div`
  padding: 1em;
  background: lightblue;
`

export const Navigation = styled.div`
  background: BurlyWood;
  padding: 1em;
`

export const Footer = styled.div`
  background: Chocolate;
  padding: 1em;
  margin-top: 1em;
`
export const Notificationbox = styled.div`
  border: 2px solid ${props => props.error ? '#b22222' : '#2e8b57'};
  background: ${props => props.error ? '#ffe4e1' : '#e6ffed'};
  color: ${props => props.error ? '#8b0000' : '#1f5f3a'};
`