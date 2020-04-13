//index.cs for the Rating page
import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import AppBar from "@material-ui/core/AppBar";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import ReportIcon from '@material-ui/icons/Report';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import FavoriteIcon from '@material-ui/icons/Favorite';
import CakeIcon from '@material-ui/icons/Cake';
import Footer from "../../components/Footer/Footer";

import { reportUserAndCat } from "../../actions/Voting";
import { creatUpvotedUserAndCat } from "../../actions/Voting";
import { creatDownvotedUserAndCat } from "../../actions/Voting";
import api from '../../api/api'
import "./styles.css";

class Rating extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      //card: 0,
      //idx: 1,
      //isLoading: false
      card: 0,
      cardIdx: 0,
      owner: "",
      profilePic: require("../../images/add_new_cat.png"),
      isLoading: true
    }
    this.refreshPage = this.refreshPage.bind(this);

  }

  componentDidMount = async () => {

    this.setState({ isLoading: true })

    await api.getUserById(this.props.match.params.uid).then(async(user) =>{
      await api.getAllCats().then(async(cats) => {
        let catList = await cats.data.filter(cat => {
            let isTouched = 0;
            let isVoted = 0;
            for(let user of cat.dislikedUsers.concat(cat.likedUsers)){
                if(user == this.props.match.params.uid){
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
          await this.outOfCatsHandler()
          return
        }

        var i = Math.floor(Math.random() * catList.length);

        await api.getUserById(catList[i].owner).then(user => {
          let newList = catList[i];
          if (catList[i].photos.length < 1){
              newList.photos = require("../../images/add_new_cat.png");
          }
          this.setState({
            card: newList,
            cardIdx: catList[i]._id,
            owner: user.data.username,
            profilePic: user.data.photo,
            isLoading: false,
          })
          this.forceUpdate();
        })
      })
    });
    
  }

  upvote = async () => {

    var newcat;
    var newuser;
    const uid = this.props.match.params.uid;
    const cid = this.state.cardIdx;
    var newuserandcat;

    await api.getCatByUidCid(uid, cid).then(async (result) => {
      newuserandcat = creatUpvotedUserAndCat(result.data.cat, result.data.user, uid, cid)
    })
    await api.updateCatByUidCid(uid, cid, newuserandcat[0]);
    await api.updateUserById(uid, newuserandcat[1]);
    this.refreshPage()
  }


  downvote = async () => {

    var newcat;
    var newuser;
    const uid = this.props.match.params.uid;
    const cid = this.state.cardIdx;
    var returnvalue;
    await api.getCatByUidCid(uid, cid).then(async (result) => {
        returnvalue = creatDownvotedUserAndCat(result.data.cat, result.data.user, uid, cid)
    })

    await api.updateCatByUidCid(uid, cid, returnvalue[0]);
    await api.updateUserById(uid, returnvalue[1]);
    this.refreshPage()
  }


  report  = async () => {
    var newReport;
    const uid = this.props.match.params.uid;
    const cid = this.state.cardIdx;
    await api.getCatByUidCid(uid, cid).then(result => {
      newReport = reportUserAndCat(result.data.cat, result.data.user, uid, cid);
    });
    await api.updateCatByUidCid(uid, cid, newReport[0]);
    await api.updateUserById(uid, newReport[1]);
    alert("Thank you for letting us know, we will look into the issue.")
    this.refreshPage()
  }

  outOfCatsHandler = async () => {
    this.props.history.push("/" + this.props.match.params.uid + "/Rankings");
  }

  refreshPage = async () => {

    this.setState({ isLoading: true })

    var catList;
    await api.getAllCats().then(async(cats) => {
      console.log("uid: " + this.props.match.params.uid)
      await api.getUserById(this.props.match.params.uid).then( user =>{
        catList = cats.data.filter((cat) => {
          var isTouched = 0;
          console.log(user)
          for(let voted of user.data.catsVoted){
            if(voted == cat._id){
              isTouched = 1;
              return
            }
          }
          return cat
        });
      })
      console.log("after: " + catList)
      
      if(catList.length == 0){
        alert("You have voted all the cats we have.")
        this.outOfCatsHandler()
        return
      }
      var i = Math.floor(Math.random() * catList.length);

      await api.getUserById(catList[i].owner).then(user => {
        this.setState({
          card: catList[i],
          cardIdx: catList[i]._id,
          owner: user.data.username,
          isLoading: false,
        })
        this.forceUpdate();
      })
    })

  }

  maleOrFemale () {
    if (this.state.card.gender == "male"){
      return <span>&#9794</span>;
    } else {
      return <span>&#9792</span>;
    }
  }

  render() {
    let catProfileUrl = "/" + this.props.match.params.uid + "/CatProfiles/" + this.state.cardIdx;

    return (
      <div className = "background">
        <Navbar username={this.props.match.params.uid}/>
        <CssBaseline />
	      <AppBar position="relative">
	        <Toolbar>
	          <FavoriteIcon/>
	          <Typography variant="h6" color="inherit" noWrap>
	              &nbsp; &nbsp;Rate this cat!
	          </Typography>
	        </Toolbar>
	      </AppBar>
  	    <br/>
        <div className="post">
          <Card>
            <AppBar position="relative" className="cardBanner" >
	        <Toolbar >
            <Avatar src={this.state.profilePic} />
	          <Typography color="initial" noWrap>
	              &nbsp; {this.state.owner} 
              </Typography>
              </Toolbar>
      	    </AppBar>
            <CardMedia
              component="img"
              alt="Cat picture"
              image={this.state.card.photos}
            />
            <CardContent>
              <Typography variant="h5" component="h2">
                <a href={catProfileUrl}>{this.state.card.name}</a> 
                <maleOrFemale />
              </Typography>
              <CakeIcon />
              <Typography  variant="overline"  color="initial"  className='text-align'>
                {this.state.card.birthday}
              </Typography>
              <div className='bio'>
                <Typography variant="body2" color="textSecondary" >
                  {this.state.card.bio}
                </Typography>
              </div>
            </CardContent>
            <CardActions style={actionStyle}>
              <IconButton title='like' onClick={ this.upvote }>
                	<ThumbUpIcon />
              </IconButton>
              <IconButton title="dislike" onClick={ this.downvote}>
                	<ThumbDownIcon />
              </IconButton>
              <IconButton title="report" onClick={ this.report }>
                	<ReportIcon />
              </IconButton>
            </CardActions>
          </Card>
        </div>
        <Footer/>
      </div>
    );
  }
}


const actionStyle = {
  padding: '0px',
};


export default Rating;
