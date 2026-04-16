import React, { useState } from 'react'
import './Login.css'
import { toast } from 'react-toastify'

const Login = ({ url, onLogin }) => {
    const [email, setEmail]       = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading]   = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const response = await fetch(`${url}/api/user/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            })
            const data = await response.json()

            if (data.success && data.isAdmin) {
                // ✅ Store token in localStorage for future API calls
                localStorage.setItem('adminToken', data.token)
                toast.success('Welcome, Admin!')
                onLogin(data.token)
            } else if (data.success && !data.isAdmin) {
                toast.error('Access denied. You are not an admin.')
            } else {
                toast.error(data.message || 'Login failed')
            }
        } catch (error) {
            toast.error('Server error. Please try again.')
        }
        setLoading(false)
    }

    return (
        <div className='login-page'>
            <div className='login-box'>
                <h2>🍽️ FoodRush Admin</h2>
                <p className='login-subtitle'>Sign in to access the admin panel</p>
                <form onSubmit={handleSubmit}>
                    <div className='login-field'>
                        <label>Email</label>
                        <input
                            type='email'
                            placeholder='admin@foodrush.com'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className='login-field'>
                        <label>Password</label>
                        <input
                            type='password'
                            placeholder='Enter your password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type='submit' className='login-btn' disabled={loading}>
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Login