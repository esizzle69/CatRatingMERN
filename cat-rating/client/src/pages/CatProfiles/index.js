//Home page, with random cat profiles
import Navbar from "../../components/Navbar/Navbar";
import Button from "@material-ui/core/Button";
import { withStyles } from '@material-ui/core/styles';
import api from '../../api/api'
import React, {useState, useEffect} from 'react';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { Card} from "@material-ui/core";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from '@material-ui/core/Toolbar';
import PetsIcon from '@material-ui/icons/Pets';

import FormControl from '@material-ui/core/FormControl';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormLabel from '@material-ui/core/FormLabel';

import "./styles.css";

const useStyles = theme => ({
  root: {
    height: '0vh',
  },
  paper: {
    margin: theme.spacing(5, 2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  card1: {
      width: "650px",
      height: "auto",
      opacity: "0.93",
      background: 'linear-gradient(45deg, ##ffffff 20%, #e1e1e1 90%)',
  },
  card2: {
      opacity: "0.93",
      background: 'linear-gradient(45deg, ##ffffff 20%, #e1e1e1 90%)',
  },
  image: {
      width: "100%",
      height: "auto",
  },
  center: {
      marginLeft: '45%',
      alignItems: 'center',
  },
  button: {
    display: 'block',
    alignItems: 'center',
  },
  formControl: {
    marginLeft: theme.spacing(9),
    marginTop: theme.spacing(5),
    minWidth: 200,
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginTop: theme.spacing(4),
    marginLeft: theme.spacing(5),
    marginRight: theme.spacing(5),
    marginBottom: theme.spacing(2),
    width: 200,
  },
  upload: {
    display: "none",
  }
});

class CatProfiles extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      //card: 0,
      //idx: 1,
      //isLoading: false
      uid: this.props.match.params.uid,
      cid: this.props.match.params.cid,
      catInfo: {},
      readonly: true,
      nameInfo: "",
      birthdayInfo: "",
      genderInfo: "",
      bioInfo: "",
      photoInfo: require("../../images/add_new_cat.png"),
      isLoading: false
    }

    this.changeProfilePhotoHandler = this.changeProfilePhotoHandler.bind(this)
  }

  componentDidMount = async () => {

    this.setState({ isLoading: true })

    if(this.state.cid != "new"){
      await api.getUserById(this.state.uid).then(async(user) => {
        for(var i = 0; i < user.data.catsOwned.length; i++){
          if(user.data.catsOwned[i] == this.state.cid){
            this.setState({readonly: false});
          }
        }
      }).catch(e => {
          //"User or Cat not found"
          alert(e);
      });
      await api.getCatByUidCid(this.state.uid,
                               this.state.cid).then(async(cat) => {
          console.log(cat.data.cat.photos)
          this.setState({ catInfo: cat.data.cat,
                          nameInfo: cat.data.cat.name,
                          birthdayInfo: cat.data.cat.birthday,
                          genderInfo: cat.data.cat.gender,
                          bioInfo: cat.data.cat.bio,
                          photoInfo: cat.data.cat.photos == "" ? require("../../images/add_new_cat.png") : cat.data.cat.photos
          });
      }).catch(e => {
          alert(e);
      });
    } else {
      this.setState({readonly: false});
    }
    
    this.setState({isLoading: false});
  }

  async changeProfilePhotoHandler(e) {
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
            photoInfo: data.image_url
          })
        })
        .catch(error => {
            console.log(error);
        });
  }

  saveData = async () => {
    var payload = {
        name: this.state.nameInfo,
        birthday: this.state.birthdayInfo,
        gender: this.state.genderInfo,
        bio: this.state.bioInfo,
        photos: this.state.photoInfo
    }
    if(this.state.cid != "new"){
      
      await api.updateCatByUidCid(this.state.uid,
                               this.state.cid, payload).then(async(cat) => {
        alert("Saved!")
      }).catch(e => {
        alert(e + `\n` + "error updating cat info")
      });
    } else {
      await api.insertCat(this.state.uid, payload).then(async(cat) => {
          this.setState({cid: cat.data.cat._id})
          alert("Saved!")
          this.props.history.push("/" + this.state.uid + "/CatProfiles/" + this.state.cid);
      }).catch(e => {
        alert(e + `\n` + "error updating cat info")
      });
    }
  }

  render() {
    const { classes } = this.props
    return (
      <div>
        <Navbar username={this.state.uid} />
        <React.Fragment>
          <AppBar position="relative">
              <Toolbar>
                <PetsIcon/>
                <Typography variant="h6" color="inherit" noWrap>
                    &nbsp; &nbsp;Manage your cat's profile
                </Typography>
              </Toolbar>
          </AppBar>
          <Grid container className={classes.root} direction="row" justify="center" alignItems="stretch" spacing={2}>
              {/*<CssBaseline />*/}
              <Grid item>
                <Card className={classes.card1}>
                    
                    <img src={this.state.photoInfo} className={classes.image}/>
                    
                    <Button color='primary' onChange ={(event)=> {this.changeProfilePhotoHandler(event)}} disabled={this.state.readonly} variant="contained" component="label" className={classes.button}>
                      <div className={classes.center}>Upload File</div>
                      <input type="file" className={classes.upload} />
                    </Button>
                </Card>
              </Grid>
              <Grid item>
                <Card className={classes.card2}>
                    <Grid container item xs={7} direction="column" 
                                      justify="flex-start"
                                      alignItems="stretch"  spacing={4}>
                      <div className={classes.paper}>
                        <TextField
                            InputProps={{
                              readOnly: this.state.readonly,
                            }}
                            id="outlined-multiline-static"
                            label="name"
                            value={this.state.nameInfo}
                            className={classes.textField}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            onChange={(event) => {
                              this.setState({nameInfo: event.target.value})
                              }   
                            }
                        />
                        <br/>
                        <form className={classes.container} noValidate>
                          <TextField
                            InputProps={{
                              readOnly: this.state.readonly,
                            }}
                            id="date"
                            label="Birthday"
                            type="date"
                            value={this.state.birthdayInfo}
                            className={classes.textField}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            onChange={(event) => {
                              this.setState({birthdayInfo: event.target.value})
                              }   
                            }
                          />
                        </form>
                        <FormControl disabled={this.state.readonly} component="fieldset" className={classes.formControl}>
                          <FormLabel component="legend">Gender</FormLabel>
                          <RadioGroup aria-label="gender" name="gender1" value={this.state.genderInfo} onChange={
                                                                    (event) => {
                                                                      this.setState({genderInfo: event.target.value});
                                                                  }}>
                            <FormControlLabel readOnly = {this.state.readonly} value="female" control={<Radio />} label="Female" />
                            <FormControlLabel readOnly = {this.state.readonly} value="male" control={<Radio />} label="Male" />
                          </RadioGroup>
                        </FormControl>
                        <TextField
                          InputProps={{
                              readOnly: this.state.readonly,
                            }}
                          id="outlined-multiline-static"
                          label="Bio"
                          multiline
                          rows="15"
                          value={this.state.bioInfo}
                          className={classes.textField}
                          variant="outlined"
                          style = {{width: 300}}
                          onChange={
                                      (event) => {
                                          this.setState({bioInfo: event.target.value});
                                    }}
                        />
                        <Button color='primary' disabled={this.state.readonly} variant="contained" component="label" 
                                      className={classes.button} onClick ={ this.saveData }>
                          <div>Save</div>
                        </Button>
                      </div>
                  
                  </Grid>
                </Card>
              </Grid>    
          </Grid>
        </React.Fragment>
      </div>
    );
  }
}

export default withStyles(useStyles)(CatProfiles);
