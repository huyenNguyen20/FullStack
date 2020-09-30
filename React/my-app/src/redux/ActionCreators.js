import * as ActionTypes from "./ActionTypes";
import { baseUrl } from '../shared/baseUrl';

export const addComment = (dishId, rating, author, comment) => ({
    type: ActionTypes.ADD_COMMENT,
    payload: {
        dishId: dishId,
        rating: rating,
        author: author,
        comment: comment
    }
})

export const fetchDishes = () => dispatch => {
    dispatch(dishesLoading(true));

    return fetch (baseUrl + "dishes")
    .then(response => {
        if (response.ok) {
          return response;
        } else {
          var error = new Error('Error ' + response.status + ': ' + response.statusText);
          error.response = response;
          throw error;
        }
      },
      error => {
            var errmess = new Error(error.message);
            throw errmess;
      })
    .then(response => response.json())
    .then(dishes =>  dispatch(addDishes(dishes)))
    .catch(error => dispatch(dishesFailed(error.message)));
}

export const fetchComments = () => (dispatch) => {    
    return fetch(baseUrl + 'comments')
    .then(response => {
        if (response.ok) {
          return response;
        } else {
          var error = new Error('Error ' + response.status + ': ' + response.statusText);
          error.response = response;
          throw error;
        }
      },
      error => {
            var errmess = new Error(error.message);
            throw errmess;
      })
    .then(response => response.json())
    .then(comments => dispatch(addComments(comments)))
    .catch(error => dispatch(commentsFailed(error.message)));
};

export const fetchPromos = () => dispatch => {
    dispatch(promosLoading());

    return fetch (baseUrl + "promotions")
    .then(response => {
        if (response.ok) {
          return response;
        } else {
          var error = new Error('Error ' + response.status + ': ' + response.statusText);
          error.response = response;
          throw error;
        }
      },
      error => {
            var errmess = new Error(error.message);
            throw errmess;
      })
    .then(response => response.json())
    .then(promos =>  dispatch(addPromos(promos)))
    .catch(error => dispatch(promosFailed(error.message)));
}

export const postComment = (dishId, rating, author, comment) => (dispatch) => {

  const newComment = {
      dishId: dishId,
      rating: rating,
      author: author,
      comment: comment
  };
  newComment.date = new Date().toISOString();
  
  return fetch(baseUrl + 'comments', {
      method: "POST",
      body: JSON.stringify(newComment),
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "same-origin"
  })
  .then(response => {
      if (response.ok) {
        return response;
      } else {
        var error = new Error('Error ' + response.status + ': ' + response.statusText);
        error.response = response;
        throw error;
      }
    },
    error => {
          throw error;
    })
  .then(response => response.json())
  .then(response => dispatch(addIndividualComment(response)))
  .catch(error =>  { console.log('post comments', error.message); alert('Your comment could not be posted\nError: '+error.message); });
};

export const dishesLoading = () => ({
    type: ActionTypes.DISHES_LOADING
})

export const promosLoading = () => ({
    type: ActionTypes.DISHES_LOADING
})

export const dishesFailed = errmess => ({
    type: ActionTypes.DISHES_FAILED,
    payload: errmess
})

export const promosFailed = errmess => ({
    type: ActionTypes.PROMOS_FAILED,
    payload: errmess
})

export const commentsFailed = errmess => ({
    type: ActionTypes.COMMENTS_FAILED,
    payload: errmess
})

export const addDishes = dishes => ({
    type: ActionTypes.ADD_DISHES,
    payload: dishes
});

export const addComments = comments => ({
    type: ActionTypes.ADD_COMMENTS,
    payload: comments
});

export const addIndividualComment = comment => ({
  type: ActionTypes.ADD_COMMENT,
  payload: comment
});

export const addPromos = (promos) => ({
    type: ActionTypes.ADD_PROMOS,
    payload: promos
});

export const fetchLeaders = () => (dispatch) => {
  dispatch(leadersLoading());
  return fetch(baseUrl + "leaders")
  .then(response => {
    if(response.ok){
      return response;
    } else {
      var err = new Error("Error: " +  response.status + " with " + response.statusText);
      err.response = response;
      throw err;
    }
  }, errMess => {
    var errMess = new Error(errMess.message);
    throw errMess;
  })
  .then(response => response.json() )
  .then(leaders => {
    dispatch(addLeaders(leaders));
  })
  .catch(error => dispatch(leadersFailed(error.message)));
}

export const leadersLoading = () => ({
  type: ActionTypes.LEADERS_LOADING
})

export const leadersFailed = (errMess) => ({
  type: ActionTypes.LEADERS_FAILED,
  payload: errMess
})

export const addLeaders = (leaders) => ({
  type: ActionTypes.ADD_LEADERS,
  payload: leaders
})

export const postFeedback = (firstname, lastname, 
  telnum, email, agree, 
  contactType, message) => (dispatch) => {
    const newFeedback = {
      firstname: firstname, 
      lastname: lastname, 
      telnum: telnum, 
      email: email, 
      agree: agree, 
      contactType: contactType,
      message: message
    };
    newFeedback.date = new Date().toISOString();
    return fetch(baseUrl + "feedback", {
      method: "POST",
      body: JSON.stringify(newFeedback),
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "same-origin"
    })
    .then(response => {
      if(response.ok) {
        return response;
      } else {
        var err = new Error(`Error: ${response.status} with ${response.statusText}`);
        err.response = response;
        throw err;
      }
    }, err => {
      var err = new Error(err.message);
      throw err ;
    })
    .then(response => response.json())
    .then(feedback => dispatch(addFeedback(feedback)))
    .catch(error => {
      console.log(error.message);
      alert("Your feedback couldn't posted \n Error: " + error.message);
    }) 
}

export const addFeedback = (feedback) => ({
  type: ActionTypes.ADD_FEEDBACK,
  payload: feedback
})

export const fetchFeedbacks = () => (dispatch) => {    
  return fetch(baseUrl + 'feedback')
  .then(response => {
      if (response.ok) {
        return response;
      } else {
        var error = new Error('Error ' + response.status + ': ' + response.statusText);
        error.response = response;
        throw error;
      }
    },
    error => {
          var errmess = new Error(error.message);
          throw errmess;
    })
  .then(response => response.json())
  .then(feedbacks => dispatch(addFeedbacks(feedbacks)))
  .catch(error => console.log(error.message));
};

export const addFeedbacks = (feedbacks) => ({
  type: ActionTypes.ADD_FEEDBACKS,
  payload: feedbacks
})