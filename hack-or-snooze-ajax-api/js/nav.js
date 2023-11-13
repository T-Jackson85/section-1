"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

function submitStoriesClick(evt) {
  console.debug("submitStoriesClick", evt);
  hidePageComponents();
  $allStoriesList.show();
  $submitForm.show();

}
$navAddStories.on("click", submitStoriesClick);

function navFavorites(evt) {
  console.debug("navFavorites", evt);
  hidePageComponents();
  addFavoritesToPage();
}
$body.on("click", "#nav-favorites", navFavorites);

function navMyStories(evt) {
  console.debug("navMyStories", evt);
  hidePageComponents();
  putStoriesOnPage();
  $ownStories.show();
}
$body.on("click", "#nav-my-stories", navMyStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}
