import React, { useState } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { Backdrop, CircularProgress } from '@mui/material';

import Logo from "../../Assets/logo.png";
import "../Login/Login.css";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async () => {
        if (!email || !password) {
            toast.error('Please enter both email and password');
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post('https://us-east-1.aws.data.mongodb-api.com/app/application-0-jekzxop/endpoint/Login', {
                email,
                password
            });

            if (response.data.success) {
                toast.success('Login successful');
                sessionStorage.setItem('email', email);
                sessionStorage.setItem('token', response.data.token); // Assuming response contains a token
                navigate('/');
                window.location.reload(); // Force a page reload
            } else {
                toast.error('Login failed');
            }
        } catch (error) {
            toast.error('Error logging in');
            console.error('Error logging in', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className='loginSection'>
            <Container className='loginContainer'>
                <Row>
                    <Col sm={12} className='imgCollogin'>
                        <img src={Logo} className='iconimg' alt='Logo' />
                    </Col>
                    <Col sm={12} className='loginInputCol'>
                        <h3 className='loginh3'>HR-Slip-Portal, Sign in</h3>
                        <div className='loginInputs'>
                            <input
                                className='logininputclass'
                                type="email"
                                id="email"
                                name="email"
                                placeholder='Email'
                                value={email}
                                required
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <input
                                className='logininputclass'
                                type="password"
                                id="password"
                                name="password"
                                placeholder='Password'
                                value={password}
                                required
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <Button className="loginisterbutton" onClick={handleLogin}>Login</Button>
                        </div>
                    </Col>
                </Row>
                <ToastContainer />
            </Container>
             <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </section>
    );
};

export default Login;
