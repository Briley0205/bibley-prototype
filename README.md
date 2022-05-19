# Newtube Reloaded

/
/join
/login
/search

/users/:id -> See User
/users/logout
/users/edit -> Edit my profile
/users/delete

/videos/:id(id of video) -> Watch Video
/videos/:id/edit
/videos/:id/delete
/videos/upload

/videos/comments
/videos/comments/delete

else {
const user = await User.create({
name: userData.name,
username: userData.login,
email: emailObj.email,
password: '',
socialOnly: true,
location: userData.location,
});
req.session.loggedIn = true;
console.log(req.session.user);
req.session.loggedInUser = user;
return res.redirect("/");
