import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import './DeliveryBoys.css'

const DeliveryBoys = ({ url }) => {

    const [boys, setBoys]     = useState([])
    const [form, setForm]     = useState({ name: '', phone: '', email: '', vehicle: 'Bike' })
    const [loading, setLoading] = useState(false)

    const fetchBoys = async () => {
        try {
            const res = await axios.get(url + '/api/deliveryboy/list')
            if (res.data.success) setBoys(res.data.data)
        } catch { toast.error('Failed to load delivery boys') }
    }

    useEffect(() => { fetchBoys() }, [])

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

    const handleAdd = async e => {
        e.preventDefault()
        if (!form.name || !form.phone) { toast.error('Name and phone are required'); return }
        setLoading(true)
        try {
            const res = await axios.post(url + '/api/deliveryboy/add', form)
            if (res.data.success) {
                toast.success(`${form.name} added as delivery boy`)
                setForm({ name: '', phone: '', email: '', vehicle: 'Bike' })
                fetchBoys()
            } else {
                toast.error(res.data.message)
            }
        } catch { toast.error('Server error') }
        finally { setLoading(false) }
    }

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Remove ${name}?`)) return
        try {
            const res = await axios.delete(url + `/api/deliveryboy/delete/${id}`)
            if (res.data.success) { toast.success('Removed'); fetchBoys() }
        } catch { toast.error('Error') }
    }

    const toggleAvailability = async (boy) => {
        try {
            const res = await axios.put(url + `/api/deliveryboy/update/${boy._id}`, {
                isAvailable: !boy.isAvailable
            })
            if (res.data.success) fetchBoys()
        } catch { toast.error('Error') }
    }

    return (
        <div className='db-page'>
            <h2>Delivery Boys</h2>
            <p className='db-desc'>
                Add your delivery staff here. When you assign a driver to an order from the Orders page,
                WhatsApp opens automatically with their delivery link. The driver just opens the link —
                their live GPS location is shared instantly on the customer's tracking map.
            </p>

            {/* Add form */}
            <form onSubmit={handleAdd} className='db-form'>
                <input name='name'    value={form.name}    onChange={handleChange} placeholder='Full name *'     required />
                <input name='phone'   value={form.phone}   onChange={handleChange} placeholder='Phone number *'  required />
                <input name='email'   value={form.email}   onChange={handleChange} placeholder='Email (optional)'/>
                <select name='vehicle' value={form.vehicle} onChange={handleChange}>
                    <option value='Bike'>Bike</option>
                    <option value='Scooter'>Scooter</option>
                    <option value='Cycle'>Cycle</option>
                    <option value='Car'>Car</option>
                </select>
                <button type='submit' disabled={loading}>
                    {loading ? 'Adding…' : '+ Add Driver'}
                </button>
            </form>

            {/* List */}
            {boys.length === 0 ? (
                <p className='db-empty'>No delivery boys added yet. Add one above.</p>
            ) : (
                <div className='db-table'>
                    <div className='db-thead'>
                        <span>Name</span>
                        <span>Phone</span>
                        <span>Vehicle</span>
                        <span>Status</span>
                        <span>Current Order</span>
                        <span>Actions</span>
                    </div>
                    {boys.map(b => (
                        <div key={b._id} className='db-row'>
                            <span className='db-name'>{b.name}</span>
                            <span>{b.phone}</span>
                            <span>{b.vehicle}</span>
                            <span>
                                <button
                                    className={`db-avail-btn ${b.isAvailable ? 'available' : 'busy'}`}
                                    onClick={() => toggleAvailability(b)}
                                >
                                    {b.isAvailable ? '🟢 Available' : '🔴 On Delivery'}
                                </button>
                            </span>
                            <span className='db-order'>
                                {b.currentOrder ? b.currentOrder.toString().slice(-6) : '—'}
                            </span>
                            <span>
                                <button className='db-delete-btn' onClick={() => handleDelete(b._id, b.name)}>
                                    Remove
                                </button>
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default DeliveryBoys