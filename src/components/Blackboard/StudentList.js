import React  from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import student from "../../assets/student.png";
import Avatar from '@material-ui/core/Avatar';
import classNames from 'classnames';
import { Component } from 'react';


const styles = {
  card: {
  },
  media: {
    height: 50,
  },
};

class Student extends Component {

  constructor(props) {
    super(props);

    this.state = {
      change: false
    };

    this.studentsList = []

    this.goToProfile = this.goToProfile.bind(this);
  }


  goToProfile(){

    var id_ = id;

    window.location = '/student-profile/' + id_;
  }

  test = (id, nom, prenom, idClasse) =>{

    for (var i = 0 ; i < this.studentsList.length ; i++){
      if (this.studentsList[i].includes(id)){
        document.getElementById(this.studentsList[i][0]).style.backgroundColor = "";
        var test = this.studentsList.splice(i, 1);
        this.props.choosen(this.studentsList.length);
        this.props.changeStudentArray(this.studentsList);
        return;
      }
    }

  if (this.studentsList.length < this.props.maxPlayers) {
    this.setState({change: true});
    this.studentsList.push([id, nom, prenom, idClasse]);
    document.getElementById(id).style.backgroundColor = "grey";
    this.props.choosen(this.studentsList.length);
    this.props.changeStudentArray(this.studentsList);
  }
  else{
  }
  }

  checkStudentId = (id) =>{
    for (var i = 0 ; i < this.studentsList.length ; i++){
      if (this.studentsList[i].includes(id))
        return true;
    }
    return false;
  }

  renderStudents() {

    const {classes} = this.props;

    let eleve = [];

    let obj = JSON.parse(this.props.students);
    if (obj != null) {

      const nbEleve = obj.length;

      var id = null;

      let classesLabel = {
        1: 'Petite section',
        2: 'Moyenne Section',
        3: 'Grande section',
        4: 'CP',
        5: 'CE1',
        6: 'CE2',
        7: 'CM1',
        8: 'CM2',
        9: '6e',
        10: '5e',
        11: '4e',
        12: '3e'};

      for (var i = 0; i < nbEleve; i++) {
        id = obj[i].idEleve;
        eleve.push(
          <div style={{width: '20%', display: 'inline-block', margin: '1%'}} key={i}>
            <Card style={{backgroundColor: this.checkStudentId.bind(this, id) ? '' : 'grey'}} id={id} className={classes.card} classes={{root: classes.card}} onClick={this.test.bind(this, id, obj[i].nomEleve, obj[i].prenomEleve, obj[i].idClasse)}>
              <CardActionArea>
                <Avatar
                  alt="Adelle Charles"
                  src={obj[i].picPath ? 'http://api.dune-table.com/files/eleves/' + obj[i].picPath : student}
                  className={classNames(classes.avatar, classes.bigAvatar)}
                  style={{margin: '0 auto', width: '40%', height: '40%', marginTop: '10%'}}
                />
                <CardContent>

                  <Typography gutterBottom style={{textAlign: 'center'}}>
                    {obj[i].nomEleve} {obj[i].prenomEleve}
                  </Typography>

                  <Typography gutterBottom style={{textAlign: 'center', fontWeight: 'bold'}}>
                    {classesLabel[obj[i].level]} {obj[i].num}
                  </Typography>

                </CardContent>
              </CardActionArea>
            </Card>
          </div>
        )
      }

    }

    if (eleve.length === 0){
      return <div>Aucun resultat trouve pour votre recherche.</div>
    }
    else
      return eleve;
  }

  render(){

    return (
      <div style={{textAlign: 'center'}}>
        {this.renderStudents()}
      </div>
    );
  }
}

Student.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Student);
