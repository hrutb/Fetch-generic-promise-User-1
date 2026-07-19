
let userUrl = `https://jsonplaceholder.typicode.com/users`;


const loader = document.getElementById('loader');




const nameControl = document.getElementById('name');
const usernameControl = document.getElementById('username');
const phoneControl = document.getElementById('phone');
const emailControl = document.getElementById('email');


const addUser = document.getElementById('addUser');
const updateUser = document.getElementById('updateUser');



const userContainer= document.getElementById('userContainer');
const userForm= document.getElementById('userForm');



let userArr= [];



function snackbar(msg,icon){ 
             swal.fire({
                title:msg,
                icon:icon,
                timer:3000
             })
}


function makeApiCall(methodName,url,body=null){
     loader.classList.remove('d-none'); 
    return fetch(url,{ 
                    method:methodName,
                    headers:{ 
                           'content-type':'application/json',
                           Auth:'Get token'
                    },
                    body : body ? JSON.stringify(body): null

         })       
         .then((res)=> res.json( ))
     
}


 makeApiCall('GET',userUrl,null)
  .then((users)=>{
        userArr = users;
             createCards(userArr.reverse());
  })
  .catch((err)=>{ 
              snackbar(err,'error');
  })
  .finally(()=>{ 
       loader.classList.add('d-none');
  })



  function createCards(arr){ 
     let res = "" ;

     arr.forEach((ele,i)=> {
          res += `<tr id='${ele.id}'>
                     
                     <td>${arr.length-i}</td>
                     <td>${ele.name}</td>
                     <td>${ele.username}</td>
                     <td>${ele.email}</td>
                     <td>${ele.phone}</td>
                     <td><button onclick="onEdit(this)" class="btn btn-outline-success"><i class="fa-solid fa-pen-to-square"></i></button></td>
                     <td><button onclick="onRemove(this)" class="btn btn-outline-danger"><i class="fa-solid fa-trash"></i></button></td>
                  
                 </tr>`
     });

     userContainer.innerHTML= res;
  }


function onSubmit(eve){ 

        eve.preventDefault();
 
    let newObj = { 
            name:nameControl.ariaValueMax,
            username:usernameControl.ariaValueMax,
            name:nameControl.ariaValueMax,
            email:emailControl.ariaValueMax,
            phone:phoneControl.ariaValueMax,
          }

       userArr.push(newObj);
       
       makeApiCall('POST',userUrl,newObj)
        .then((data)=>{ 
             createSingleCard(newObj);
             snackbar('added successfully','success')
          }) 
        .catch((err)=>{
                snackbar(err,'error');
          })
        .finally(()=>{ 
             loader.classList.add('d-none');
          })
    }


function createSingleCard(newObj){ 
        let tr=document.createElement('tr');
            tr.id=newObj.id;
            tr.innerHTML = `<td>${userArr.length}</td>
                            <td>${newObj.name}</td>
                            <td>${newObj.username}</td>
                            <td>${newObj.email}</td>
                            <td>${newObj.phone}</td>
                            <td><button onclick="onEdit(this)" class="btn btn-outline-success"><i class="fa-solid fa-pen-to-square"></i></button></td>
                            <td><button onclick="onRemove(this)" class="btn btn-outline-danger"><i class="fa-solid fa-trash"></i></button></td>`
            
            userContainer.prepend(tr);
            userForm.reset();
}


function onRemove(ele){ 
          let removeId= ele.closest('tr').id; 
          let removeUrl = `${userUrl}/${removeId}`;

         makeApiCall('DELETE',removeUrl,null)
          .then(()=>{ 
            Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, delete it!"
                }).then((result) => {
                 if (result.isConfirmed){ 
                     document.getElementById(removeId).remove();
                     snackbar('delete successfully', 'success');
                }
            });  
            }).catch((err)=>{ 
              snackbar('deleted successfully','success');
            })
            .finally(()=>{ 
               loader.classList.add('d-none');
            })
}



function onEdit(ele){ 
          let editId= ele.closest('tr').id;
            localStorage.setItem('editId',editId);

          let editObj = userArr.find(ele=>ele.id == editId);
               nameControl.value= editObj.name;
               emailControl.value= editObj.email;
               phoneControl.value= editObj.phone;
               usernameControl.value= editObj.username;
              
              addUser.classList.add('d-none');
              updateUser.classList.remove('d-none');
              window.scrollTo({top:0,behavior:'smooth'});
       
           
}

function onUpdate(){ 
     let updateId= localStorage.getItem('editId');
     let updateUrl = `${userUrl}/${updateId}`;

     let updateObj = { 
                   name:nameControl.value ,
                   email:emailControl.value ,
                   phone:phoneControl.value ,
                   username:usernameControl
           }
     makeApiCall('PATCH',updateUrl,updateObj)
        
        .then(()=>{
             let tr = document.querySelector('tr');
                let card =tr.children; 
                
                card[1].innerHTML = updateObj.name;
                card[2].innerHTML = updateObj.username;
                card[3].innerHTML = updateObj.email;
                card[4].innerHTML = updateObj.contact;
                 
             addUser.classList.remove('d-none');
             updateUser.classList.add('d-none');
             userForm.reset();

             tr.scrollIntoView({block:'center',behavior:'smooth'});

             snackbar(' User updated successfully','success');
        }) 
        .catch((err)=>{ 
             snackbar(err,'error');
        })
        .finally(()=>{ 
             loader.classList.add('d-none');
        })
   
}



  userForm.addEventListener('submit',onSubmit);
  updateUser.addEventListener('click', onUpdate);