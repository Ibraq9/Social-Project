let addpost = document.getElementById("addPost");
let personal_account_img = document.getElementById("personal-account-img");
let username_account = document.getElementById("username-account");
let add_edit_post_btn = document.getElementById("add-edit-post-btn")

// user log in info
let token = localStorage.getItem("Token");
let user = JSON.parse(localStorage.getItem("User"));



function SetupUI() {

  let login_register_div = document.getElementById("login-register-div");
  let logout_div = document.getElementById("logout-div");
  let personal_data = document.getElementById("personal-data");

  if (token === null) {
    login_register_div.style.display = "flex";
    login_register_div.style.justifyContent = "end";
    logout_div.style.display = "none";
    personal_data.style.display = "none";

    if (addpost != null) {
      addpost.style.display = "none";
    }

  } else {
    login_register_div.style.display = "none";
    logout_div.style.display = "flex";
    logout_div.style.justifyContent = "end";
    personal_data.style.display = "block";
    personal_account_img.src = user.profile_image;
    username_account.innerHTML = user.username;

    if (addpost != null) {
      addpost.style.display = "block";
    }

  }
}






function Register_clicked() {

  let Name = document.getElementById("Register-name").value;
  let username = document.getElementById("Register-username").value;
  let password = document.getElementById("Register-password").value;
  let Register_Image = document.getElementById("Register-Image").files[0];


  let formdata = new FormData();
  formdata.append("name", Name);
  formdata.append("username", username);
  formdata.append("password", password);

  if (Register_Image) {
    formdata.append("image", Register_Image);
  }

  toggleLoader(true);

  axios.post("https://tarmeezacademy.com/api/v1/register", formdata)
    .then((response) => {
      username_account.innerHTML = username;
      personal_account_img.src = response.data.user.profile_image;
      localStorage.setItem("Token", response.data.token);
      localStorage.setItem("User", JSON.stringify(response.data.user));
      close_model("exampleModal2");
      SetupUI();
      ShowAlert("you Registerd successfully", 'success');
      toggleLoader(false)
      setTimeout(() => {
        window, location.reload(true)
      }, 1000);
    })
    .catch((error) => {
      ShowAlert(`${error.response.data.message}`, 'danger');
      toggleLoader(false)
    });

}





function login_clicked() {
  let login_username = document.getElementById("login-username").value;
  let login_password = document.getElementById("login-password").value;


  toggleLoader(true);
  axios.post("https://tarmeezacademy.com/api/v1/login", {
    "username": `${login_username}`,
    "password": `${login_password}`,
  })
    .then((response) => {
      
      username_account.innerHTML = login_username;
      personal_account_img.src = response.data.user.profile_image;
      localStorage.setItem("Token", response.data.token);
      localStorage.setItem("User", JSON.stringify(response.data.user));
      SetupUI();
      close_model("exampleModal");
      ShowAlert('you login Successfully', 'success');
      toggleLoader(false)
      setTimeout(() => {
        window.location.reload(true)
      }, 1000);
    })
    .catch((error) => {
      ShowAlert(error.response.data.message, 'danger');
      toggleLoader(false)
    });
}






function close_model(id) {
  let modal = document.getElementById(id);
  let modalInstance = bootstrap.Modal.getInstance(modal);
  modalInstance.hide();
}







function logout_clicked() {
  let urlparms = new URLSearchParams(window.location.search);
  let id = urlparms.get("userID");
  let user = getCurrentUser();

  if (+id === user.id) {
    setTimeout(() => {
      go_to_homePage();
    }, 1000);
  } else {
    setTimeout(() => {
      window.location = window.location
    }, 1000);
  }
  localStorage.clear();
  SetupUI();
  ShowAlert('logged out Successfully', 'success');
}









function ShowAlert(customMessage, tyype, duration = 3000) {
  let alertPlaceholder = document.getElementById("liveAlertPlaceholder");

  const appendAlert = (message, type) => {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = [
      `<div class="alert alert-${type} alert-dismissible" role="alert">`,
      `   <div>${message}</div>`,
      '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
      "</div>",
    ].join("");

    alertPlaceholder.append(wrapper);

    // Apply general styles for the alert
    alertPlaceholder.style.zIndex = "9";
    alertPlaceholder.style.position = "fixed";
    alertPlaceholder.style.bottom = "5%";
    alertPlaceholder.style.right = "3%";

    // Set responsive styles
    alertPlaceholder.style.width = "20%"; // Default width
    alertPlaceholder.style.minWidth = "250px"; // Minimum width for smaller screens
    alertPlaceholder.style.maxWidth = "90%"; // Maximum width for larger screens

    // Adjust position and width for mobile screens
    if (window.innerWidth <= 768) {
      alertPlaceholder.style.width = "80%"; // Wider alert for smaller screens
      alertPlaceholder.style.right = "10%"; // More centered on small screens
    }

    setTimeout(() => {
      const alertElement = wrapper.querySelector(".alert");
      if (alertElement) {
        alertElement.classList.remove("show"); // Remove 'show' class
        alertElement.classList.add("fade"); // Add 'fade' class for transition
        setTimeout(() => {
          alertPlaceholder.removeChild(wrapper); // Remove alert from DOM
        }, 150); // Wait for fade-out transition before removing
      }
    }, duration);
  };

  appendAlert(customMessage, tyype);
}






