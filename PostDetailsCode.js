let h1_Details=document.getElementById("h1-Details");
let username_Details=document.getElementById("username-Details");
let created_at_Details=document.getElementById("created-at-Details");
let title_post_Details=document.getElementById("title-post-Details");
let post_body_Details=document.getElementById("post-body-Details");
let comments_count=document.getElementById("comments-count");
let post_Image=document.getElementById("post-Image");
let profile_image=document.getElementById("profile-Image");
let comments=document.getElementById("comments");
 let Add_comment=document.getElementById("Add-comment");


function get_url_parms(){
let urlparms=new URLSearchParams(window.location.search);
let id=urlparms.get("postID");
return id;
}



function Create_post_Details_Request(){
  let ID=get_url_parms();
  axios.get(`https://tarmeezacademy.com/api/v1/posts/${ID}`)
  .then((response)=>{
   let info=response.data.data;
   h1_Details.innerHTML=`${info.author.username} Post`;
   username_Details.innerHTML=info.author.username;
   created_at_Details.innerHTML=info.created_at;
   title_post_Details.innerHTML=info.title;
   post_body_Details.innerHTML=info.body;
   comments_count.innerHTML=info.comments_count;
   post_Image.src=info.image;
   profile_image.src=info.author.profile_image;
   
   for(let comment of info.comments){
   let commentContent=`
   <div class="my-3">
    <img src="${comment.author.profile_image}" style="width:40px; height:40px; border-radius: 50%;"/>
    <span>${comment.author.username}</span>
    <p>${comment.body}</p>
    <hr/>
  </div>
   `;

   comments.innerHTML+=commentContent;
   }
  })

}





function add_comment_clicked(){
  let user=JSON.parse(localStorage.getItem("User"));

  let token=localStorage.getItem("Token");
  let comment=document.getElementById("inputCmmentcontent").value;
  let id=get_url_parms();
  toggleLoader(true);
  axios.post(`https://tarmeezacademy.com/api/v1/posts/${id}/comments`,
  {
    "body":`${comment}`
  }
  ,
  {
    headers:{
      "Authorization":`Bearer ${token}`
    }
  }).then((response)=>{
    window.location.reload(true);
    ShowAlert('Comment Added','success');
    toggleLoader(false)
  }).catch((err)=>{
    ShowAlert(`${err.response.data.message}`,'danger')
    toggleLoader(false)
  })

}



Create_post_Details_Request();