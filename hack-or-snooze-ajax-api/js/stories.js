"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}



/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story, showDeleteBtn = false) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();

  const showStar = Boolean(currentUser);
  return $(`
      <li id="${story.storyId}">
      ${showDeleteBtn ? getDeleteBtnHTML(): ""}
      ${showStar ? getStarHTML(story, currentUser): ""}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);

}


function getDeleteBtnHTML() {
  return `
  <span class="trash">
  <i class= "fas fa-trash-alt"></i>
  </span>`;
}

function getStarHTML(story, user) {
  const isFavorite = user.isFavorite(story);
  const starType = isFavorite ? "fas" : "far";

  return `
  <span class="star">
  <i class="${starType} fa-star"></i>
  </span>`
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}
async function deleteStories(){
  console.debug("deleteStories");

  const $closestLi = $(evt.target).closest("li");
  const storyId = $closestLi.attr("id");

  await storyList.removeStory(currentUser, storyId);

  pushUserStoriesOnPage();

}
$ownStories.on("click", ".trash", deleteStories);
  
  async function uploadNewStory(evt){
    console.debug("uploadNewStory");
    evt.preventDefault();
    
    const url = $("#create-url").val();
    const author = $("#create-author").val();
    const title = $("#create-title").val();
    const username = currentUser.username
    
    const storyResults = {title, url, author, username };
  
    const story = await storyList.addStory(currentUser, storyResults);
  
    const $story = generateStoryMarkup(story);
    $allStoriesList.prepend($story);
  
    $submitForm.slideup("slow");
    $submitForm.trigger("reset");
  }
  $submitForm.on("submit", uploadNewStory);

  function addUserStoriesToPage () {
    console.debug("addUserStoriesToPage");

    $ownStories.empty();

    if(currentUser.ownStories.length === 0){
      $ownStories.append("<h5>No stories</h5>");
    } else {
      for(let story of currentUser.ownStories) {
        let $story = generateStoryMarkup(story, true);
        $ownStories.append($story);
      }
    }
    $ownStories.show();
  }

  function addFavoritesToPage() {
    console.debug("addFavoritesToPage");

    $favorites.empty();

    if(currentUser.favorites.length === 0) {
      $favorites.append("<h5>No Favorites</h5>");
    }else {
      for(let story of currentUser.favorites) {
        const $story = generateStoryMarkup(story);
        $favorites.append($story);
      }
    }
    $favorites.show();
  }

  async function switchStoryFavorites(evt) {
    console.debug("switchStoryFavorites");

    const $fav = $(evt.target);
    const $closestLi = $fav.closest("li");
    const storyId = $closestLi.attr("id");
    const story = storyList.stories.find(s => s.storyId === storyId);

    if($fav.hasClass("fas")) {
      await currentUser.deleteFavoriteStory(story);
      $fav.closest("i").toggleClass("fas far");

    } else {
      await currentUser.addToFavorite(story);
      $fav.closest("i").toggleClass("fas far");
    }
}
$storyList.on("click", ".star", switchStoryFavorites);




