<template>
  <div class="container">
       <div class="row ">
          <div class="col-md-12">
            <div class="card mt-5">
              <div class="card-header">
                <h3 class="card-title">Users table</h3>

                <div class="card-tools">
                  <button class="btn btn-success" @click="newModal">
                    Add new
                    <i class="fas fa-user-plus">

                    </i>
                  </button>
                        </div>
                  </div>
                
              <!-- /.card-header -->
              <div class="card-body table-responsive p-0">
                <table class="table table-hover">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Type</th>
                      <th>Registered At</th>
                      <th>Modify</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="user in users" :key="user.id">
                      <td>{{user.id}}</td>
                      <td>{{user.name| upText}}</td>
                      <td>{{user.email}}</td>
                      <td>{{user.type | upText}}</td>
                      <td>{{user.created_at| myDate}}</td>
                      <td>
                        <a href="#" @click="editModal(user)">
                          <i class="fa fa-edit">
                          </i>
                        </a>
                        <a href="#" class="ml-1" @click="DeleteUser(user.id)">
                          <i class="fa fa-trash" style="color:red;">
                          </i>
                        </a>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <!-- /.card-body -->
            </div>
            <!-- /.card -->
          </div>
        </div>
                  <!-- Modal -->
          <div class="modal fade" id="addNew" tabindex="-1" role="dialog" aria-labelledby="addNewLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 v-show="!editmode" class="modal-title" id="addNewLabel">Add New</h5>
                  <h5 v-show="editmode" class="modal-title" id="addNewLabel">Edit</h5>
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <form @submit.prevent="editmode ? updateUser() : CreateUser()" >
                <div class="modal-body">
                  <div class="form-group">
                    <input v-model="form.name" type="text" name="name"
                    placeholder="name"
                    class="form-control" :class="{ 'is-invalid': form.errors.has('name') }">
                    <has-error :form="form" field="name"></has-error>
                  </div>
                  
                  <div class="form-group">
                    <input v-model="form.email" type="email" name="email"
                    placeholder="Email Address"
                    class="form-control" :class="{ 'is-invalid': form.errors.has('email')}">
                    <has-error :form="form" field="email"></has-error>
                  </div>

                  <div class="form-group">
                    <textarea v-model="form.bio" id="bio" name="bio"
                    placeholder="bio for user(optional)"
                    class="form-control" :class="{ 'is-invalid': form.errors.has('bio')}"></textarea>
                    <has-error :form="form" field="bio"></has-error>
                  </div>

                  <div class="form-group">
                    <select v-model="form.type" id="type" name="type"
                    placeholder="type for user(optional)"
                    class="form-control" :class="{ 'is-invalid': form.errors.has('type')}">
                    <option value="" disabled >Select User role</option>
                    <option value="admin">admin</option>
                    <option value="user">Standar user</option>
                    <option value="author">Author</option>
                    </select>
                    <has-error :form="form" field="type"></has-error>
                  </div>

                    <div class="form-group">
                    <input v-model="form.password" type="password" name="password" id="password"
                    placeholder="password"
                    class="form-control" :class="{ 'is-invalid': form.errors.has('password')}">
                    <has-error :form="form" field="password"></has-error>
                  </div>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
                  <button v-show="editmode" type="submit" class="btn btn-success">Update</button>
                  <button v-show="!editmode" type="submit" class="btn btn-primary">Create</button>
                </div>
                </form>
              </div>
            </div>
          </div>
  </div>
</template>

<script>
    export default {
      data(){
        return{
          editmode:false,
          users:{},
          form: new Form({
            id:'',
            name:'',
            email:'',
            password:'',
            type:'',
            bio:'',
            photo:''
          })
        }
      },
      methods: {
        updateUser()
        {
         this.$Progress.start();
          this.form.put('api/user/'+this.form.id).then(()=>{
            
                      $('#addNew').modal('hide');
                      toast.fire({
                        type: 'success',
                        title: 'Your information has been updated'
                      })  
              this.$Progress.finish();
              Fire.$emit('AfterCreate');
  

          }).catch(()=>{
                      this.$Progress.fail();

          });
        },
        newModal(){
          this.editmode= false;
          this.form.reset();
          $('#addNew').modal('show');
        },
        editModal(user){
          this.editmode= true;
        this.form.reset();
        $('#addNew').modal('show');
        this.form.fill(user);
        },
        loadUsers(){ 
          axios.get("api/user").then(({data})=>(this.users=data.data));
        },
        DeleteUser(id){
          swal.fire({
                    title: 'Are you sure?',
                    text: "You won't be able to revert this!",
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes, delete it!'
                  }).then((result) => {

                    //Send request to the server
                    if(result.value){
                    this.form.delete('api/user/'+id).then(()=>{
                      swal.fire(
                        'Deleted!',
                        'Your file has been deleted.',
                        'success'
                      )
                      Fire.$emit('AfterCreate');

                      }).catch(()=>{
                        swal.fire("Failed","There was something wronge.",
                        "warning");
                      });
                    }
                  })
                     
                      
        },
        CreateUser(){
          this.$Progress.start();
          this.form.post('api/user')
          .then(()=>{
            
                      Fire.$emit('AfterCreate');
                      $('#addNew').modal('hide');
                      toast.fire({
                        type: 'success',
                        title: 'User created in successfully'
                      })         
                      this.$Progress.finish();

          })
          .catch(()=>{
            
          })

        }
      },
        created() {
            this.loadUsers();
            Fire.$on('AfterCreate',()=>{
              this.loadUsers();
            });
            // setInterval(()=>this.loadUsers(),3000)
        }
    }
</script>
