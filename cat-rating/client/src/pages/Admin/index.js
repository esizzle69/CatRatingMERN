import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import Button from '@material-ui/core/Button';
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import MoveToInboxIcon from "@material-ui/icons/MoveToInbox";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from '@material-ui/core/Toolbar';
import DashboardIcon from '@material-ui/icons/Dashboard';

import api from '../../api/api';
import { sortReportedCats } from "../../actions/sortCats";
import { sortReportedUsers } from "../../actions/sortCats";
import Footer from "../../components/Footer/Footer";
import "./styles.css";

class Admin extends React.Component {

  constructor(props) {
      super(props);

      this.state = {
        reportedCats: [],
        suspiciousUsers: [],
        isLoading: false,
        totalCountTemp: 0
      };
      this.sortBoth = this.sortBoth.bind(this);
      this.getUserTotalReport = this.getUserTotalReport.bind(this);
      this.removeCatFromReported = this.removeCatFromReported.bind(this);
      this.deleteUserPermanently = this.deleteUserPermanently.bind(this);
      this.deleteCatPermanently = this.deleteCatPermanently.bind(this);
  }

  componentDidMount = async () => {
    this.setState({ isLoading: true })
    var userWithReportedCats = [];
    var reportedCatsData = [];
    await api.getAllCats().then(async(cats) => {
      for(let cat of cats.data){
        if (cat.reports > 0 && cat.owner != this.props.match.params.uid){
          reportedCatsData.push(cat)
        }
      }
    }).catch(e => {
      alert("no reported Cats")
    })

    await api.getAllUsers().then(async(users) => {
      for(let user of users.data){
        if(user.username != "admin"){
          await this.getUserTotalReport(user._id)
          if (this.state.totalCountTemp > 0){
            await userWithReportedCats.push({data: user, totalReport: this.state.totalCountTemp})
          }
        }
      }
      
    })

    this.setState({reportedCats: reportedCatsData,
                     suspiciousUsers: userWithReportedCats})
    this.forceUpdate();
    this.sortBoth();
    this.setState({ isLoading: false })
  }

  refresh = async () => {
    this.setState({ isLoading: true })
    var userWithReportedCats = [];
    var reportedCatsData = [];
    await api.getAllCats().then(async(cats) => {
      for(let cat of cats.data){
        if (cat.reports > 0 && cat.owner != this.props.match.params.uid){
          reportedCatsData.push(cat)
        }
      }
    }).catch(e => {
      alert("no reported Cats")
    })

    await api.getAllUsers().then(async(users) => {
      for(let user of users.data){
        if(user.username != "admin"){
          await this.getUserTotalReport(user._id)
          if (this.state.totalCountTemp > 0){
            await userWithReportedCats.push({data: user, totalReport: this.state.totalCountTemp})
          }
        }
      }
      
    })

    this.setState({reportedCats: reportedCatsData,
                     suspiciousUsers: userWithReportedCats})
    this.forceUpdate();
    this.sortBoth();
    this.setState({ isLoading: false })

  }

  sortBoth = async () => {
    this.setState({
      reportedCats: sortReportedCats(this.state.reportedCats),
      suspiciousUsers: sortReportedUsers(this.state.suspiciousUsers)
    })
    this.forceUpdate();
  }
  //cat picture ok, remove from the reported list
  
  getUserTotalReport = async (userId) => {
    let totalCount = 0;
    await api.getUserById(userId).then(async(user) => {
      for(let s= 0; s < user.data.catsOwned.length; s++){
          await api.getCatByUidCid(userId, user.data.catsOwned[s]).then(async(cat) => {
            totalCount += cat.data.cat.reports
          })
      }
    })
    this.setState({totalCountTemp: totalCount}, () => {console.log(this.state.totalCountTemp)})
    this.forceUpdate()
  }


  removeCatFromReported = async (catId) => {
    for (let i = 0; i < this.state.reportedCats.length; i++) {

      if (this.state.reportedCats[i]._id == catId){
        var payload = {
          reports: 0
        }
        //console.log(catId)
        await api.updateCatByUidCid(this.props.match.params.uid, catId, payload);
        
        this.state.reportedCats.splice(i, 1);
        this.setState({
          reportedCats: this.state.reportedCats
        });
        this.forceUpdate();
        await this.sortBoth();
        await this.refresh();
        return;
      }
    }
      
    return;
  }
  // delete the user
  deleteUserPermanently = async (userId) => {
    for (let i = 0; i < this.state.suspiciousUsers.length; i++) {
      if (this.state.suspiciousUsers[i].data._id == userId){
        await api.getUserById(userId).then(async(user) => {
          for(let s= 0; s < user.data.catsOwned.length; s++){
            await this.deleteCatPermanently(userId, user.data.catsOwned[s]);
          }
        })
        await api.deleteUserById(userId);
        await this.state.suspiciousUsers.splice(i, 1);
        await this.setState({
          suspiciousUsers: this.state.suspiciousUsers
        });
        await this.sortBoth();
        this.forceUpdate();

        return;
      }
    }

    return;
  }

