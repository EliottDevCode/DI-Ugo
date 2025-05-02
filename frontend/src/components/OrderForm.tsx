import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
  Autocomplete,
} from '@mui/material'
import { Order, Customer, customerApi } from '../services/api'

interface OrderFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: Omit<Order, 'id'>) => void
  initialData?: Order | null
}

const OrderForm = ({ open, onClose, onSubmit, initialData }: OrderFormProps) => {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [formData, setFormData] = useState<Omit<Order, 'id'>>({
    product: '',
    quantity: 0,
    price: 0,
    currency: 'EUR',
    date: new Date().toISOString().split('T')[0],
    customer: {} as Customer,
  })

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        const response = await customerApi.getAll()
        setCustomers(((response.data as unknown) as { member: Customer[] }).member || [])
          } catch (error) {
        console.error('Erreur lors du chargement des clients:', error)
      }
    }
    loadCustomers()
  }, [])

  useEffect(() => {
    if (initialData) {
      const { id, ...rest } = initialData
      setFormData(rest)
    } else {
      setFormData({
        product: '',
        quantity: 0,
        price: 0,
        currency: 'EUR',
        date: new Date().toISOString().split('T')[0],
        customer: {} as Customer,
      })
    }
  }, [initialData])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {initialData ? 'Modifier la commande' : 'Ajouter une commande'}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Autocomplete
              options={customers}
              getOptionLabel={(option) => `${option.firstname} ${option.lastname}`}
              value={formData.customer}
              onChange={(_, newValue) => {
                if (newValue) {
                  setFormData({ ...formData, customer: newValue })
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Client"
                  required
                />
              )}
            />
            <TextField
              label="Produit"
              value={formData.product}
              onChange={(e) => setFormData({ ...formData, product: e.target.value })}
              required
            />
            <TextField
              label="Quantité"
              type="number"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
              required
            />
            <TextField
              label="Prix"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
              required
            />
            <TextField
              select
              label="Devise"
              value={formData.currency}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              required
            >
              <MenuItem value="EUR">EUR</MenuItem>
              <MenuItem value="USD">USD</MenuItem>
              <MenuItem value="GBP">GBP</MenuItem>
            </TextField>
            <TextField
              label="Date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Annuler</Button>
          <Button type="submit" variant="contained" color="primary">
            {initialData ? 'Modifier' : 'Ajouter'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default OrderForm