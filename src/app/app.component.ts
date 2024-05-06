import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { ApiService } from './api.service';
import { Survey } from './survey.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent { 

surveyForm: FormGroup;
viewSurveyResults = false;
surveyList: Survey[] = [];

totalSurveys: number = 0;
ageAvg: number = 0;
oldestSurveyer: number = 0;
youngestSurveyer: number = 0;

pizzaPerc: number = 0;
pastaPerc: number = 0;
papNVorsPerc: number = 0;

movieAvg: number = 0;
radioAvg: number = 0;
tvAvg: number = 0;
outEatingAvg: number = 0;

constructor(private fb: FormBuilder, private surveyService: ApiService) {
  this.surveyForm = this.fb.group({
    fullName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    date: ['', Validators.required],
    tel: ['', Validators.required],
    favoriteFood: this.fb.array([]),
    movies: ['', Validators.required],
    radio: ['', Validators.required],
    eat: ['', Validators.required],
    TV: ['', Validators.required]
  });
}

handleCheckboxChange(event: Event): void {
  const target = event.target as HTMLInputElement;
  const value = target.value; // Get the value of the checked checkbox

  // Update the favoriteFood form array with the selected value
  const favoriteFoodArray = this.surveyForm.get('favoriteFood') as FormArray;
  if (target.checked) {
    favoriteFoodArray.push(this.fb.control(value));
  } else {
    // Remove the value if unchecked
    const index = favoriteFoodArray.controls.findIndex((control) => control.value === value);
    if (index !== -1) {
      favoriteFoodArray.removeAt(index);
    }
  }
}

  onSubmit() {
    this.saveSurvey(this.surveyForm.value);
  }

  saveSurvey(data: any) {
    this.surveyService.saveSurvey(data).subscribe(response => {
      alert(response.message)
    })
  }

  viewResultsFalse () { this.viewSurveyResults = false;}

  viewResultsTrue () { this.viewSurveyResults = true;}

  getSurveys() {
    this.viewResultsTrue();

    this.surveyService.getSurveys().subscribe( data => {
      console.log(data);
      this.totalSurveys = data.length;
      this.ageAvg = this.getageAvg(data);
      this.oldestSurveyer = this.getOldestSurveyer(data);
      this.youngestSurveyer = this.getYoungestSurveyer(data);

      this.pizzaPerc = this.computePizzaPercentage(data);
      this.pastaPerc = this.computePastaPercentage(data);
      this.papNVorsPerc = this.computePapWorsPercentage(data);

      this.movieAvg = this.computeAverageRating(data, 'movies');
      this.radioAvg = this.computeAverageRating(data, 'radio');
      this.outEatingAvg = this.computeAverageRating(data, 'eat');
      this.tvAvg = this.computeAverageRating(data, 'TV');
    })
  }

  computeAge(surveyData: any) {
    const ages = surveyData.map((survey: { date: any; }) => this.computeSingleAge(survey.date));
    return ages;
  }

  getOldestSurveyer(surveys: any) {
    return Math.max(...this.computeAge(surveys));
  }

  getYoungestSurveyer(surveys: any) {
    return Math.min(...this.computeAge(surveys));
  }

  calculateSum(previousValue: number, currentValue: number): number {
    previousValue += currentValue;
    return previousValue;
  }

  getageAvg(surveys: any) {
    const sum = this.computeAge(surveys).reduce(this.calculateSum, 0);
    return sum/surveys.length;
  }

 computePizzaPercentage(surveyData: Survey[]) {
    const pizzaLovers = surveyData.filter((survey) => survey.favoriteFood.includes('pizza'));
    return (pizzaLovers.length / surveyData.length) * 100;
  }

 computePastaPercentage(surveyData: Survey[]) {
    const pastaLovers = surveyData.filter((survey) => survey.favoriteFood.includes('pasta'));
    return (pastaLovers.length / surveyData.length) * 100;
  }

 computePapWorsPercentage(surveyData: Survey[]) {
    const papWorsLovers = surveyData.filter((survey) => survey.favoriteFood.includes('pap-wors'));
    return (papWorsLovers.length / surveyData.length) * 100;
  }

  computeAverageRating(surveyData: Survey[], field: string): number {
    const ratings = surveyData.map((survey: any) => survey[field]);
    const sum = ratings.reduce(this.calculateSum, 0);
    return sum / surveyData.length;
  }

  roundOffNums(base: number, decimalPlaces: number) {
    let factor: number = Math.pow(10, decimalPlaces);
    return Math.round(base * factor) / factor;
  }

  private computeSingleAge(dateOfBirth: any) {
    const dob = new Date(dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        return age - 1; // Subtract 1 year if birthday hasn't occurred yet this year
    }
    return age;
  }

}