function create_new_post() {

  let Title_Post = document.getElementById("Title-Post").value;
  let Image_Post = document.getElementById("Image-Post").files[0];
  let Body_Post = document.getElementById("Body-Post").value;
  let input_id = document.getElementById("input-check").value; // This holds the post ID when editing

  let formdata = new FormData();
  formdata.append("title", Title_Post);
  formdata.append("body", Body_Post);
  if (Image_Post) {
    formdata.append("image", Image_Post);
  }

  let header = {
    "Authorization": `Bearer ${token}`
  };

  let url;
  let method;

  if (input_id === "") {
    // Create a new post
    url = `https://tarmeezacademy.com/api/v1/posts`;
    method = "POST";
  } else {
    // Edit existing post
    url = `https://tarmeezacademy.com/api/v1/posts/${input_id}`;
    formdata.append("_method", "put"); // Required for Laravel APIs
    method = "PUT";
  }

  toggleLoader(true);
  axios.post(url, formdata, { headers: header })
    .then((response) => {
      close_model("add-post-modal");
      ShowAlert(input_id === "" ? "Post Created successfully" : "Post Edited successfully", 'success');
      console.log(response)

      setTimeout(() => {
        window.location.reload(true);
      }, 1000);

      toggleLoader(false);
    })
    .catch((error) => {
      ShowAlert(error.response.data.message, 'danger');
      toggleLoader(false);
    });
}








function getCurrentUser() {
  let user = null;
  let storageUser = JSON.parse(localStorage.getItem("User"));
  if (storageUser !== null) {
    user = storageUser;
  }

  return user;
}





let yes_delete_btn = document.getElementById("yes-delete-btn")
let No_delete_btn = document.getElementById("No-delete-btn")

function confirm_delete_alert(authotid, postid) {

  yes_delete_btn.onclick = () => {
    delete_Post(authotid, postid);
  }

  No_delete_btn.onclick = () => {
    close_model("delete-post-modal")
  }

}




function delete_Post(authorID, postID) {

  let error1 = "";
  let user = getCurrentUser();

  toggleLoader(true);
  if (user.id === authorID) {
    axios.delete(`https://tarmeezacademy.com/api/v1/posts/${postID}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
      .then((response) => {
        setTimeout(() => {
          window.location.reload(true);
        }, 1000);
        ShowAlert("Post Deleted Successfully", "success");
        close_model("delete-post-modal")
        toggleLoader(false);
      }).catch((error) => {
        error1 = error.response.data.message;
      })
  } else {
    ShowAlert(error1.response.data.message, "danger");
    toggleLoader(false);
  }
}






function edit_post_clicked(postObject) {
  let post = JSON.parse(decodeURIComponent(postObject));

  document.getElementById("input-check").value = post.id; // Set post ID to indicate edit mode

  document.getElementById("add-post-title").innerHTML = "Edit Post";
  add_edit_post_btn.innerHTML = "Edit"; // Change button text to 'Edit'

  let postmodal = new bootstrap.Modal(document.getElementById("add-post-modal"));
  postmodal.toggle();

  document.getElementById("Title-Post").value = post.title;
  document.getElementById("Body-Post").value = post.body;
}




function Post_Details_clicked(PostObject) {
  let post = JSON.parse(decodeURIComponent(PostObject));
  window.location = `../PostDetails_Comment/PostDetails.html?postID=${post.id}`;
}




function get_user_info(PostObject) {
  let post = JSON.parse(decodeURIComponent(PostObject));
  window.location = `../ProfileUserDetails/myProfile.html?userID=${post.author.id}`;
}



function profile_clicked() {
  let currentUser = getCurrentUser();

  if (currentUser !== null) {
    window.location = `../ProfileUserDetails/myProfile.html?userID=${currentUser.id}`;
  } else {
    ShowAlert("log in first", "danger");
  }
}


function go_to_homePage() {
  window.location = "../HomePostsPage/index.html";
}



function toggleLoader(show) {
  let Loader_container = document.getElementById("Loader-container");
  if (show) {
    Loader_container.style.visibility = "visible";
  } else {
    Loader_container.style.visibility = "hidden";
  }
}




SetupUI();




