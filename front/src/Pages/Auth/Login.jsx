import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from "react-router-dom";
// import { useToasts } from 'react-toast-notifications';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

// import proxy from '../../proxySetup'
// import { loginSchema } from '../../data_validation/index'
import { logged } from '../../_actions/authActions'


// import './style.scss';

const proxy = "http://localhost:5000";

// add custom style
const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const Login = () => {
  const [auth, setAuth] = useState({ email: "", password: "", checked: true })
    
    // const { addToast } = useToasts()
    const dispatch = useDispatch()
    const history = useHistory()
    const classes = useStyles();
    
 
    const onLogin = async e => {
        e.preventDefault()
        const url = `${proxy}/admin/auth/login`

        try {
            // const valid = await loginSchema.validate({ ...auth })
            const res = await fetch(url, { 
                headers: { 
                    'Content-Type': 'application/json' 
                },
                method: 'POST', 
                body: JSON.stringify(auth)
            })
           
            if (res.ok) {
                const result = await res.json()
                // addToast(result.message, { appearance: 'success', autoDismiss: false })

                dispatch(logged({
                    logged: true,
                    userData: result.data
                })) 
                console.log(result.data)

                history.push('/home')
                return;                
            }
            // addToast('An Error Occured during the sending process !', { appearance: 'error', autoDismiss: false })

        } catch (err) {
            // console.log(err.message)
        }

    };

  return  <div className="login-container">
            <Container component="main" maxWidth="xs">
              <CssBaseline />
              <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                  <LockOutlinedIcon />
                </Avatar>

                <Typography component="h1" variant="h5">
                  Sign in
                </Typography>

                <form className={classes.form} noValidate onSubmit={onLogin}>
                  <TextField variant="outlined" margin="normal"
                            required fullWidth id="email" label="Email Address"
                            name="email" autoComplete="email" autoFocus
                            value={auth.email}
                            onChange={(e) => setAuth({...auth, email: e.target.value})}
                  />
                  <TextField variant="outlined" margin="normal" required
                            fullWidth name="password" label="Password" type="password"
                            id="password" autoComplete="current-password"
                            value={auth.password}
                            onChange={(e) => setAuth({...auth, password: e.target.value})}
                  />
                  <Button type="submit" variant="contained" color="primary" 
                          className={classes.submit}>
                    Sign In
                  </Button>
                </form>

              </div>
            </Container>
          </div>;
};

export default Login;
