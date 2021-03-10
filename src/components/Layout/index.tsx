import React from 'react';
import { Container } from './style'

interface LayoutProps {
  children: React.ReactNode,
}

const Layout = ({children}: LayoutProps) => {
  return (<Container>{children}</Container>)
}

export default Layout