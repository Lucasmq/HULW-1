import React from 'react';
import './../App.css';
import { Input, Button, Card, CardBody, CardSubtitle, Label,FormGroup} from 'reactstrap';
//import { DropdownMenu, DropdownItem } from 'reactstrap';
import axios from 'axios';
import Decodificar from '../adminpage/decodifica';
import Codificar from '../adminpage/codifica';
import {Token} from '../login/Login';


var token = {
  headers:
  {
    'cache-control': 'no-cache',
    'x-access-token': Token(),
    accept: 'application/json',
    'content-type': 'application/json'
  }
};
const URL = 'http://hulw.herokuapp.com/' //'https://hulw.herokuapp.com/'

class cadastrotec extends React.Component {
  constructor(){
    super();
    this.state = {
      //unidades :[],
      nome: "",
      cpf: "",
      email: "",
      senha: "",
      //chefe: false,
      //unidade: "",
      dataAdm: "",
      flagEditar: false,
      id_usuario: "",
      token:"",
      cpf_Admin: "",
      is_adm: false

    };

    this.handleInputChange = this.handleInputChange.bind(this);

    this.onChange = (evento) => {
      this.setState({nome: evento.target.value});
      const state = Object.assign({}, this.state);
      const campo = evento.target.name;

      state[campo] = evento.target.value;

      this.setState(state);
      //if(campo === 'unidade' &&  evento.target.value === ''){
      // console.log( evento.target.value.length)
      // alert("Sem comentario")
      //}


    };
    //this.onSubmit = (evento) => { // ver os dados a serem enviados no console
    this.handleSubmit = event => {
      event.preventDefault();
      // var token = store.getState().session.token;
      //let token = localStorage.getItem('x-access-token');
      //alert(token)
      const usuario = {
        no_Pessoa: this.state.nome,

        cd_CPF: cpf2int(this.state.cpf),
        cd_Email: this.state.email,
        cd_Senha: this.state.senha,
        // chefe: this.state.chefe,
        // unidade: this.state.unidade,

        dt_Admissao: this.state.dataAdm+"T00:00:00.000Z",
        is_Adm: this.state.is_adm,
      };

      if(this.state.flagEditar === false){

        axios.post(`${URL}usuario`,JSON.stringify(usuario), token) //JSON.stringify(usuario)
        .then(res => {
          //console.log(res.Object.data);
          // console.log(res.data.msg);
          // alert(res.data.msg) // alerta sucesso ao cadastrar
          alert("Deu certo!")
          window.location.reload() // atualiza a página caso sucesso
        })
        .catch(error => {
          console.log(error)//.response)//.data.error.message);
          // alert(error.response)//.data.error.message) // alerta o erro ao submit
        });
      }else{
        // alert(JSON.stringify(usuario))
        axios.put(`${URL}usuario/`+this.state.id_usuario,JSON.stringify(usuario), token) //JSON.stringify(usuario)
        .then(res => {
          //console.log(res.Object.data);
          console.log(JSON.stringify(usuario)); // COMENTAR AQUI
          //alert(res) // alerta sucesso ao cadastrar
          alert("Deu certo!")
          window.location.reload() // atualiza a página caso sucesso
        })
        .catch(error => {
          // console.log(error.response);
          // alert(error.response) // alerta o erro ao submit
        });
      }
    };

  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.checked;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  pegaDados(){


    var cpfs = Decodificar((this.props.location.search).substring(1)); // função para decodificar
    //alert(cpfs);



    var cpfEditar = (cpfs).substring(0,11) // utf8.decode(bytes) // CPF para editar/cadastrar
    var tok = Token
    console.log(Token())
    if(cpfEditar !== ""){

      axios.get(`${URL}usuario/cpf/`+cpfEditar,token)                    //'http://localhost:3003/api/todos`)
      .then(res => {
        const usuarios = res.data;
        this.setState({ usuarios });
        this.setState({is_adm: usuarios.is_Adm, id_usuario: usuarios.id_Usuario, flagEditar: true, cpf: usuarios.cd_CPF,nome: usuarios.no_Pessoa, email: usuarios.cd_Email,dataAdm: (usuarios.dt_Admissao).substring(0,10)})
      })
    }
  }

  componentWillMount() {

    this.pegaDados();
  }


  render(){
    return (
      <div className="container">
        <div className="col-md-16">
          <Card  className="Card-position">
            <CardBody>

              <form onSubmit={this.handleSubmit}>
                <h3>Cadastro</h3>

                <div className="form-group">
                  <CardSubtitle>Nome: </CardSubtitle>
                  <Input  type="text"  className="form-control"  name="nome"
                    value={this.state.nome} onChange={this.onChange} required/>
                </div>

                <div className="form-group">
                  <CardSubtitle>Email: </CardSubtitle>
                  <input type="email" className="form-control"  name="email"
                    value={this.state.email} onChange={this.onChange} required/>
                </div>


                <FormGroup>
                  <Label for="exampleDate">Data de admissão</Label>
                  <Input type="date" name="dataAdm" placeholder="date placeholder" value={this.state.dataAdm} onChange={this.onChange} required/>
                </FormGroup>

                <div className="form-group">
                  <CardSubtitle>CPF: </CardSubtitle>
                  <Input  type="text"  className="form-control" name="cpf"
                    value={formatarCpf(this.state.cpf)} onChange={this.onChange} minLength='14' maxLength='14' placeholder="000.000.000-00" required/>
                </div>

                <div className="form-group">
                  <CardSubtitle>Senha: </CardSubtitle>
                  <input type="password" className="form-control"  name="senha"
                    value={this.state.senha} onChange={this.onChange} minLength='4'/>
                </div>

                <div>
                  <label>
                    <input name="is_adm" type="checkbox" checked={this.state.is_adm} onChange={this.handleInputChange}
                      />
                    Adminstrador
                  </label>
                </div>
                 {JSON.stringify(this.state)}
                 {/*tokenFunc*/}
                <div>
                  <Button onSubmit={this.handleSubmit} outline type="Submit" >{this.state.flagEditar === true ? "Editar" : "Cadastrar"}</Button>
                  <Button outline href={"/administrador"} className="a-fix">Voltar</Button>
                </div>


              </form>
            </CardBody>
          </Card>
        </div>
      </div>

    )

  }
}

function formatarCpf(cpf){
  cpf = cpf.replace(/\D/g,"");
  cpf = cpf.replace(/(\d{3})(\d)/,"$1.$2");
  cpf = cpf.replace(/(\d{3})(\d)/,"$1.$2");
  cpf = cpf.replace(/(\d{3})(\d{1,2})$/,"$1-$2");
  return cpf;
}

function cpf2int(cpf){
  cpf = cpf.replace(/[^0-9]+/g,'');

  return cpf;
}


export default cadastrotec;
