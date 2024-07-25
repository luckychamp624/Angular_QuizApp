import { Component, OnInit } from '@angular/core';
import { QuestionService } from '../service/question.service';
import { interval } from 'rxjs';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss'],
})
export class QuestionComponent implements OnInit {
  public name: string = '';
  public questionList: any = [];
  public currentQuestion: number = 0;
  public points: number = 0;
  public time: number = 30;
  correctAnswer: number = 0;
  inCorrectAnswer: number = 0;
  interval$: any;
  progress: string = '0';
  quizCompleted:boolean=false;

  constructor(private questionService: QuestionService) {}
  ngOnInit(): void {
    this.name = localStorage.getItem('name')!;
    this.getAllQuestions();
    this.startTimer();
  }
  getAllQuestions() {
    this.questionService.getQuestionJson().subscribe((res) => {
      this.questionList = res.questions;
    });
  }
  nextQuestion() {
    this.currentQuestion++;
  }
  previousQuestion() {
    this.currentQuestion--;
  }
  Answer(currentQno: number, option: any) {
    if(currentQno === this.questionList.length){
      this.quizCompleted =true;
      this.startTimer();
    }
    if (option.correct) {
      this.points += 10;
      this.correctAnswer++;
      setTimeout(() =>{
      this.currentQuestion++;
        this.resetTimer();
        this.getProgress();
      },1000);
      // this.points = this.points +10
     
    } else {
      setTimeout(() =>{
      this.currentQuestion++;
      this.inCorrectAnswer++;
      this.resetTimer();
      this.getProgress();
      },1000);
      this.points -= 10;

    }
  }
  startTimer() {
    this.interval$ = interval(1000).subscribe((val) => {
      this.time--;
      if (this.time === 0) {
        this.currentQuestion++;
        this.time = 30;
        this.points -= 10;
      }
    });
    setTimeout(() => {
      this.interval$.unsubscribe();
    }, 300000);
  }
  stopTimer() {
    this.interval$.unsubscribe();
    this.time = 0;
  }
  resetTimer() {
    this.stopTimer();
    this.time = 30;
    this.startTimer();
  }
  refreshQuiz() {
    this.resetTimer();
    this.getAllQuestions();
    this.points = 10;
    this.time = 30;
    this.currentQuestion = 0;
    this.progress = '0';
  }
  getProgress() {
    this.progress = (
      (this.currentQuestion / this.questionList.length) *
      100
    ).toString();
    return this.progress;
  }
}
