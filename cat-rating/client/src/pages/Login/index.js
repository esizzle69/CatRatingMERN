import React from "react";
import { withRouter  } from "react-router-dom";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Box from '@material-ui/core/Box';
import Footer from "../../components/Footer/Footer";
import "./styles.css";
import api from '../../api/api'
/* Component for the Login page */
class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      uid: ""
    };
  }

//validate login info
  loginHandler = async (e) => {
    e.preventDefault()
    if (this.state.username == "admin" && this.state.password != "admin"){ 
      alert("Wrong Admin Password")

    } else if (this.state.username.length > 0 && this.state.password.length > 0){
      await api.getAllUsers().then(async(users) => {
        var userList = users.data.filter(user => {
          if(user.username == this.state.username && user.password == this.state.password){
            return user
          }
          return
        })
        if (userList.length == 0 ){
          alert("Username doesn't exist ")
          return
        }
        console.log(userList[0])
        this.setState({
          uid: userList[0]._id
        })
        this.forceUpdate();
        if(this.state.username == "admin"){
          this.props.history.push("/" + this.state.uid + "/Admin");
        } else {
          let flag = 0;
          await api.getUserById(this.state.uid).then(async(user) =>{
            await api.getAllCats().then(async(cats) => {
              let catList = await cats.data.filter(cat => {
                  let isTouched = 0;
                  let isVoted = 0;
                  for(let user of cat.dislikedUsers.concat(cat.likedUsers)){
                      if(user == this.state.uid){
                        isTouched = 1;
                        break;
                      }
                  }
                  for (let catVoted of user.data.catsVoted){
                    if(isTouched != 0 || cat._id == catVoted){
                      isVoted = 1;
                      break;
                    }
                  }
                  if(isVoted == 0){
                      return cat
                  }
              });
              console.log(catList)    
              if(catList.length == 0){
                await alert("You have voted all the cats we have")
                this.props.history.push("/" + this.state.uid + "/Rankings");
                flag = 1;
              }
            })
          });
          if(flag === 0){
            this.props.history.push("/" + this.state.uid + "/Rating");
          }
        }
      }).catch((error) => {
          alert("user doesn't exist, please register");
      });
      //redirect to CatProfile page
      // if(this.state.username == "admin"){
      //   this.props.history.push("/" + "admin" + "/Admin");
      // } else {
      //   this.props.history.push("/" + this.state.uid + "/Rating");
      // }
    } else {
      alert("wrong password")
    }

  }

  render() {
    return (
      <div>
        <h1>User/Admin Login</h1>

          <div className="login">
            <TextField required label="Username" className="noneopa"
              onChange={(event) =>
                this.setState({ username: event.target.value })
              }
              onKeyPress= {(e) => {
                  if (e.key === 'Enter') {
                    console.log('Enter key pressed');
                    this.loginHandler(e)
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
                  this.loginHandler(e)
              }}}
            />
            <br />
            <Box m="20px">
            <Button variant="contained" color="primary" onClick ={(event)=>this.loginHandler(event)}>
              Login
            </Button>
            </Box>
            <Box m="20px">
            <Button variant="contained" color="primary" href="../Register">
              Register
            </Button>
            </Box>
          </div>
        <Footer />
        </div>

    );
  }
}
export default withRouter(Login);
