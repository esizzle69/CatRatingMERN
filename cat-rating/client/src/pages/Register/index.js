import React from "react";
import { withRouter  } from "react-router-dom";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Box from '@material-ui/core/Box';
import Footer from "../../components/Footer/Footer";
import "./styles.css";
import api from '../../api/api'
/* Component for the Login page */
class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      passwordcf: "",
      uid: ""
    };
  }

//validate login info
  registerHandler = async (e) => {
    e.preventDefault()
    //if (this.state.username === "user" && this.state.password === "user"){
    if (this.state.username == "admin") {
      alert("Can't register an Admin account")
    } else if (this.state.password == this.state.passwordcf 
        && this.state.username.length >= 1 && this.state.password.length >= 1){
      const payload = {
        username: this.state.username,
        password: this.state.password
      }
      await api.insertUser(payload).then(user => {
        alert("successfully registered!")
        console.log(user)
        this.setState({uid: user.data._id})
        this.props.history.push("/" + this.state.uid + "/Profile");
      }).catch((error) => {
        alert(error);
      });
    } else if (this.state.password != this.state.passwordcf) {
      alert(`passwords don't match`)
    } else if (this.state.username.length < 1){
      alert(`username should be at least 1 character long`)
    } else if (this.state.password.length < 1){
      alert(`you need a password at least 1 character long to register`)
    }
    //redirect to CatProfile page
  }

  render() {
    return (
      <div>
        <h1>User Registration</h1>

          <div className="login">
            <TextField required label="Username" className="noneopa"
              onChange={(event) =>
                this.setState({ username: event.target.value })
              }
              onKeyPress= {(e) => {
                  if (e.key === 'Enter') {
                    console.log('Enter key pressed');
                    this.registerHandler(e)
              }}}
            />
            <br />
            <TextField required type="password" label="Password"
              onChange={(event) =>
                this.setState({ password: event.target.value})
              }
              onKeyPress= {(e) => {
                if (e.key === 'Enter') {
                  console.log('Enter key pressed');
                  this.registerHandler(e)
              }}}
            />
            <TextField required type="password" label="Confirm Password"
              onChange={(event) =>
                this.setState({ passwordcf: event.target.value})
              }
              onKeyPress= {(e) => {
                if (e.key === 'Enter') {
                  console.log('Enter key pressed');
                  this.registerHandler(e)
              }}}
            />
            <br />
            <Box m="20px">
            <Button variant="contained" color="primary" onClick ={(event)=>this.registerHandler(event)}>
              Register
            </Button>
            </Box>
          </div>
        <Footer />
        </div>

    );
  }
}
export default withRouter(Register);
