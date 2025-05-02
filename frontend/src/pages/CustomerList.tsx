import { useState, useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Box,
} from '@mui/material'
import { customerApi, Customer } from '../services/api'
import CustomerForm from '../components/CustomerForm'

const CustomerList = () => {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [openForm, setOpenForm] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)

  const loadCustomers = async () => {
    try {
      const response = await customerApi.getAll()
      setCustomers(response.data.member)
    } catch (error) {
      console.error('Erreur lors du chargement des clients:', error)
    }
  }


  const handleCreate = async (data: Omit<Customer, 'id'>) => {
    try {
      await customerApi.create(data)
      setOpenForm(false)
      setTimeout(() => {
        loadCustomers()
      }, 500)
    } catch (error) {
      console.error('Erreur lors de la création du client:', error)
    }
  }

  const handleUpdate = async (id: number, data: Partial<Customer>) => {
    try {
      await customerApi.update(id, data)
      setOpenForm(false)
      setSelectedCustomer(null)
      setTimeout(() => {
        loadCustomers()
      }, 500)
    } catch (error) {
      console.error('Erreur lors de la mise à jour du client:', error)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await customerApi.delete(id)
      loadCustomers()
    } catch (error) {
      console.error('Erreur lors de la suppression du client:', error)
    }
  }

  useEffect(() => {
    loadCustomers()
  }, [])

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4">Liste des Clients</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setSelectedCustomer(null)
            setOpenForm(true)
          }}
        >
          Ajouter un client
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Civilité</TableCell>
              <TableCell>Nom</TableCell>
              <TableCell>Prénom</TableCell>
              <TableCell>Code postal</TableCell>
              <TableCell>Ville</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>{customer.id}</TableCell>
                <TableCell>{customer.title}</TableCell>
                <TableCell>{customer.lastname}</TableCell>
                <TableCell>{customer.firstname}</TableCell>
                <TableCell>{customer.postalCode}</TableCell>
                <TableCell>{customer.city}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>
                  <Button
                    color="primary"
                    onClick={() => {
                      setSelectedCustomer(customer)
                      setOpenForm(true)
                    }}
                  >
                    Modifier
                  </Button>
                  <Button
                    color="error"
                    onClick={() => handleDelete(customer.id)}
                  >
                    Supprimer
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <CustomerForm
        open={openForm}
        onClose={() => {
          setOpenForm(false)
          setSelectedCustomer(null)
        }}
        onSubmit={selectedCustomer ? (data) => handleUpdate(selectedCustomer.id, data) : handleCreate}
        initialData={selectedCustomer}
      />
    </Box>
  )
}

export default CustomerList
