// Methods in this file modifies the Queue component state

const log = console.log;

export const creatUpvotedUserAndCat = (oldcat, olduser, uid, cid) => { 
    
    var newcat;
    var newuser;

    var newUserLiked = oldcat.likedUsers
    newUserLiked.push(uid)
    var newCatVoted = olduser.catsVoted
    var newCatLiked = olduser.catsLiked
    newCatLiked.push(cid)
    newCatVoted.push(cid)
    newcat = {
      likedUsers: newUserLiked,
      likes: oldcat.likes + 1
    }
    newuser = {
      catsLiked: newCatLiked,
      catsVoted: newCatVoted
    }
    const returnvalue = [newcat, newuser]
    return returnvalue
};

export const creatDownvotedUserAndCat = (oldcat, olduser, uid, cid) => { 
    var newcat;
    var newuser;

    var newUserDisliked = oldcat.dislikedUsers
    newUserDisliked.push(uid)

    var newCatVoted = olduser.catsVoted
    newCatVoted.push(cid)
    newcat = {
      dislikedUsers: newUserDisliked,
      dislikes: oldcat.dislikes + 1
    }
    newuser = {
      catsVoted: newCatVoted
    }
    const returnvalue = [newcat, newuser]
    return returnvalue
};

export const reportUserAndCat = (oldcat, olduser, uid, cid) => { 
    var newcat
    var newuser
    var newReport= oldcat.reports;

    var newCatVoted = olduser.catsVoted
    newCatVoted.push(cid)

    newReport += 1;
    newcat = {
      reports: newReport
    }
    newuser = {
      catsVoted: newCatVoted
    }
    const returnvalue = [newcat, newuser]
    return returnvalue
};