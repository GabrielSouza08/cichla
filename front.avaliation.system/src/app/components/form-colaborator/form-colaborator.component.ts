import { Component, OnInit } from '@angular/core';
import { Form } from './formColaborator';
import { FormGroup, FormControl } from '@angular/forms';
import { Options } from 'ng5-slider';
import { ColaboratorService } from 'src/app/services/colaborator.service';

@Component({
  selector: 'app-form-colaborator',
  templateUrl: './form-colaborator.component.html',
  styleUrls: ['./form-colaborator.component.css']
})
export class FormColaboratorComponent implements OnInit {

  userInfo;
  colaboratorInfo;

  listBehavior;
  behaviors;

  listTechnique;
  techniques;

  listChallenge;
  challenges;
  positonChallenge;

  formcolaborator: FormGroup;
  startChallengesNota1 = 0;
  startChallengesNota2 = 0;
  startChallengesNota3 = 0;

  startNewChallengesNota1 = 0;
  startNewChallengesNota2 = 0;
  startNewChallengesNota3 = 0;

  challengesNota1: Options = {
    showTicksValues: true,
    stepsArray: [
      { value: 0 },
      { value: 5 },
      { value: 10 },
      { value: 15 },
      { value: 20 },
      { value: 25 },
      { value: 30 },
      { value: 35 },
      { value: 40 },
      { value: 45 },
      { value: 50 },
      { value: 55 },
      { value: 60 },
      { value: 65 },
      { value: 70 },
      { value: 75 },
      { value: 80 },
      { value: 85 },
      { value: 90 },
      { value: 95 },
      { value: 100 }
    ]
  };
  challengesNota2: Options = {
    showTicksValues: true,
    stepsArray: [
      { value: 0 },
      { value: 5 },
      { value: 10 },
      { value: 15 },
      { value: 20 },
      { value: 25 },
      { value: 30 },
      { value: 35 },
      { value: 40 },
      { value: 45 },
      { value: 50 },
      { value: 55 },
      { value: 60 },
      { value: 65 },
      { value: 70 },
      { value: 75 },
      { value: 80 },
      { value: 85 },
      { value: 90 },
      { value: 95 },
      { value: 100 }
    ]
  };
  challengesNota3: Options = {
    showTicksValues: true,
    stepsArray: [
      { value: 0 },
      { value: 5 },
      { value: 10 },
      { value: 15 },
      { value: 20 },
      { value: 25 },
      { value: 30 },
      { value: 35 },
      { value: 40 },
      { value: 45 },
      { value: 50 },
      { value: 55 },
      { value: 60 },
      { value: 65 },
      { value: 70 },
      { value: 75 },
      { value: 80 },
      { value: 85 },
      { value: 90 },
      { value: 95 },
      { value: 100 }
    ]
  };

  newChallengesNota1: Options = {
    showTicksValues: true,
    stepsArray: [
      { value: 0 },
      { value: 5 },
      { value: 10 },
      { value: 15 },
      { value: 20 },
      { value: 25 },
      { value: 30 },
      { value: 35 },
      { value: 40 },
      { value: 45 },
      { value: 50 },
      { value: 55 },
      { value: 60 },
      { value: 65 },
      { value: 70 },
      { value: 75 },
      { value: 80 },
      { value: 85 },
      { value: 90 },
      { value: 95 },
      { value: 100 }
    ]
  };
  newChallengesNota2: Options = {
    showTicksValues: true,
    stepsArray: [
      { value: 0 },
      { value: 5 },
      { value: 10 },
      { value: 15 },
      { value: 20 },
      { value: 25 },
      { value: 30 },
      { value: 35 },
      { value: 40 },
      { value: 45 },
      { value: 50 },
      { value: 55 },
      { value: 60 },
      { value: 65 },
      { value: 70 },
      { value: 75 },
      { value: 80 },
      { value: 85 },
      { value: 90 },
      { value: 95 },
      { value: 100 }
    ]
  };
  newChallengesNota3: Options = {
    showTicksValues: true,
    stepsArray: [
      { value: 0 },
      { value: 5 },
      { value: 10 },
      { value: 15 },
      { value: 20 },
      { value: 25 },
      { value: 30 },
      { value: 35 },
      { value: 40 },
      { value: 45 },
      { value: 50 },
      { value: 55 },
      { value: 60 },
      { value: 65 },
      { value: 70 },
      { value: 75 },
      { value: 80 },
      { value: 85 },
      { value: 90 },
      { value: 95 },
      { value: 100 }
    ]
  };

