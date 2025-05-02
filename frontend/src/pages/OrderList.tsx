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
import { orderApi, Order } from '../services/api'
import OrderForm from '../components/OrderForm'

const OrderList = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [openForm, setOpenForm] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  const loadOrders = async () => {
    try {
      const response = await orderApi.getAll()
      const orderData = ((response.data as unknown) as { member: Order[] }).member || []
      setOrders(orderData)
    } catch (error) {
      console.error('Erreur lors du chargement des commandes:', error)
    }
  }

  useEffect(() => {
    loadOrders()
  }, [])

  const handleCreate = async (data: Omit<Order, 'id'>) => {
    try {
      await orderApi.create(data)
      loadOrders()
      setOpenForm(false)
    } catch (error) {
      console.error('Erreur lors de la création de la commande:', error)
    }
  }

  const handleUpdate = async (id: number, data: Partial<Order>) => {
    try {
      await orderApi.update(id, data)
      loadOrders()
      setOpenForm(false)
      setSelectedOrder(null)
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la commande:', error)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await orderApi.delete(id)
      loadOrders()
    } catch (error) {
      console.error('Erreur lors de la suppression de la commande:', error)
    }
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4">Liste des Commandes</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setSelectedOrder(null)
            setOpenForm(true)
          }}
        >
          Ajouter une commande
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Produit</TableCell>
              <TableCell>Quantité</TableCell>
              <TableCell>Prix</TableCell>
              <TableCell>Devise</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Client</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.product}</TableCell>
                <TableCell>{order.quantity}</TableCell>
                <TableCell>{order.price}</TableCell>
                <TableCell>{order.currency}</TableCell>
                <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                <TableCell>
                  {order.customer.firstname} {order.customer.lastname}
                </TableCell>
                <TableCell>
                  <Button
                    color="primary"
                    onClick={() => {
                      setSelectedOrder(order)
                      setOpenForm(true)
                    }}
                  >
                    Modifier
                  </Button>
                  <Button
                    color="error"
                    onClick={() => handleDelete(order.id)}
                  >
                    Supprimer
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <OrderForm
        open={openForm}
        onClose={() => {
          setOpenForm(false)
          setSelectedOrder(null)
        }}
        onSubmit={selectedOrder ? (data) => handleUpdate(selectedOrder.id, data) : handleCreate}
        initialData={selectedOrder}
      />
    </Box>
  )
}

export default OrderList