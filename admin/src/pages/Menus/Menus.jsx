import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import './Menus.css'

const Menus = ({ url }) => {
    const [menus, setMenus] = useState([])
    const [form, setForm]   = useState({
        restaurantName: '', category: '', name: '', description: '', price: '', image: ''
    })
    const [loading, setLoading] = useState(false)
    const [filter, setFilter]   = useState('')

    const fetchMenus = async () => {
        try {
            const res = await axios.get(url + '/api/menu/list')
            if (res.data.success) setMenus(res.data.data)
        } catch { toast.error('Failed to load menus') }
    }

    useEffect(() => { fetchMenus() }, [])

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

    const handleAdd = async e => {
        e.preventDefault()
        if (!form.restaurantName || !form.name || !form.price) {
            toast.error('Restaurant, name and price are required'); return
        }
        setLoading(true)
        try {
            const res = await axios.post(url + '/api/menu/add', { ...form, price: Number(form.price) })
            if (res.data.success) {
                toast.success('Menu item added')
                setForm({ restaurantName: '', category: '', name: '', description: '', price: '', image: '' })
                fetchMenus()
            } else { toast.error(res.data.message) }
        } catch { toast.error('Server error') }
        finally { setLoading(false) }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this menu item?')) return
        try {
            const res = await axios.delete(url + `/api/menu/delete/${id}`)
            if (res.data.success) { toast.success('Deleted'); fetchMenus() }
        } catch { toast.error('Error') }
    }

    const filtered = filter ? menus.filter(m => m.restaurantName.toLowerCase().includes(filter.toLowerCase())) : menus

    const restaurants = [...new Set(menus.map(m => m.restaurantName))]

    return (
        <div className='menus-page'>
            <h2>Restaurant Menus</h2>
            <p className='menus-desc'>
                Menus are restaurant-specific dishes displayed on the /menu page of the frontend.
                Different from the main food catalog — each restaurant can have its own prices and items.
            </p>

            {/* Add form */}
            <form onSubmit={handleAdd} className='menus-form'>
                <input name='restaurantName' value={form.restaurantName} onChange={handleChange} placeholder='Restaurant name *' required />
                <input name='category'       value={form.category}       onChange={handleChange} placeholder='Category (e.g. Biryani, Starters)' />
                <input name='name'           value={form.name}           onChange={handleChange} placeholder='Item name *' required />
                <input name='description'    value={form.description}    onChange={handleChange} placeholder='Description' />
                <input name='price'          value={form.price}          onChange={handleChange} placeholder='Price (₹) *' type='number' required />
                <input name='image'          value={form.image}          onChange={handleChange} placeholder='Image URL (optional)' />
                <button type='submit' disabled={loading}>{loading ? 'Adding…' : '+ Add Item'}</button>
            </form>

            {/* Filter */}
            {restaurants.length > 0 && (
                <div className='menus-filter'>
                    <select value={filter} onChange={e => setFilter(e.target.value)}>
                        <option value=''>All Restaurants ({menus.length} items)</option>
                        {restaurants.map(r => (
                            <option key={r} value={r}>{r} ({menus.filter(m => m.restaurantName === r).length})</option>
                        ))}
                    </select>
                </div>
            )}

            {/* List */}
            {filtered.length === 0 ? (
                <p className='menus-empty'>No menu items yet. Add one above.</p>
            ) : (
                <div className='menus-table'>
                    <div className='menus-thead'>
                        <span>Restaurant</span>
                        <span>Category</span>
                        <span>Item</span>
                        <span>Price</span>
                        <span>Action</span>
                    </div>
                    {filtered.map(m => (
                        <div key={m._id} className='menus-row'>
                            <span className='menus-restaurant'>{m.restaurantName}</span>
                            <span className='menus-cat'>{m.category || '—'}</span>
                            <span>
                                <strong>{m.name}</strong>
                                {m.description && <p className='menus-item-desc'>{m.description}</p>}
                            </span>
                            <span className='menus-price'>₹{m.price}</span>
                            <span>
                                <button className='menus-delete-btn' onClick={() => handleDelete(m._id)}>Delete</button>
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Menus