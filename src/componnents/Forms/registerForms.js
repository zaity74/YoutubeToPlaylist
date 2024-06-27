import './login_form.scss';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Redux import 
import { userRegister } from '../../Redux/Actions/userActions';
// Hooks
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';

function RegisterForm(props) {
    // State
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [errors, setErrors] = useState({});

    // New constantes
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isRegiter, error } = useSelector(state => state.userRegister); 
    const errorRegister = useSelector(state => state.userRegister.error); 
    const userRegisterState = useSelector(state => state.userRegister);


    // EFFECTS
    useEffect(() => {
        if (userRegisterState.error) {
            setErrors(userRegisterState.error);
        }
    }, [userRegisterState]);
  
    // Events
    const handleRegister = async (e) => {
        e.preventDefault();
        setErrors({}); // Reset errors before new attempt

        try {
            await dispatch(userRegister(firstname, lastname, email, password));
            // navigate('/login');
        } catch (error) {
            console.error('Registration error:', error);
        }
    };
   
    // Variables
  
    return (
      <>
            <div className='section-login'>
            <div className='container'>
            <div className='login-section'>
            <form className='loginForm' onSubmit={handleRegister}>
                <div className='intro'>
                    <h2>Register with your e-mail address</h2>
                </div>
                <div className='entry'>
                    <div className='left'>
                        <div className='entry-item'>
                            <label>
                                Firstname
                            </label>
                            <input 
                                style={{border : errors['name.firstname'] ? '3px red solid' : '' }}
                                type='text' 
                                id='firstname' 
                                placeholder='Enter your firstname' 
                                value={firstname}
                                onChange={(e) => setFirstname(e.target.value)}
                            />
                            {errors['name.firstname'] && <span className='error'>{errors['name.firstname']}</span>}
                        </div>

                        <div className='entry-item'>
                            <label >
                                Lastname
                            </label>
                            <input 
                                style={{border : errors['name.lastname'] ? '3px red solid' : '' }}
                                type='text' 
                                id='lastname' 
                                placeholder='Enter your lastname' 
                                value={lastname}
                                onChange={(e) => setLastname(e.target.value)}
                            />
                            {errors['name.lastname'] && <span className='error'>{errors['name.lastname']}</span>}
                        </div>

                        <div className='entry-item'>
                            <label>
                            E-mail address
                            </label>
                        <input 
                            style={{border : errors['email'] ? '3px red solid' : '' }}
                            type='email' 
                            id='signIn' 
                            name='email address'
                            placeholder='Email address' 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} 
                        />
                        {errors.email && <span className='error'>{errors.email}</span>}

                        </div>

                        <div className="entry-item">
                            <div className="password-label">
                                <label>
                                    Password
                                </label>
                            </div>
                            <input 
                                style={{border : errors['password'] ? '3px red solid' : '' }}
                                type="password" 
                                id="password" 
                                name="Password" 
                                placeholder="Password" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                            />
                            {errors.password ? <span className='error'>{errors.password}</span> : 
                                <p className='infoLabel'>Must contain at least 10 characters</p>
                            }
                        </div>

                        <div className="buttons">
                            <button 
                                id="button_form" 
                                type="submit" 
                                >Sign in
                            </button>
                        </div>

                        <div className='existUser'>
                            <p className='infoLabel'>Already have an account ? 
                            </p>
                            <Link to={'/login'}>Connectez-vous</Link>
                        </div>
                    </div>
                    <div className='image'></div>
                </div>

            </form>
            </div>
            </div>
            </div>
            <ToastContainer />
      </>
    );
  }
  
  export default RegisterForm;