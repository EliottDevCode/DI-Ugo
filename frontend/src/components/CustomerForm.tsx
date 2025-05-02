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
} from '@mui/material'
import { Customer } from '../services/api'

interface CustomerFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: Omit<Customer, 'id'>) => void
  initialData?: Customer | null
}

const CustomerForm = ({ open, onClose, onSubmit, initialData }: CustomerFormProps) => {
  const [formData, setFormData] = useState<Omit<Customer, 'id'>>({
    title: '',
    lastname: '',
    firstname: '',
    postalCode: 0,
    city: '',
    email: '',
  })

  useEffect(() => {
    if (initialData) {
      const { id: _id, ...rest } = initialData
      setFormData(rest)
    } else {
    setFormData({
      title: '',
      lastname: '',
      firstname: '',
      postalCode: 0,
      city: '',
      email: '',
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
        {initialData ? 'Modifier le client' : 'Ajouter un client'}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              select
              label="Civilité"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            >
              <MenuItem value="m">M.</MenuItem>
              <MenuItem value="mme">Mme</MenuItem>
            </TextField>
            <TextField
              label="Nom"
              value={formData.lastname}
              onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
              required
            />
            <TextField
              label="Prénom"
              value={formData.firstname}
              onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
              required
            />
            <TextField
              label="Code postal"
              value={formData.postalCode}
              onChange={(e) => setFormData({ ...formData, postalCode: Number(e.target.value) })}
              required
            />
            <TextField
              label="Ville"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              required
            />
            <TextField
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
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

export default CustomerForm