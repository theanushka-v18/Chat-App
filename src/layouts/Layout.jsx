import AuthContainer from '../components/Login'
import Navbar from '../components/Navbar'
import { Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <>
     <Navbar />
     <Outlet /> 
    </>
  )
}

export default Layout
