import { Component, signal } from '@angular/core';
import { SurveyModule } from 'survey-angular-ui';
import { Model } from 'survey-core';

import 'survey-core/survey-core.min.css';

@Component({
  selector: 'jdav-feedback',
  imports: [SurveyModule],
  templateUrl: './feedback.html',
  styleUrl: './feedback.css',
})
export class Feedback {
  surveyModel = signal<Model | null>(null);

  saveSurveyResults(sender: { data: any }) {
    console.log('Survey results: ', sender.data);
  }

  ngOnInit() {
    const survey = new Model({
      title: 'B123FB FreeRiden',
      description: 'Bei Anke und Ben',
      logoWidth: '688',
      logoHeight: 'auto',
      completedHtml: 'tbd',
      pages: [
        {
          name: 'page3',
          title: 'Dein Feedback ist uns sehr wichtig',
          elements: [
            {
              type: 'matrix',
              name: 'question2',
              title: 'Wie war',
              columns: [
                {
                  value: 'Column 1',
                  text: 'Gut',
                },
                {
                  value: 'Column 2',
                  text: 'Mies',
                },
                {
                  value: 'Column 3',
                  text: 'Mies hoch 2',
                },
                {
                  value: 'Column 4',
                  text: 'Grauenhaft',
                },
                {
                  value: 'Column 5',
                  text: '********',
                },
              ],
              rows: [
                {
                  value: 'Row 1',
                  text: 'das Essen',
                },
                {
                  value: 'Row 2',
                  text: 'der Inhalt',
                },
                {
                  value: 'Row 3',
                  text: 'Anke',
                },
                {
                  value: 'Row 4',
                  text: 'Ben',
                },
              ],
            },
            {
              type: 'comment',
              name: 'question1',
              title: 'Sonst noch was',
            },
          ],
        },
      ],
      calculatedValues: [
        {
          name: 'fullname-for-complete-page',
          expression: 'iif({full-name} notempty, {full-name}, guest)',
        },
      ],
      questionTitleLocation: 'left',
      questionDescriptionLocation: 'underInput',
      questionErrorLocation: 'bottom',
      completeText: 'Submit',
      widthMode: 'responsive',
      width: '768',
      headerView: 'advanced',
    });
    survey.onComplete.add(this.saveSurveyResults);
    this.surveyModel.set(survey);
  }
}