  constructor(private colaboratorService: ColaboratorService) { }

  ngOnInit() {
    this.userInfo = JSON.parse(sessionStorage.getItem("userInfo"));

    // this.colaboratorInfo = JSON.parse(localStorage.getItem("colaboratorInfo"));

    // this.getDataAvaliation();

    this.createForm(new Form());
  }

  getDataAvaliation() {

    //* Pegar competencias
    this.colaboratorService.getBehavior(this.colaboratorInfo[0].ColaboradorId).subscribe(res => {
      this.listBehavior = res;
      this.organizerBehavior()

      //* Pegar Tecnicas
      this.colaboratorService.getTechnique(this.colaboratorInfo[0].ColaboradorId).subscribe(res => {
        this.listTechnique = res;
        this.organizeTechnique();

        //* Pegar Desafios
        this.colaboratorService.getChallenge(this.colaboratorInfo[0].ColaboradorName).subscribe(res => {
          this.listChallenge = res;
          this.positonChallenge = this.listChallenge.length - 1;
          this.organizeChallenge();
        });

      });

    });
  }

  organizerBehavior() {
    this.behaviors = [
      { descBehaviors: 'Absenteismo', obs: 'ObsAbsenteismo', behavior: 'Absenteísmo', peso: this.listBehavior[0].Absenteismo, description: 'Ausência do colaborador no ambiente de trabalho, ocasionando desorganização das atividades, queda na qualidade e limitação de desempenho.' },
      { descBehaviors: 'Comunicacao', obs: 'ObsComunicacao', behavior: 'Comunicação', peso: this.listBehavior[0].Comunicacao, description: 'Capacidade de expor verbalmente suas ideias de modo ordenado e objetivo. Se faz entender utilizando o idioma de modo padronizado (correção gramatical ) porém adequado ao público.' },
      { descBehaviors: 'CriatividadeInovacao', obs: 'ObsCriatividadeInovacao', behavior: 'Criatividade Inovação', peso: this.listBehavior[0].CriatividadeInovacao, description: 'Saber lidar com situações inesperadas, liberar o potencial criativo para fazer "diferença" Inovação em processo existente ou não, que possa trazer economia e/ou agilidade para a organização. Sair do automático.' },
      { descBehaviors: 'FocoResultado', obs: 'ObsFocoResultado', behavior: 'Foco Em Resultado', peso: this.listBehavior[0].FocoResultado, description: 'Busca sempre as praticas mais cabiveis para o atingimento de metas, gerando resultados concretos, consistente e com qualidade.' },
      { descBehaviors: 'Lideranca', obs: 'ObsLideranca', behavior: 'Liderança', peso: this.listBehavior[0].Lideranca, description: 'Capacidade de liderar pessoas ou processos, para o alcance de metas e desafios propostos. Apoio no aprendizado e desenvolvimento das pessoas estando ou não no cargo de lider.' },
      { descBehaviors: 'Relacionamento', obs: 'ObsRelacionamento', behavior: 'Relacionamento', peso: this.listBehavior[0].Relacionamento, description: 'Capacidade de interagir de maneira positiva , colocando-se no lugar do outro ( empatia), expressando opniões de forma clara e direta sem ofender o outro ( assertividade) , resultando no aumento da produtividade no ambiente de trabalho.' },
      { descBehaviors: 'Resilencia', obs: 'ObsResilencia', behavior: 'Resiliência', peso: this.listBehavior[0].Resilencia, description: 'Adapta-se a novas situações e contextos, mantendo a qualidade esperada e os compromissos assumidos. Trabalha sob pressão e stress preservando sua auto-conduta, clima construtivo e motivação sua e dos demais.' },
      { descBehaviors: 'TrabalhoEquipe', obs: 'ObsTrabalhoEquipe', behavior: 'Trabalho Em Equipe', peso: this.listBehavior[0].TrabalhoEquipe, description: 'Capacidade de interagir com os demais colaboradores ou 3os. de forma construtiva, buscando a sinergia do grupo.' },
      { descBehaviors: 'VisaoSistemica', obs: 'ObsVisaoSistemica', behavior: 'Visão Sistêmica', peso: this.listBehavior[0].VisaoSistemica, description: 'Capacidade de conhecer a empresa na sua totalidade aplicando seus conhecimentos e habilidades em processos de melhoriais continua."Pensar fora da caixa"' },
    ];
  }

