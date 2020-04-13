Authors:

	  esizzle69
	  AndrewLapin95      
	  ngalan818
	  jac09/jachsu
	  
## Usage Guidelines
This is a MERN based application, so the procedure to start it up is to :

If run locally:

      cd team14/cat-rating
      npm install                         - to install all the dependencies
      cd client
      npm install
      npm run build                       - to install all the dependecies at frontend
      cd ../
      mkdir mongo-data
      mongod --dbpath mongo-data          - to run the mongodb server
      node server.js                      - to run the full stack
      The Backend server will be available on localhost:5000
      The application will be available on localhost:3000

Deployed Heroku Link:
      
      http://cat-rating.herokuapp.com/

To deploy on a new Heroku repo:

      - register an Heroku account
      - add mLab MongoDB as the database
      - in Settings/Congif Vars set following enviromental variables:
      
	    API_KEY		"API key from a cloud source. e.g. Cloudinary"
	    API_SECRET		"API Secret provided by your cloud"
	    CLOUD_NAME		"Provded by your cloud"
	    MONGODB_URI 	"Should be automatically there if you've already
				 created an mLab MongoDB on your heroku repo"
      
Backend routes:

      app.post('/user'):                  To create a new user. 
                                          minimum expected request: {username:, password} 
                                          result structure: {userinfo}
                                          
      app.get('/user'):                   To get all the users in database.
                                          result structure: [{userinfo}]
                                          
      app.get('/user/:id'):               To get an user based on user id in database.
                                          result structure: {userinfo}
                                          
      app.delete('/user/:id'):            To delete an user based on user id.
                                          result structure: {userinfo}
                                          
      app.patch('/user/:id'):             To update an user info.
                                          minimum exprected request: at least one of the keys
                                                                     from UserSchema
                                          result structure: {userinfo}
                                          
      app.post('/cat/:userid'):           To create a new cat. 
                                          minimum expected request: at least one of the keys
                                                                    from CatSchema
                                          result structure: {
                                                               user:{userinfo with userid}, 
                                                               cat: {catinfo}
                                                            }
                                                            
      app.get('/cat'):                    To get all the cats in database.
                                          result structure: [{catinfo}]
                                          
      app.get('/cat/:userid'):            To get all cats belongs to a user with userid
                                          result structure: [{catinfo}]
                                                           
                                                            
      app.get('/cat/:userid/:catid'):     To get a cat based on catid. NOTE: userid doesn't have to be
                                          the owner of the cat. This is convenient for tracking the
                                          current user.
                                          result structure: {
                                                               user:{userinfo with userid}, 
                                                               cat: {catinfo}
                                                            }
                                                            
      app.delete('/cat/:userid/:catid'):  To delete a cat based on catid. NOTE: userid doesn't have 
                                          to be the owner of the cat. This is convinient for tracking
                                          the current user.
                                          result structure: {
                                                               user:{userinfo with userid}, 
                                                               cat: {catinfo}
                                                            }
                                                            
      app.patch('/cat/:userid/:catid'):   To update a cat based on catid and a payload. NOTE: userid 
                                          doesn't have to bethe owner of the cat. This is convinient 
                                          for tracking the current user.
                                          minimum expected request: at least one of the keys
                                                                    from CatSchema
                                          result structure: {
                                                               user:{userinfo with userid}, 
                                                               cat: {catinfo}
                                                            }
                                                            
The frontend web app consists of 6 pages:
      
1. /{admin_user_id}/Admin:

      Admin dashboard only available to the admin user that allows to permanently delete suspicious
      users(users with cat(s) reported), reported cats, as well as to verify that the reported users
      are not guilty of posting any inappropriate images.  
        
            a. Reported cats: Contains all cats that has been reported at least once. Admin can click to 
               check the detailed info for each cat, remove the cat from the server permanently or remove 
               the cat from reported list.
                  i.    If a cat is permanently removed from server, then all the users who liked this cat will 
                        have it removed from it's liked list.
                  ii.   If a cat is only removed from the reported list, then it's report value will be set to 0.  
            b. Users with reported cats: Contains all users with their cats reported by at least once. Admin can 
               look at the number of report a user has in total(from all cats) and decide if the user is deletable
               If a user is removed from the server, all of his/her cats will be removed, both from the server and 
               from the liked lists of the users who liked them.
                  
2. /        

      login webpage.
      
             a. No restrictions on password and username(except both have to be longer than one character)
             b. If the username doesn't exist/password doesn't match an alert will pop up
             c. Register button is available for account registation(another page)
             
3. /Register 
            
      Registration webpage. 
      
             a. An alert will pop up if user left any of the fields as blank
             b. No checking with username in the database, multiple users can have a same username
             c. After a successful registration an alert will pop up, then the user will be tranfered
                to the user profile page

4. /{user_id}/Rating 

      The webpage that allows to like/dislike/report pictures of cats registered on the website.
      
              a. Here each cat is represented in a card with all of its info
              b. Users can upvote, downvote or report a cat. if a cat is upvoted, it will go into
                 the users liked cat list which can be viewed in the user profile page. if a cat is
                 either upvoted, downvoted or reported, the user will never see this cat ever again.
            
5. /{user_id}/Rankings: 

      the webpage that lists 10 highest-ranked cats on the website.
            
           a. A user can view each cat profile by clicking "view". 
           b. If the cat belongs to the current user, the user can modify the profile after 
              they click "view"


6. /{user_id}/CatProfiles/{cat_id} 
      A profile that lists detailed information about a cat. Also allows the owner of the cat to 
      modify information about their cat. User is unable to edit for cats that current user 
      doesn't own 

             a. If {cat_id} isn't owned by {user_id}, then the user with {user_id}(normally will 
                be the current user)
             b. can't modify any info on that page. Likewise user with {user_id} can only modify cat 
                profile page
             c. with {cat_id} being it's own cat.

7. /{user_id}/Profile/{user_param} 

      The dashboard that allows to update information for a registered user. Depending on the 
      old_new_user_param, the webpage can be either used for registering a new user or updating 
      information of the already existing user.
      
            a. Detailed user info, can be modified and saved. A user can modify any specific field
               and save it. If the new input is same as the info before, an alert will pop up saying
               info wasn't saved since nothing has changed.
            b. A list of owned cats, can be removed. Once removed, all the users who liked the cat
               will have it removed from their liked list. Click the cat icon to modify cat profile.
            c. A list of liked cats, can be removed from the list once clicked downvote.

## Citations

For this assignment we copied and modified several pieces of code provided by the https://material-ui.com/

The model for Images as well as API for getting/adding/deleting images was taken from the example brovided by the instructors: https://github.com/csc309-winter-2020/cloudinary-mongoose-react
