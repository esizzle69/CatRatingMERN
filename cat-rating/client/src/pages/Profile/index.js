//personal profile page, with personal information and 'your cats' section
import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import AppBar from "@material-ui/core/AppBar";
import Toolbar from '@material-ui/core/Toolbar';
import FaceIcon from '@material-ui/icons/Face';
import api from '../../api/api'
import "./styles.css";
import { Link, Card, CardActions, CardContent, Typography, Grid } from "@material-ui/core";

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      password: "",
      passwordConf: "",
      passwordInput: "",
      name: "",
      username: "",
      location: "",
      email: "",
      isLoading: false,
      photo: "https://res.cloudinary.com/djzv1twpf/image/upload/v1586040104/profile_pic_zz7jrh.png",
      ownCats: [],
      catsLiked: [],
      inputFlag: 0
    };

    this.changeProfilePhotoHandler = this.changeProfilePhotoHandler.bind(this)
  }

  setStateandFlag(e, action){
    this.setState({inputFlag: 1});
    if(e.target.value != ""){
      this.setState({action: e.target.value})
    }
  }

  componentDidMount = async () => {
    this.setState({ isLoading: true })
    await api.getUserById(this.props.match.params.uid).then(async(user) => {
      console.log(user)
      var ownCatsData = [];
      for(let catid of user.data.catsOwned){
        await api.getCatByUidCid(this.props.match.params.uid, catid).then(async(cat) =>{
          ownCatsData.push(cat.data.cat);
        })
      }
      var catsLikedData = [];
      for(let catid of user.data.catsLiked){
        await api.getCatByUidCid(this.props.match.params.uid, catid).then(async(cat) =>{
          catsLikedData.push(cat.data.cat);
        })
      }
      const photo = user.data.photo == "" ? this.state.photo : user.data.photo;
      this.setState({
        username: user.data.username,
        location: user.data.location,
        email: user.data.email,
        name: user.data.name,
        password: user.data.password,
        photo: photo,
        ownCats: ownCatsData,
        catsLiked: catsLikedData
      })
      this.forceUpdate();
      this.setState({isLoading: false})
    })
    let payload = {
      photo: this.state.photo
    }
    await api.updateUserById(this.props.match.params.uid, payload);
    console.log(typeof(this.state.location))
  }

  saveInfoHandler = async (e) => {
    e.preventDefault()
    if(this.state.inputFlag != 0){
      if (this.state.passwordInput === this.state.passwordConf || 
          (this.state.passwordInput == "" && this.state.passwordConf == "")){
        await api.getUserById(this.props.match.params.uid).then(async(user) => {
          var payload = {
            name: this.state.name,
            password: this.state.password,
            username: this.state.username,
            location: this.state.location,
            email: this.state.email,
            photo: this.state.photo
          }
          if (this.state.passwordInput === this.state.passwordConf && this.state.passwordInput != ""){
            payload.password = this.state.passwordInput
          }
          console.log(user)
          if((user.data.name != payload.name && payload.name != "") || (user.data.username != payload.username && payload.username != "")
              || (user.data.location != payload.location && payload.location != "")|| (user.data.email != payload.email && payload.email != "")
              || (user.data.password != payload.password && payload.password != "") || (user.data.photo != payload.photo && payload.password != "")){
            await api.updateUserById(this.props.match.params.uid, payload);
            alert("Your account information has been saved")
          }
        })
      
        this.setState({inputFlag: 0})
      }
      else{
        alert("Passwords do not match")
      }
    } else {
        alert("No info to save")
    }
    
  }

  removeCatFromList = async (e, action, cid) => {
    e.persist()
    console.log(e)
    if(action == "ownCats") {
      var newOwnedList = [];
      await api.getUserById(this.props.match.params.uid).then(async(user) => {
        for(var i = 0; i < user.data.catsOwned.length; i++){
          if(user.data.catsOwned[i] != cid){
            newOwnedList.push(user.data.catsOwned[i])
          }
        }
      })
      await api.deleteCatByUidCid(this.props.match.params.uid, cid)
      const payload = {catsOwned: newOwnedList};
      await api.updateUserById(this.props.match.params.uid, payload)
    } else if(action == "likedCats") {
      var newlikedList = [];
      var newVotedList = [];
      await api.getUserById(this.props.match.params.uid).then(async(user) => {
        for(var i = 0; i < user.data.catsLiked.length; i++){
          if(user.data.catsLiked[i] != cid){
            newlikedList.push(user.data.catsLiked[i])
          }
        }
        for(var i = 0; i < user.data.catsVoted.length; i++){
          if(user.data.catsVoted[i] != cid){
            newVotedList.push(user.data.catsVoted[i])
          }
        }
      })
      const payload = {catsVoted: newVotedList, catsLiked: newlikedList};
      await api.updateUserById(this.props.match.params.uid, payload)
    }

    let tableCell = e.target
    while (tableCell.className != "tableCell") {
      tableCell = tableCell.parentElement
    }
    tableCell.parentElement.removeChild(tableCell)
  }

  async changeProfilePhotoHandler(e) {
    const photo = document.querySelector(".propic")
    const form = new FormData();
    const url = "/images";

    form.append('image', e.target.files[0])
    const request = new Request(url, {
      method: "post",
      body: form,
    });

    fetch(request)
        .then(function(res) {
            if (res.status === 200) {
                return res.json();
            } else {
                alert("Could not upload the image");
            }
        })
        .then((data) => {
          this.setState({
            photo: data.image_url
          })

          const payload = {photo: this.state.photo};
          //api.updateUserById(this.props.match.params.uid, payload)
        })
        .catch(error => {
            console.log(error);
        });

    photo.src = this.state.photo
  }

  render() {
    return (
      <div>
          <Navbar username={this.props.match.params.uid}/>
        <AppBar position="relative">
	        <Toolbar>
	          <FaceIcon/>

	          <Typography variant="h6" color="inherit" noWrap>
	              &nbsp; &nbsp;Manage your profile
	          </Typography>
	        </Toolbar>
	    </AppBar>
        <div className="container">
          <Grid container direction="row" justify="center" alignItems="stretch" spacing={2}>

          <Grid item xs={2}>
            <Card className="cards">
            <CardActions>
              <TextField required label="Username" fullWidth value={this.state.username} onChange={(event) => {
                  this.setState({inputFlag: 1});
                  this.setState({ username: event.target.value });
                  
              }}/>
            </CardActions>
            <img className="propic" src={this.state.photo} alt="profile"/>
            <CardActions>
            <Button variant="contained" component="label" fullWidth onChange ={(event)=> {this.setState({inputFlag: 1}); this.changeProfilePhotoHandler(event)}}>
                    Upload Photo
            <input type="file" style={{ display: "none" }}/>
            </Button>
            </CardActions>
            <CardActions>
            <TextField label="Full Name" fullWidth value={this.state.name} onChange={(event) =>{
                this.setState({inputFlag: 1});
                this.setState({ name: event.target.value })
                }
                }/>
            </CardActions>
            <CardActions>
            <TextField label="Location" fullWidth value={this.state.location} onChange={(event) => {
                  this.setState({inputFlag: 1});
                  this.setState({ location: event.target.value });
                }
                }/>
            </CardActions>
            <CardActions>
            <TextField label="Email Address" fullWidth value={this.state.email} onChange={(event) => {
                  this.setState({inputFlag: 1});
                  this.setState({ email: event.target.value });
                  
                }
                }/>
            </CardActions>
            <CardActions>
            <TextField required label="New Password" type="password" fullWidth onChange={(event) => {
                  this.setState({inputFlag: 1});
                  this.setState({ passwordInput: event.target.value });
                  }
                }/>
            </CardActions>
            <CardActions>
            <TextField required label="Confirm password" id="passwordConf" type="password" fullWidth onChange={(event) => {
                  this.setState({inputFlag: 1});
                  this.setState({ passwordConf: event.target.value });
                  }  
              }/>
            </CardActions>
            <CardActions>
            <Button variant="contained" color="primary" onClick ={(event)=>this.saveInfoHandler(event)}>
                Save
            </Button>
            </CardActions>

            </Card>
          </Grid>

          <Grid   container item xs={7} direction="column"
          justify="flex-start"
          alignItems="stretch"  spacing={4}>
          <Grid  item>
            <Card className="cards">
            <CardContent className="catListCard">
            <h2 className="Title">
              Your Cats
            </h2>
            <div >
              <div className="catsTable">
                <div>
                  {this.state.ownCats.map(card => {
                    if (card != null)
                      return <div className="tableCell">
                        <a className="link" href={"/" + this.props.match.params.uid + "/CatProfiles/" + card._id}>
                          <img className="cat" src={card.photos}/>
                        </a>
                        <Button fullWidth startIcon={<DeleteForeverIcon/>} onClick ={(event)=>this.removeCatFromList(event, "ownCats", card._id)}>
                          Remove
                        </Button>
                      </div>
                    return
                   })}
                  <div className="tableCell">
                    <a  className="link" title="Post a New Cat" href={"/" + this.props.match.params.uid + "/CatProfiles/new"}>
                      <img className="cat" title="Post a New Cat" src={require("../../images/add_new_cat.png")} alt="add new cat"/>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            </CardContent>
            </Card>
          </Grid>

          <Grid item>
            <Card className="cards">
            <CardContent className="catListCard">
            <h2 className="Title">
              Cats You Liked
            </h2>
            <div>
              <div className="catsTable">
                <div>
                  {this.state.catsLiked.map(card => {
                    if (card != null)
                      return <div className="tableCell">
                                <a  className="link" href={"/" + this.props.match.params.uid + "/CatProfiles/" + card._id}>
                                  <img className="cat" src={card.photos}/>
                                </a>
                                <Button fullWidth startIcon={<ThumbDownIcon/>} onClick ={(event)=>this.removeCatFromList(event, "likedCats", card._id)}>
                                  Unlike
                                </Button>
                              </div>
                            
                      return
                   })}
                </div>
              </div>
            </div>
            </CardContent>
            </Card>
          </Grid>
          </Grid>
          </Grid>
        </div>
        <Footer/>
      </div>
    );
  }
}

export default Profile;