  organizeTechnique() {
    this.techniques = [
      { descTechnique: 'Tecnica1', obs: 'ObsTecnica1', title: 'Competência técnica 1', description: this.listTechnique[0].Technique1, peso: this.listTechnique[0].Peso1 },
      { descTechnique: 'Tecnica2', obs: 'ObsTecnica2', title: 'Competência técnica 2', description: this.listTechnique[0].Technique2, peso: this.listTechnique[0].Peso2 },
      { descTechnique: 'Tecnica3', obs: 'ObsTecnica3', title: 'Competência técnica 3', description: this.listTechnique[0].Technique3, peso: this.listTechnique[0].Peso3 },
    ];
  }

  organizeChallenge() {
    // console.log(this.listChallenge)

    this.challenges = [
      { title: 'Desafio 1', description: this.listChallenge[this.positonChallenge].Desafio1, peso: this.listChallenge[this.positonChallenge].Peso1 },
      { title: 'Desafio 2', description: this.listChallenge[this.positonChallenge].Desafio2, peso: this.listChallenge[this.positonChallenge].Peso2 },
      { title: 'Desafio 3', description: this.listChallenge[this.positonChallenge].Desafio3, peso: this.listChallenge[this.positonChallenge].Peso3 },
    ];

    // console.log(this.challenges)
  }

  createForm(info: Form) {

    this.formcolaborator = new FormGroup({
      //* Notas
      Lideranca: new FormControl(info.lideranca),
      TrabalhoEquipe: new FormControl(info.trabalhoEquipe),
      FocoResultado: new FormControl(info.focoResultado),
      Comunicacao: new FormControl(info.comunicacao),
      Relacionamento: new FormControl(info.relacionamento),
      Resilencia: new FormControl(info.resilencia),
      Absenteismo: new FormControl(info.absenteismo),
      CriatividadeInovacao: new FormControl(info.criatividadeInovacao),
      VisaoSistemica: new FormControl(info.visaoSistemica),
      //* Observaçoes
      ObsLideranca: new FormControl(info.obsLideranca),
      ObsTrabalhoEquipe: new FormControl(info.obsTrabalhoEquipe),
      ObsFocoResultado: new FormControl(info.obsFocoResultado),
      ObsComunicacao: new FormControl(info.obsComunicacao),
      ObsRelacionamento: new FormControl(info.obsRelacionamento),
      ObsResilencia: new FormControl(info.obsResilencia),
      ObsAbsenteismo: new FormControl(info.obsAbsenteismo),
      ObsCriatividadeInovacao: new FormControl(info.obsCriatividadeInovacao),
      ObsVisaoSistemica: new FormControl(info.obsVisaoSistemica),
      //* Tecnicas
      Tecnica1: new FormControl(info.tecnica1),
      Tecnica2: new FormControl(info.tecnica2),
      Tecnica3: new FormControl(info.tecnica3),

      ObsTecnica1: new FormControl(info.obsTecnica1),
      ObsTecnica2: new FormControl(info.obsTecnica2),
      ObsTecnica3: new FormControl(info.obsTecnica3),
    });


  }

  onSubmit() {
    console.log(this.formcolaborator.value);
  }
}
