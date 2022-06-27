import React, { Component } from 'react';
import './App.css';
import axios from 'axios';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      members: [],
      first_name:'',
      last_name:'',
      buttonDisable:false,
      formStatus: "create",
      memberIdSelected: null
    };
  }

  componentDidMount() {
    axios.get("https://reqres.in/api/users?page=1")
    .then( response => {
      this.setState({ members: response.data.data });
    })
    .catch( error => {
      console.log(error)
    })
  }
  inputOnchangehandler = event => {
    this.setState({ [event.target.name]: event.target.value });
  }
  onSubmithandler = event => {
    console.log("form telah disubmit")
    event.preventDefault();
    this.setState({buttonDisable:true})
    var payload = {
      first_name :this.state.first_name,
      last_name :this.state.last_name
    };
    var url = "";
    if (this.state.formStatus === "create") {
      url = "https://reqres.in/api/users";
    } else if (this.state.formStatus === "edit") {
      url = `https://reqres.in/api/users/${this.state.memberIdSelected}`;
    }
  };
  addMember = (url, payload) => {
      axios
    .post(url, payload)
    .then(response => {
      console.log(response);
      var members = [...this.state.members];
      members.push(response.data);
      this.setState({ members,buttonDisable:false, first_name:"",last_name:"" });
    })
    .catch(error => {
      console.log(error);
    });
  };
  editMember = (url, payload) => {
    axios
    .put(url, payload)
    .then(response => {
      var members = [...this.state.members]
      var indexmember = members.findIndex(
        member =>member.id === this.state.memberIdSelected
      );

      members[indexmember].first_name = response.data.first_name;
      members[indexmember].last_name = response.data.last_name; 

      this.setState({
        members,
        buttonDisable: false,
        first_name: "",
        last_name: "",
        formStatus: "create"
      });
    })
    .catch(error => {
      console.log(error)
    });
  }
  editButtonHandler = member => {
    this.setState ({
      first_name : member.first_name,
      last_name : member.last_name,
      formStatus : "Edit",
      memberIdSelected : member.id
    })
  }
  render() {
    return (
      <div className="container">
        <h1 style={{textAlign:"center"}}>Codepolitan Devschool</h1>
        <div className="row" style={{ paddingTop:"10px"}}>
            <div className="col-md-5 mt-xl" style={{border: "1px solid black", borderRadius:"10px", padding:"10" , boxShadow:"5px 7px lightGray"}}>
              <h2 style={{textAlign:"center"}}>Member</h2>
              <div className="row">
                {this.state.members.map((member,index) => (
                  <div className="col-md-6" key={member.id}>
                  <div className="card" style={{margin:10 ,textAlign:"center"}}>
                    <div className="card-body">
                      <h5 className="card-title">{member.id}</h5>
                      <h5 className="card-title">{member.first_name}</h5>
                      <h5 className="card-title">{member.last_name}</h5>
                      <button className="btn btn-primary" style={{padding:"10"}} onClick={() => this.editButtonHandler(member)}>Edit</button>
                      <button className="btn btn-danger">Delete</button>
                    </div>
                  </div>
                </div>
                ))}
              </div>  
            </div>
            <div className="col-md-2 mt-xl">
            </div>
            <div className="col-md-5 mt-xl" style={{border: "1px solid black", borderRadius:"10px" , boxShadow:"5px 7px lightGray", padding:10}}>
              <h2 style={{textAlign:"center"}}>Form {this.state.formStatus  }</h2>
              <form onSubmit={ this.onSubmithandler }>
                <div className="form-group" style={{marginBottom:10}}>
                  <label>First Name</label>
                  <input type="text" className="form-control" name="first_name" value={this.state.first_name} onChange={ this.inputOnchangehandler } />
                </div>
                <div className="form-group" style={{marginBottom:10}}>
                  <label>Last Name</label>
                  <input type="text" className="form-control" name="last_name" value={this.state.last_name}  onChange={ this.inputOnchangehandler }/>
                </div>
                <button type="submit" className="btn btn-primary"  style={{boxShadow:"3px 5px lightGray"}} disabled={ this.state.buttonDisable }>Submit</button>
              </form>
            </div>
        </div>
      </div>
    );
  }
}

export default App;