  //cat picture not ok, delete cat picture permantly
  deleteCatPermanently = async(userId, catId) =>{
    this.removeCatFromReported(catId);

    await api.getAllUsers().then(async(users) => {
      for(let i = 0; i< users.data.length; i++){
        let updatedLikedList = []
        for(let j = 0; j < users.data[i].catsLiked.length; j++){
          if(users.data[i].catsLiked[j] != catId){
            updatedLikedList.push(users.data[i].catsLiked[j])
          }
        }
        let payload = {
              catsLiked: updatedLikedList
        }
        await api.updateUserById(users.data[i]._id, payload)

        let updatedVotedList = []
        for(let j = 0; j < users.data[i].catsVoted.length; j++){
          if(users.data[i].catsVoted[j] != catId){
            updatedVotedList.push(users.data[i].catsVoted[j])
          }
        }
        let payload_voted = {
          catsVoted: updatedVotedList
        }
        await api.updateUserById(users.data[i]._id, payload_voted)

        let updatedOwnList = []
        for(let j = 0; j < users.data[i].catsOwned.length; j++){
          if(users.data[i].catsOwned[j] != catId){
            updatedOwnList.push(users.data[i].catsOwned[j])
          }
        }
        let payloadOwned = {
              catsOwned: updatedOwnList
        }
        await api.updateUserById(users.data[i]._id, payloadOwned)
      }
    })
    await api.deleteCatByUidCid(userId, catId).catch(e => {
       alert( "error deleting cat")
    })
    await this.sortBoth();
    await this.refresh();
    return;
  }

  render() {
    //if (username != "admin") {
    //  return <Redirect to='/' />;
    //} else
    //{
      return (
        <div classs="root">
          <Navbar username={this.props.match.params.uid} />

      <AppBar position="relative">
          <Toolbar>
            <DashboardIcon/>
            <Typography variant="h6" color="inherit" noWrap>
                &nbsp; &nbsp;Admin Dashboard
            </Typography>
          </Toolbar>
      </AppBar>
          <div className="p">
          <h1 className="dashboardTitle">Reported Cats</h1> </div>
          <div className="reportedCatsContainer">
            <GridList
              cols={4}
              cellHeight={330}
              className="cardContainer"
            >
              {this.state.reportedCats.map(cat => (
                <GridListTile className="gridRow">
                  <Card className="card">
                    <CardMedia
                      component="img"
                      className="cardMedia"
                      alt="Cat picture"
                      image={cat.photos}
                    />
                    <CardContent className="cardContent1">
                      <div class='post1'>
                        <Button gutterBottom size="small" color="primary" href={"/" + this.props.match.params.uid + "/CatProfiles/" + cat._id}>
                             {cat.name}
                        </Button>
                      </div>
                      <CardActions class='cardActions1'>
                        <IconButton title="Delete Reported Cat" aria-label="Delete cat">
                          <button type="button" title="Delete Cat" onClick={() => this.deleteCatPermanently(cat.owner, cat._id)}>
                            <DeleteForeverIcon />
                          </button>
                        </IconButton>
                        <IconButton title="Remove from Reported List" aria-label="Remove from reported">
                          <button type="button" title="Remove from Reported List" onClick={() => this.removeCatFromReported(cat._id)}>
                            <MoveToInboxIcon />
                          </button>
                        </IconButton>
                      </CardActions>
                    </CardContent>
                  </Card>
                </GridListTile>
              ))}
            </GridList>
          </div>
          <div className="p">
          <h1 className="dashboardTitle">Suspicious Users</h1></div>
          <div className="reportedCatsContainer">
            <GridList cols={4} cellHeight={370}  className="cardContainer"
            >
              {this.state.suspiciousUsers.map(user => (
                <GridListTile className="gridRow">
                  <Card className="card1">
                    <CardMedia
                      component="img"
                      className="cardMedia"
                      alt="Profile Picture"
                      image={user.data.photo}
                    />
                    <CardContent className="cardContent1">
                      <div class='post1'>
                        <Typography  gutterBottom>
                          {user.data.username}
                        </Typography>
                      </div>
                      <div class='post1'>
                      <Typography  gutterBottom>
                        Reported <span class='number'><strong>{user.totalReport}</strong></span> time(s)
                      </Typography>
                      </div>
                    </CardContent>
                    <div class='cardActions1'>
                      <CardActions>
                        <IconButton title="Delete Suspicious User" aria-label="Delete user">
                            <button type="button" title="Delete Suspicious User" onClick={() => this.deleteUserPermanently(user.data._id)}>
                              <DeleteForeverIcon />
                            </button>
                        </IconButton>
                      </CardActions>
                    </div>
                  </Card>
                </GridListTile>
              ))}
            </GridList>
          </div>
          <Footer/>
        </div>
      );
  }
}

export default Admin;