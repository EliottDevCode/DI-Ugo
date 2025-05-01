import { AppBar, Toolbar, Typography, Button } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

const Navbar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Gestion des Commandes
        </Typography>
        <Button color="inherit" component={RouterLink} to="/customers">
          Clients
        </Button>
        <Button color="inherit" component={RouterLink} to="/orders">
          Commandes
        </Button>
      </Toolbar>
    </AppBar>
  )
}

export default Navbar