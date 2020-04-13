//index.cs for the Ranking page
import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import Album from "../../components/Album/Album"
import Footer from "../../components/Footer/Footer";
import { sortCards } from "../../actions/sortCats";
import api from '../../api/api'

import "./styles.css";

class Ranking extends React.Component {
  constructor(props) {
    super(props);
    console.log(props)
    this.state = {
      user: "",
      sorted: [],
    }
  }
  
  componentDidMount = async () => {
    var sortedArr;
    await api.getAllCats().then(async(cats) => {
        sortedArr = sortCards(cats.data)
        for(let cat of sortedArr){
          await api.getUserById(cat.owner).then(async(user) => {
              cat.owner = user.data.username
          })
        }
        this.setState({
          user: this.props.match,
          sorted: sortedArr,
        });

    });
    
  }

  render() {
    return (
      <div>
        <Navbar username={this.props.match.params.uid}/>
        <Album username={this.props.match.params.uid} sorted={this.state.sorted}/>
        <Footer/>
      </div>
	  
    );
  }
}

export default Ranking;
