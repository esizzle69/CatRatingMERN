import React from "react";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Button from "@material-ui/core/Button";
import HomeIcon from '@material-ui/icons/Home';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import api from '../../api/api';

import "./styles.css";


/* Component for the Login page */
class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.getAdminButton = this.getAdminButton.bind(this);
  }
  //{this.getAdminButton(this.props.username)}
  getAdminButton = async (username) => {
    await api.getUserById(username).then(async(user) => {
        console.log(user.data.username)
        if (user.data.username == "admin") {
          return <Button variant="contained" style={buttonStyle} href={"/" + username + "/Admin"} startIcon={<SupervisorAccountIcon/>}>Admin</Button>;
        } else {
          return <div></div>;
        }
    })
  }

  RatingHandler = async(username) => {
    let flag = 0;
    await api.getUserById(username).then(async(user) =>{
      await api.getAllCats().then(async(cats) => {
        let catList = await cats.data.filter(cat => {
            let isTouched = 0;
            let isVoted = 0;
            for(let user of cat.dislikedUsers.concat(cat.likedUsers)){
                if(user == username){
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
          await alert("You have voted all the cats we have.")
          flag = 1;
        }
      })
    });
    if(flag === 0){
      this.props.history.push("/" + username + "/Rating");
    }
  }

  render() {
    return (
      <div className="navbar">
        <ButtonGroup variant="contained" style={buttonGroupStyle} size="small" color="primary" aria-label="small primary button group">
          <Button style={buttonStyle} href={"/" + this.props.username + "/Rating"} startIcon={<HomeIcon/>}>
                Home
          </Button>
          <Button style={buttonStyle} href={"/" + this.props.username + "/Rankings"} startIcon={<EqualizerIcon/>}>
                Ranking
          </Button>
          <Button style={buttonStyle} href={"/" + this.props.username + "/Profile"} startIcon={<AccountBoxIcon/>}>
                Account
          </Button>
        </ButtonGroup>

        <ButtonGroup variant="contained" style={buttonGroupStyle} size="small" color="primary" aria-label="small outlined primary button group">
          <Button style={logoutStyle} href={"/"} color = "secondary" startIcon={<ExitToAppIcon/>}>
                Logout
          </Button>
        </ButtonGroup>
      </div>
    );
  }
}

const buttonGroupStyle = {
    margin: '5%'
};

const buttonStyle = {
    borderRadius: 3,
    padding: '10px 70px',
};

const logoutStyle = {
    borderRadius: 3,
    padding: '10px 10px',

};

export default Navbar;
